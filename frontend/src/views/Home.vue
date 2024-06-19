<template>
  <!-- <DataTable
    :headers="headers"
    :rows="rows"
    :tableTitle="t('Users')"
    :isCellsSearchHiddenBTN="true"
    :searchHidden="false"
  /> -->
  <div>
    <button @click="toggleEdit">Toggle Edit</button>
    <button @click="addWidget">Add Widget</button>
    <div ref="gridContainer" class="grid-stack"></div>
  </div>
</template>

<script setup>
// import DataTable from '@/components/resource-table-data.vue';
// import { useI18n } from 'vue-i18n';
// import { getAllUsers } from '@/services/user.service';
import Widget from '@/components/Widget.vue';
import { useWidgetStore } from '@/stores/widgets.store';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';

const grid = ref(null);
const gridContainer = ref(null);
const widgetStore = useWidgetStore();

const initGridStack = () => {
  grid.value = GridStack.init(
    {
      column: 4,
      cellHeight: 100,
      margin: 10,
      disableResize: !widgetStore.isEditing,
      disableDrag: !widgetStore.isEditing,
    },
    gridContainer.value,
  );
  makeWidgets(widgetStore.widgets);
};

const makeWidgets = widgets => {
  widgets.forEach(widget => {
    makeWidget(widget);
  });
};

const makeWidget = item => {
  const el = document.createElement('div');
  el.id = `widget-${item.id}`;
  el.innerHTML = `<div class="grid-stack-item-content">${item.title}</div>`;
  el.dataset.gsX = item.grid.x;
  el.dataset.gsY = item.grid.y;
  el.dataset.gsWidth = item.grid.w;
  el.dataset.gsHeight = item.grid.h;
  gridContainer.value.appendChild(el);
  grid.value.makeWidget(el);
};

const addWidget = async () => {
  const widgetCount = widgetStore.widgets.length + 1;
  const widget = {
    id: widgetCount,
    title: `Widget ${widgetCount}`,
    grid: {
      w: 1,
      h: 1,
    },
  };
  widgetStore.addWidget(widget);
  await nextTick();
  makeWidget(widget);
};

const deleteWidget = widget => {
  const index = widgetStore.widgets.findIndex(w => w.id === widget.id);
  if (index === -1) {
    return;
  }
  const selector = `#widget-${widget.id}`;
  grid.value.removeWidget(selector);
  grid.value.compact();
  widgetStore.deleteWidget(widget.id);
};

const toggleEdit = () => {
  if (!grid.value) return;

  if (widgetStore.isEditing) {
    grid.value.disable();
  } else {
    grid.value.enable();
  }
  widgetStore.toggleEdit();
};

onMounted(() => {
  initGridStack();
});

// onMounted(fetchUsers);

// const formatUsers = users => users.map(userItemFormatter);

// const getRoleColors = role => {
//   const roleColors = {
//     root: '#F44336',
//     admin: '#FF5722',
//     user: '#2196F3',
//     moderator: '#4CAF50',
//     editor: '#FFC107',
//     guest: '#9E9E9E',
//     developer: '#673AB7',
//   };
//   return roleColors[role] || '#000000';
// };

// const userItemFormatter = user => ({
//   ...user,
//   roles: user.roles.map(role => ({
//     name: role.name,
//     color: getRoleColors(role.name),
//   })),
//   createdAt: d(user.createdAt, 'short'),
//   updatedAt: d(user.updatedAt, 'short'),
// });

// const headers = [
//   { key: 'id', title: 'ID' },
//   { key: 'firstName', title: t('name') },
//   { key: 'lastName', title: t('lastname') },
//   { key: 'username', title: t('username') },
//   { key: 'email', title: t('email') },
//   { key: 'phoneNumber', title: t('phoneNumber') },
//   { key: 'roles', title: t('role') },
//   { key: 'locale', title: t('locale') },
//   { key: 'status', title: t('status') },
//   { key: 'createdAt', title: t('createdAt') },
//   { key: 'updatedAt', title: t('updatedAt') },
// ];
</script>
<style scoped>
.grid-stack {
  position: relative;
  width: 100%;
  height: 100%;
}
.grid-stack-item-content {
  background-color: #18bc9c;
  color: #fff;
  text-align: center;
  line-height: 100px;
}
</style>
