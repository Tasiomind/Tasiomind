import { defineStore } from 'pinia';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { LoginWithEmail, RequestPasswordReset, ResetPassword } from '@/plugins/graphql/mutations';
import { encrypt, decrypt } from '@/plugins/crypto';
import { Me } from '@/plugins/graphql/queries';
import { saveUserData, saveAccessToken, saveRefreshToken, clearStorage } from './storage';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import {
  validateName,
  validateUsername,
  validateEmail,
  validatePassword,
} from '@/utils/validation';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
  }),

  actions: {
    async login(email, password) {
      const emailValidation = validateEmail(email);
      const passwordValidation = validatePassword(password);

      if (!emailValidation.isValid || !passwordValidation.isValid) {
        const messages = [];
        if (!emailValidation.isValid) {
          messages.push(emailValidation.message);
        }
        if (!passwordValidation.isValid) {
          messages.push(passwordValidation.message);
        }
        createToast(messages.join(' '));
        return;
      }

      const { mutate } = useMutation(LoginWithEmail);
      const { data } = await mutate({
        email: email,
        password: password,
      });
      if (data.loginWithEmail.success) {
        const tokenBash = encrypt(data.loginWithEmail.accessToken);
        this.tokenIv = tokenBash.iv;
        this.setToken(data.loginWithEmail.accessToken);
        this.setUser(data.loginWithEmail.user);
        return data.loginWithEmail;
      } else {
        return data.loginWithEmail;
      }
    },
    logout() {
      const router = useRouter();
      this.user = null;
      this.token = null;
      localStorage.removeItem('authToken');
      clearStorage();
      router.push('/login');
    },
    async requestPasswordReset(email) {
      const { mutate } = useMutation(RequestPasswordReset);
      const { data } = await mutate({
        email: email,
      });
      if (!data.requestPasswordReset.success) {
        return data.requestPasswordReset;
      }
    },
    async resetPassword(token, password) {
      const { mutate } = useMutation(ResetPassword);
      const { data } = await mutate({
        token: token,
        password: password,
      });
      if (!data.resetPassword.success) {
        return data.resetPassword;
      }
    },
    async isAuthenticated() {
      // try {
      //   const { loading, result, onResult } = useQuery(Me);
      //   const data = onResult((queryResult, context) => {
      //     const userData = queryResult.data.me;
      //     saveUserData(userData.user);
      //     return queryResult.data.me;
      //   });
      //   return true;
      // } catch (error) {
      //   console.error('Fehler beim Überprüfen des Tokens:', error);
      //   return false;
      // }
      return false;
    },
    async resetPassword(token, password) {
      const { mutate } = useMutation(ResetPassword);
      const { data } = await mutate({
        token: token,
        password: password,
      });
      if (!data.resetPassword.success) {
        throw new Error(data.resetPassword.message);
      }
    },
    async refrechToken() {
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
    async requestPasswordReset(email) {
      const { mutate } = useMutation(RequestPasswordReset);
      const { data } = await mutate({
        email: email,
      });
      if (!data.requestPasswordReset.success) {
        return data.requestPasswordReset;
      }
    },
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('authToken', token);
    },
  },
});
