import {
  LoginWithEmail,
  RegisterWithEmail,
  RequestPasswordReset,
  ResetPassword,
  logout as logoutMutation,
  // RefreshToken,
} from '@mutations';
import { Me } from '@queries';
import { validateEmail, validatePassword } from '@/utils/validation';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: {},
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
      this.router.push({ name: 'home' });
      return data.loginWithEmail;
    },

    async register(register) {
      const { mutate } = useMutation(RegisterWithEmail);

      const { data } = await mutate(register);
      if (data.registerWithEmail.success) {
        this.router.push({ name: 'login' });
      } else {
        toast(data.registerWithEmail.message, {
          autoClose: 5000,
          type: 'error',
        });
      }
      return data.loginWithEmail;
    },

    async logout(all = false) {
      const { mutate } = useMutation(logoutMutation);
      await mutate({ all });
      this.clearAuthData();
      this.router.push({ name: 'login' });
    },

    async requestPasswordReset(email) {
      const { mutate } = useMutation(RequestPasswordReset);
      const { data } = await mutate({ email });
      if (data.requestPasswordReset.success) {
        toast(data.requestPasswordReset.message, {
          type: 'success',
        });
      } else {
        toast(data.requestPasswordReset.message, {
          type: 'error',
        });
      }
      return data.requestPasswordReset;
    },

    async resetPassword(token, password) {
      const { mutate } = useMutation(ResetPassword);
      const { data } = await mutate({ token, password });
      if (data.resetPassword.success) {
        toast(data.resetPassword.message, {
          type: 'success',
        });
        router.push({ name: 'login' });
      } else {
        toast(data.resetPassword.message, {
          type: 'error',
        });
      }
    },

    async refreshAuthToken() {
      const { mutate } = useMutation(RefreshToken);
      const { data } = await mutate();
    },

    hasAnyRole(roles = []) {
      if (!this.user || (!Array.isArray(this.user.roles) && !Array.isArray(roles))) {
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
    },

    clearAuthData() {
      this.user = null;
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
