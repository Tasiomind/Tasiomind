<script setup>
import { useLocale } from 'vuetify';

const { t } = useLocale();

defineOptions({
  inheritAttrs: false,
});

// 👉 Is App Search Bar Visible
const isAppSearchBarVisible = ref(false);
const searchQuery = ref('');
const searchResult = ref([]);

// watch(searchQuery, () => {
//     params: {
//       q: searchQuery.value,
//     },
//   }).then(res => {
//     searchResult.value = res.data
//   })
// }, { immediate: true })

const LazyAppBarSearch = defineAsyncComponent(() => import('@/components/GlobalSearch.vue'));
</script>

<template>
  <div
    class="d-flex align-center cursor-pointer"
    v-bind="$attrs"
    style="user-select: none"
    @click="isAppSearchBarVisible = !isAppSearchBarVisible"
  >
    <slot>
      <!-- 👉 Search Trigger button -->
      <!-- close active tour while opening search bar using icon -->
      <VBtn icon size="x-small">
        <VIcon size="22" icon="mdi-magnify" />
      </VBtn>

      <span class="d-none d-md-flex align-center text-high-emphasis">
        <span class="text-sm me-3">{{ t('Search') }}</span>
        <span class="meta-key">CtrlK</span>
      </span>
    </slot>
  </div>

  <!-- 👉 App Bar Search -->
  <LazyAppBarSearch
    v-model:isDialogVisible="isAppSearchBarVisible"
    :search-results="searchResult"
    @search="searchQuery = $event"
  />
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  block-size: 1.5625rem;
  font-size: 11px;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
