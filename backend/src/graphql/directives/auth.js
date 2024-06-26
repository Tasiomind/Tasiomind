import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError, ForbiddenError } from '@apollo/server';
import { GraphQLError, defaultFieldResolver } from 'graphql';
import { Fail, Success } from '~helpers/response';

import {
  AUTH_OWNER_STRATEGY,
  AUTH_ROLE_STRATEGY,
  AUTH_SCOPE_STRATEGY,
} from '~helpers/constants/auth';
import { UNAUTHENTICATED, UNAUTHORIZED } from '~helpers/constants/responseCodes';
import { ACCOUNT_STATUS } from '~helpers/constants/models';

const authDirectiveTransformer = (schema, directiveName) => {
  const typeDirectiveArgumentMaps = {};

  return mapSchema(schema, {
    [MapperKind.TYPE]: type => {
      const authDirective = getDirective(schema, type, directiveName)?.[0];
      if (authDirective) {
        typeDirectiveArgumentMaps[type.name] = authDirective;
      }
      return undefined;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const authDirective =
        getDirective(schema, fieldConfig, directiveName)?.[0] ??
        typeDirectiveArgumentMaps[typeName];
      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        const newFieldConfig = { ...fieldConfig };

        newFieldConfig.resolve = async (source, args, context, info) => {
          const { tokenInfo, sessionId, currentUser, isRootUser, isAdmin } = context;

          const isLoggedIn = tokenInfo && tokenInfo.sid === sessionId;
          if (!(currentUser && isLoggedIn)) {
            return Fail({
              message: UNAUTHENTICATED,
              code: UNAUTHENTICATED,
            });
          }

          if ([ACCOUNT_STATUS.BLOCKED, ACCOUNT_STATUS.LOCKED].includes(currentUser.status)) {
            throw new ForbiddenError(currentUser.status);
          }

          if (!isRootUser) {
            const { rules } = authDirective;
            if (rules) {
              const checks = rules.map(rule => {
                const { allow, identityClaim, roles, scopes } = rule;
                switch (allow) {
                  case AUTH_OWNER_STRATEGY:
                    return new Promise((resolve, reject) => {
                      const granted = isAdmin || source[identityClaim] === currentUser.id;
                      if (!granted) {
                        return reject(new ForbiddenError(UNAUTHORIZED));
                      }
                      return resolve(true);
                    });
                  case AUTH_ROLE_STRATEGY:
                    return new Promise((resolve, reject) => {
                      const granted = currentUser.hasRole(roles);
                      if (!granted) {
                        return reject(new ForbiddenError(UNAUTHORIZED));
                      }
                      return resolve(true);
                    });
                  case AUTH_SCOPE_STRATEGY:
                    return new Promise((resolve, reject) => {
                      const granted = currentUser.hasPermission(scopes);
                      if (!granted) {
                        return reject(new ForbiddenError(UNAUTHORIZED));
                      }
                      return resolve(true);
                    });
                  default:
                    return Promise.reject(new ForbiddenError(UNAUTHORIZED));
                }
              });

              try {
                await Promise.any(checks);
              } catch (e) {
                throw new ForbiddenError(UNAUTHORIZED);
              }
            }
          }

          return resolve(source, args, context, info);
        };

        return newFieldConfig;
      }
      return fieldConfig;
    },
  });
};

export default authDirectiveTransformer;
