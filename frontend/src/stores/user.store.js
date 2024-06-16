import { defineStore } from 'pinia';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { Me } from '@/plugins/graphql/queries';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser() {
      const { onResult } = useQuery(Me);
      onResult(result => {
        if (result.data) {
          this.user = result.data.me;
        }
      });
    },

    setUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});
