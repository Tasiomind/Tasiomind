import { useMutation, useQuery } from '@vue/apollo-composable';
import { Users } from '@/plugins/graphql/queries';

export const getAllUsers = async () => {
  const { onResult } = useQuery(Users);
  const data = await new Promise(resolve => {
    onResult(result => {
      if (result.data) {
        resolve(result.data);
      }
    });
  });
  return data;
};
