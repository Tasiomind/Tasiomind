<template>
  <DataTable
    :headers="headers"
    :rows="rows"
    :tableTitle="t('Users')"
    :isCellsSearchHiddenBTN="true"
    :searchHidden="false"
  />
</template>
<script setup>
import DataTable from '@/components/resource-table-data.vue';
import { useI18n } from 'vue-i18n';
import { getAllUsers } from '@/services/user.service';

const { t, d } = useI18n();

const users = ref([]);
const rows = ref([]);

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
    root: '#F44336',
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
];
</script>
