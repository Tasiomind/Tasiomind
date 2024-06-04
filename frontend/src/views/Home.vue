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
import DataTable from "@/components/resource-table-data.vue";
import { useI18n } from "vue-i18n";

const { t, d } = useI18n();

const users = ref([]);
const rows = ref([]);

const fetchUsers = () => {
  // .get("api/users/list")
  // .then((response) => {
  //   users.value = response.data.users;
  //   rows.value = formatUsers(response.data.users);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
};

onMounted(fetchUsers);

const formatUsers = (user) => user.map(userItemFormater);

const getRoleColors = (role) => {
  const roleColors = {
    admin: "#FF5722",
    user: "#2196F3",
    moderator: "#4CAF50",
    editor: "#FFC107",
    guest: "#9E9E9E",
    developer: "#673AB7",
  };

  return roleColors[role] || "#000000";
};

const userItemFormater = (user) => {
  return {
    ...user,
    id: user.ID,
    status: {
      color: getRoleColors(user.role),
      title: user.role,
    },
    created_at: d(user.created_at, "short"),
    updated_at: d(user.updated_at, "short"),
  };
};

const headers = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: t("name"),
  },
  {
    key: "lastname",
    title: t("lastname"),
  },
  {
    key: "username",
    title: t("username"),
  },
  {
    key: "email",
    title: t("email"),
  },
  {
    key: "phoneNumber",
    title: t("phoneNumber"),
  },
  {
    key: "state",
    title: t("role"),
  },
  {
    key: "description",
    title: t("description"),
  },
  {
    key: "created_at",
    title: t("createdAt"),
  },
  {
    key: "updated_at",
    title: t("updatedAt"),
  },
];
</script>
