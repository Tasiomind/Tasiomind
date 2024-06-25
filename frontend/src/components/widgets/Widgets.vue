<template>
  <div class="py-2 px-2.5 flex justify-end space-x-2">
    <VBtn v-if="isEditing" @click="addWidget">Add Widget</VBtn>
    <VBtn @click="toggleEdit" outline>
      {{ isEditing ? 'Stop Editing' : 'Start Editing' }}
    </VBtn>
  </div>
  <div class="grid-stack">
    <Widget
      v-for="widget in widgets"
      :key="widget.id"
      :data="widget"
      :is-editing="isEditing"
      @delete="deleteWidget"
    />
  </div>
</template>
<script setup>
import Widget from './Widget.vue';
import { useWidgetStore } from '@/stores/widgets.store';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';

const isEditing = ref(false);
const grid = ref(null);
const widgets = ref([
  { id: 1, type: 'chart', title: 'Widget 1', grid: { x: 0, y: 0, w: 2, h: 2 } },
]);

const initGridStack = () => {
  grid.value = GridStack.init({
    cellHeight: 100,
    margin: 10,
    minRow: 2,
    // float: false,
    // subGridDynamic: true,
    // acceptWidgets: true,
    disableResize: !isEditing.value,
    disableDrag: !isEditing.value,
  });
  makeWidgets(widgets.value);
};

const makeWidgets = widgets => {
  widgets.forEach(widget => {
    makeWidget(widget);
  });
};

const makeWidget = item => {
  const elSelector = `#${item.id}`;
  return grid.value.makeWidget(elSelector);
};

const addWidget = async () => {
  const widgetCount = widgets.value.length + 1;
  const widget = {
    id: widgetCount,
    title: `Widget ${widgetCount}`,
    type: 'users',
    grid: {
      w: 1,
      h: 1,
    },
  };
  widgets.value.push(widget);
  await nextTick();
  makeWidget(widget);
};

const deleteWidget = widget => {
  const index = widgets.value.findIndex(w => w.id === widget.id);
  if (index === -1) {
    return;
  }
  const selector = `#${CSS.escape(widget.id)}`;
  grid.value.removeWidget(selector);
  grid.value.compact();
  widgets.value.splice(index, 1);
};

const toggleEdit = () => {
  if (isEditing.value) {
    grid.value.disable();
  } else {
    grid.value.enable();
  }
  isEditing.value = !isEditing.value;
};

onMounted(() => {
  initGridStack();
});
</script>
