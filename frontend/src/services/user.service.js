import { useMutation, useQuery } from '@vue/apollo-composable';
import { Users } from '@/plugins/graphql/queries';

export const getAllUsers = () => {
  const { onResult } = useQuery(Users);
  onResult(result => {
    if (result.data) {
      return result.data.me;
    }
  });
};
