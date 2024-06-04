export const getFromPaginatedListRoute = (apiname, path, init) => {
  const paginatedResult = ref({ items: [] });
  const loader = async (lastEvaluatedKey) => {
    if (lastEvaluatedKey) {
      init.headers ||= {};
      init.headers["x-last-evaluated-key"] = lastEvaluatedKey;
    }
    const result = await API.get(apiname, path, init);
    paginatedResult.value.items.push(...result.items);
    paginatedResult.value.lastEvaluatedKey = result.lastEvaluatedKey;
  };
  onMounted(loader);
  return {
    paginatedResult,
    loadMore: async (lastEvaluatedKey) => {
      await loader(lastEvaluatedKey);
    },
  };
};
