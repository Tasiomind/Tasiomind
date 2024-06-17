import { defineStore } from 'pinia';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  LoginWithEmail,
  RequestPasswordReset,
  ResetPassword,
  logout as logoutMutation,
  // RefreshToken,
} from '@/plugins/graphql/mutations';
import { Me } from '@/plugins/graphql/queries';
import { validateEmail, validatePassword } from '@/utils/validation';
import {  saveAccessToken, saveRefreshToken, clearStorage } from './storage';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
  }),

  actions: {
    validateInputs(email, password) {
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);

      if (!emailValidation.isValid || !passwordValidation.isValid) {
        const messages = [];
        if (!emailValidation.isValid) messages.push(emailValidation.message);
        if (!passwordValidation.isValid) messages.push(passwordValidation.message);
        return false;
      }
      return true;
    },

    async login(email, password) {
      if (!this.validateInputs(email, password)) return;

      const { mutate } = useMutation(LoginWithEmail);
      const { data } = await mutate({ email, password });
      this.setUser(data.loginWithEmail.user);
      this.router.push({ name: 'home' })
      return data.loginWithEmail;
    },

    async logout(all = false) {
      const { mutate } = useMutation(logoutMutation);
      await mutate({ all });
      this.clearAuthData();
      console.log( this.router.push({ name: 'login' }).catch(err => {}))
    },

    async requestPasswordReset(email) {
      const { mutate } = useMutation(RequestPasswordReset);
      const { data } = await mutate({ email });
      return data.requestPasswordReset;
    },

    async resetPassword(token, password) {
      const { mutate } = useMutation(ResetPassword);
      const { data } = await mutate({ token, password });
      if (!data.resetPassword.success) {
        throw new Error(data.resetPassword.message);
      }
    },

    async refreshAuthToken() {
      const { mutate } = useMutation(RefreshToken);
      const { data } = await mutate();
      if (data.refreshToken.success) {
        saveAccessToken(data.refreshToken.accessToken);
        saveRefreshToken(data.refreshToken.refreshToken);
        this.setToken(data.refreshToken.accessToken);
      } else {
        return data.refreshToken;
      }
    },

    hasAnyRole(roles) {
      if (!this.user || !Array.isArray(this.user.roles)) {
        return false;
      }
      if (this.user.roles.some(userRole => userRole.name === 'root')) {
        return true;
      }

      return roles.some(role =>
        this.user.roles.some(userRole => {
          return userRole.name === role;
        }),
      );
    },
    hasAnyPermission(permissions) {
      return (
        this.user && permissions.some(permission => this.user.permissions.includes(permission))
      );
    },

    setUser(user) {
      this.user = user;
      localStorage.setItem('me', JSON.stringify(user));
    },

    clearAuthData() {
      this.user = null;
      localStorage.removeItem('me');
      clearStorage();
    },
    async isAuthenticated() {
      const { result, onResult } = useQuery(Me);

      const data = await new Promise(resolve => {
        onResult(result => {
          if (result.data) {
            resolve(result.data);
          }
        });
      });

      if (data) {
        this.setUser(data.me.user);
        return data.me.success;
      }

      return false;
    },
  },
  getters: {
    getUser() {
      return this.user;
    },

    isAuthenticatedWithRole() {
      return this.user && this.user.roles.length > 0;
    },
    isAuthenticatedWithRouter() {
      if (this.user) return this.router.push('/');
    },
  },
});
