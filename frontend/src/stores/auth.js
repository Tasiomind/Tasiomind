// src/stores/auth.js
import { defineStore } from 'pinia';
import { useMutation } from '@vue/apollo-composable';
import { LoginWithEmail, RequestPasswordReset, ResetPassword } from '@/plugins/graphql/mutations';
import { encrypt, decrypt } from '@/plugins/crypto';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
  }),

  actions: {
    async login(email, password) {
      const { mutate } = useMutation(LoginWithEmail);
      const { data } = await mutate({
        email: email,
        password: password,
      });
      if (data.loginWithEmail.success) {
        const tokenBash = encrypt(data.loginWithEmail.accessToken);
        this.tokenIv = tokenBash.iv;
        this.setToken(tokenBash.data);
        this.setUser(data.loginWithEmail.user);
      } else {
        throw new Error(data.loginWithEmail.message);
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('authToken');
    },
    async requestPasswordReset(email) {
      const { mutate } = useMutation(RequestPasswordReset);
      const { data } = await mutate({
        email: email,
      });
      if (!data.requestPasswordReset.success) {
        throw new Error(data.requestPasswordReset.message);
      }
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
    isAuthenticated() {
      if (!this.token) {
        return false;
      }

      try {
        // const decryptedToken = decrypt({this.token, this.tokenIv});

        // const tokenData = JSON.parse(decryptedToken);
        // if (tokenData.expiresAt < Date.now() || tokenData.isManipulated) {
        //   return false;
        // }

        return true;
      } catch (error) {
        console.error('Fehler beim Überprüfen des Tokens:', error);
        return false;
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
