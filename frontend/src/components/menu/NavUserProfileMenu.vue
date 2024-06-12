<script setup>
import { useI18n } from 'vue-i18n';
import { getUserData } from '@/stores/storage';
import { useAuthStore } from '@/stores/auth';

const { t, d } = useI18n();
const router = useRouter();
const quickLinks = ref([]);
const authStore = useAuthStore();
const user = computed(() => getUserData());

onMounted(async () => {
  quickLinks.value = [
    {
      title: t('Users'),
      to: '/users/list',
      icon: 'mdi-account-group-outline',
    },
    {
      title: t('Edit'),
      to: '/edit/',
      icon: 'mdi-account-group-outline',
    },
  ];
});

const logOut = async () => {
  authStore.logout();
};

const usernameInitials = computed(() => {
  if (user.value) {
    const first = user.value?.firstName?.charAt(0) ?? '?';
    const second = user.value?.lastName?.charAt(0) ?? '?';
    return first + second;
  }
  return '??';
});
</script>

<template>
  <VAvatar class="cursor-pointer" color="red">
    <VImg v-if="user?.socialAvatarURL" :src="user?.socialAvatarURL" />
    <span v-else class="text-h5">{{ usernameInitials }}</span>
    <VMenu activator="parent">
      <VList>
        <VListItem v-if="user" :append-avatar="avatar">
          <VListItemTitle>{{ user.firstName + ' ' + user.lastName }}</VListItemTitle>
          <!-- <VListItemSubtitle>{{ user.email }}</VListItemSubtitle> -->
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
          <VListItemTitle>{{ $t('Logout') }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VAvatar>
</template>
