<script setup>
import DataTable from "@/components/resource-table-data.vue";
import DatepickerBasic from "@/components/date-range-picker.vue";
import { useI18n } from "vue-i18n";
import { encrypt } from "@/plugins/crypto.js";

const { t, d } = useI18n();

// users
const users = ref([]);
const rows = ref([]);
const refUserForm = ref();

const userData = ref({
  name: "",
  email: "",
  company: "",
  role: "",
  status: "inactive",
});

const fetchUsers = () => {
  // .get("/api/users/list")
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
    button: {
      callback: (item) => {
        deleteUser(item.id);
      },
      icon: "mdi-delete-outline",
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
  {
    key: "button",
  },
];

// breadcrumbs
const breadcrumbs = [
  {
    title: "Home",
    disabled: false,
    to: { path: "/" },
  },
  {
    title: "User",
    disabled: true,
  },
  {
    title: "List",
    disabled: true,
  },
];

const roleItems = [
  { title: "Admin", value: "1" },
  { title: "User", value: "2" },
  { title: "Moderator", value: "3" },
  { title: "editor", value: "4" },
  { title: "guest", value: "5" },
  { title: "developer", value: "6" },
];

// getting chip color
const resolveChipColor = (value) => {
  if (value === "active") return "success";
  else if (value === "inactive") return "error";
  else return "warning";
};

const isAddUserDialogVisible = ref(false);

// delete user
const deleteUser = (userId) => {
  console.log(userId);
  // .delete(`/api/users/delete`, {
  //   data: {
  //     userID: userId,
  //   },
  // })
  // .then((response) => {
  //   if (response.status === 204) fetchUsers();
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
};

const addUser = async () => {
  const validation = await refUserForm.value?.validate();

  if (validation?.valid) {
    try {
      console.log(userData.value);
      var nameHash = encrypt(userData.value.name);
      var lastnameHash = encrypt(userData.value.lastname);
      var usernameHash = encrypt(userData.value.username);
      var emailHash = encrypt(userData.value.email);
      var roleHash = encrypt(userData.value.role);
      var phoneNumberHash = encrypt(userData.value.phoneNumber);
      var passwordHash = encrypt(userData.value.password);
      var descriptionsHash = encrypt(userData.value.descriptions);
      //   name: nameHash,
      //   lastname: lastnameHash,
      //   username: usernameHash,
      //   email: emailHash,
      //   role: roleHash,
      //   phoneNumber: phoneNumberHash,
      //   password: passwordHash,
      //   description: descriptionsHash,
      // });

      isAddUserDialogVisible.value = false;
      if (response.status === 201) fetchUsers();
    } catch (error) {
      console.error(error);
    }
  }
};
const createItems = [
  {
    label: t("AddNewUser"),
    callback: () => {
      isAddUserDialogVisible.value = !isAddUserDialogVisible.value;
    },
    icon: "create",
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
        :searchHidden="false"
        :createItems="createItems"
      />

      <VDialog v-model="isAddUserDialogVisible" width="1000">
        <VCard :title="t('AddNewUser')">
          <VCardText>
            <VForm ref="refUserForm" @submit.prevent="addUser">
              <VRow>
                <VCol md="6" cols="12">
                  <VTextField
                    v-model="userData.name"
                    :label="t('name')"
                    :rules="[(v) => !!v || t('nameIsRequired')]"
                  />
                </VCol>
                <VCol md="6" cols="12">
                  <VTextField
                    v-model="userData.lastname"
                    :label="t('lastname')"
                    :rules="[(v) => !!v || t('lastnameIsRequired')]"
                  />
                </VCol>
                <VCol md="6" cols="12">
                  <VTextField
                    v-model="userData.username"
                    :label="t('username')"
                    :rules="[(v) => !!v || t('usernameIsRequired')]"
                  />
                </VCol>
                <VCol md="6" cols="12">
                  <VTextField
                    v-model="userData.email"
                    :label="t('email')"
                    :rules="[(v) => !!v || t('emailIsRequired')]"
                  />
                </VCol>

                <VCol md="6" cols="12">
                  <VTextField
                    v-model="userData.phoneNumber"
                    :label="t('phoneNumber')"
                    :rules="[(v) => !!v || t('phoneNumberIsRequired')]"
                  />
                </VCol>

                <VCol md="6" cols="12">
                  <VSelect
                    v-model="userData.role"
                    :items="roleItems"
                    item-title="title"
                    item-value="value"
                    :label="t('role')"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="userData.password"
                    :label="t('password')"
                    :rules="[(v) => !!v || t('passwordIsRequired')]"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="userData.descriptions"
                    placeholder="Descriptions..."
                    label="Descriptions"
                    :rules="[(v) => !!v || 'Descriptions filed is required']"
                    rows="3"
                  />
                </VCol>

                <VCol cols="12">
                  <VBtn
                    color="success"
                    variant="tonal"
                    type="submit"
                    class="me-4"
                  >
                    {{ t("Submit") }}
                  </VBtn>
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    type="reset"
                    @click="isAddUserDialogVisible = false"
                  >
                    {{ t("Cancel") }}
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VDialog>
    </VCol>
  </VRow>
</template>
