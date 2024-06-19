<script setup>
import DataTable from '@/components/resource-table-data.vue';
import DatepickerBasic from '@/components/date-range-picker.vue';
import { useI18n } from 'vue-i18n';
import { encrypt } from '@/plugins/crypto.js';
import { getAllUsers } from '@/services/user.service';
import AddUser from '@/components/user/addUser.vue';
const { t, d } = useI18n();

// users
const users = ref([]);
const rows = ref([]);
const refUserForm = ref();

const userData = ref({
  name: '',
  email: '',
  company: '',
  role: '',
  status: 'inactive',
});

const fetchUsers = async () => {
  getAllUsers().then(response => {
    users.value = response.users.items;
    console.log(users.value);
    rows.value = formatUsers(response.users.items);
  });
};

onMounted(fetchUsers);

const formatUsers = user => user.map(userItemFormater);

const getRoleColors = role => {
  const roleColors = {
    root: '#F44339',
    admin: '#FF5722',
    user: '#2196F3',
    moderator: '#4CAF50',
    editor: '#FFC107',
    guest: '#9E9E9E',
    developer: '#673AB7',
  };

  return roleColors[role] || '#000000';
};

const userItemFormater = user => {
  return {
    ...user,
    roles: user.roles.map(role => ({
      name: role.name,
      color: getRoleColors(role.name),
    })),
    button: {
      callback: item => {
        deleteUser(item.id);
      },
      icon: 'mdi-delete-outline',
    },
    createdAt: d(user.createdAt, 'short'),
    updatedAt: d(user.updatedAt, 'short'),
  };
};

const headers = [
  {
    key: 'id',
    title: 'ID',
  },
  {
    key: 'firstName',
    title: t('name'),
  },
  {
    key: 'lastName',
    title: t('lastname'),
  },
  {
    key: 'username',
    title: t('username'),
  },
  {
    key: 'email',
    title: t('email'),
  },
  {
    key: 'phoneNumber',
    title: t('phoneNumber'),
  },
  {
    key: 'roles',
    title: t('role'),
  },
  {
    key: 'locale',
    title: t('locale'),
  },
  {
    key: 'status',
    title: t('status'),
  },
  {
    key: 'createdAt',
    title: t('createdAt'),
  },
  {
    key: 'updatedAt',
    title: t('updatedAt'),
  },
  {
    key: 'button',
  },
];

// breadcrumbs
const breadcrumbs = [
  {
    title: 'Home',
    disabled: false,
    to: { path: '/' },
  },
  {
    title: 'User',
    disabled: true,
  },
  {
    title: 'List',
    disabled: true,
  },
];

const roleItems = [
  { title: 'Admin', value: '1' },
  { title: 'User', value: '2' },
  { title: 'Moderator', value: '3' },
  { title: 'editor', value: '4' },
  { title: 'guest', value: '5' },
  { title: 'developer', value: '6' },
];

// getting chip color
const resolveChipColor = value => {
  if (value === 'active') return 'success';
  else if (value === 'inactive') return 'error';
  else return 'warning';
};

const isAddUserDialogVisible = ref(false);

// delete user
const deleteUser = userId => {
  console.log(userId);
};

const createItems = [
  {
    label: t('AddNewUser'),
    callback: () => {
      isAddUserDialogVisible.value = !isAddUserDialogVisible.value;
    },
    icon: 'create',
  },
];
</script>

<template>
  <VRow>
    <!-- Breadcrumbs -->
    <VCol cols="12">
      <VBreadcrumbs :items="breadcrumbs" divider="-" class="px-0" />
    </VCol>
    <VCol cols="12">
      <!-- Datatable -->
      <DataTable
        :headers="headers"
        :rows="rows"
        :tableTitle="t('Users')"
        :isCellsSearchHiddenBTN="true"
        :searchHidden="true"
        :createItems="createItems"
      />
      <AddUser v-model="isAddUserDialogVisible" />
    </VCol>
  </VRow>
</template>
