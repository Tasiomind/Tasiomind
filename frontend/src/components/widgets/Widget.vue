<template>
  <div
    :id="data.id"
    :class="['widget-container', { 'cursor-move': isEditing }]"
    :gs-id="data.id"
    :gs-x="data.grid.x"
    :gs-y="data.grid.y"
    :gs-w="data.grid.w"
    :gs-h="data.grid.h"
  >
    <div
      class="grid-stack-item-content group relative highlight-white/5 rounded-md shadow-md flex items-center justify-center"
      :class="{ 'cursor-move': isEditing }"
    >
      <component :is="widgetComponent" v-bind="data" />
      <Button
        variant="error"
        size="sm"
        v-if="isEditing"
        class="hidden group-hover:block absolute top-2 right-2"
        @click="deleteWidget"
        outline
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </Button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  isEditing: Boolean,
});

const emit = defineEmits(['delete']);
const deleteWidget = () => {
  emit('delete', props.data);
};

const getWidgetComponent = type => {
  switch (type) {
    case 'users':
      return defineAsyncComponent(() => import('@/components/user/users.vue'));
    case 'data':
      return defineAsyncComponent(() => import('@/components/datatables/DatatablesBasic.vue'));
    case 'chart':
      return defineAsyncComponent(() => import('@/components/charts/RadarChart.vue'));
    default:
      return null;
  }
};
const widgetComponent = computed(() => getWidgetComponent(props.data.type));
</script>

<style scoped></style>
