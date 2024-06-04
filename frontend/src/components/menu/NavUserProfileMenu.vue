<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t, d } = useI18n();
const user = ref({});
const router = useRouter();
const quickLinks = ref([]);

onMounted(async () => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    user.value = JSON.parse(storedUserData);
    quickLinks.value = [
      {
        title: t("Users"),
        to: "/users/list",
        icon: "mdi-account-group-outline",
      },
      {
        title: t("Edit"),
        to: "/edit/" + user.value.ID,
        icon: "mdi-account-group-outline",
      },
    ];
  }
});

const logOut = async () => {
  // localStorage.removeItem("userData");
  // router.replace({ name: "login" });
};

const usernameInitials = computed(() => {
  const first = user.value?.name?.charAt(0) ?? "?";
  const second = user.value?.lastname?.charAt(0) ?? "?";
  return first + second;
});
</script>

<template>
  <VAvatar class="cursor-pointer" color="red">
    <VImg v-if="avatar" :src="avatar" />
    <span class="text-h5">{{ usernameInitials }}</span>
    <VMenu activator="parent">
      <VList>
        <VListItem v-if="user" :append-avatar="avatar">
          <VListItemTitle>{{ user.name + " " + user.lastname }}</VListItemTitle>
          <VListItemSubtitle>{{ user.email }}</VListItemSubtitle>
        </VListItem>
        <VDivider class="mt-2" />
        <VListItem
          v-for="item in quickLinks"
          :key="item.title"
          :to="item.to"
          :append-icon="item.icon"
        >
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
        <VDivider />
        <VListItem append-icon="mdi-logout" @click="logOut">
          <VListItemTitle>{{ $t("Logout") }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VAvatar>
</template>
