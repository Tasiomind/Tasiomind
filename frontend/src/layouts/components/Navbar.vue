<script setup>
import Logo from '@/assets/svg/Logo.vue';
import NavUserProfileMenu from '@/components/menu/NavUserProfileMenu.vue';
import { useAppConfig } from '@/composable/useAppConfig';
import { appConfig } from '@appConfig';
import { useLocale, useTheme } from 'vuetify';
import GlobalSearch from './NavSearchBar.vue';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:isDrawerOpen']);

const { theme, navigationMenu, isNavbarFixed } = useAppConfig();

const themeVuetify = useTheme();

watch(
  theme,
  () => {
    themeVuetify.global.name.value = theme.value;
  },
  { immediate: true },
);

const themeSwitcherIcon = computed(() => {
  return theme.value !== 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night';
});

const themeSwitcher = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

const { current, t } = useLocale();

const changeLocale = value => {
  current.value = value.toLowerCase();
  localStorage.setItem('app-locale', value.toLowerCase());
  document.querySelector('html')?.setAttribute('lang', value);
};

const emails = [];
</script>

<template>
  <VAppBar class="layout-navbar" :absolute="!isNavbarFixed">
    <div class="navbar-wrapper background">
      <!-- small screen navigation drawer toggler -->
      <VAppBarNavIcon
        v-show="$vuetify.display.mdAndDown"
        class="ms-n2"
        @click="emit('update:isDrawerOpen', !props.isDrawerOpen)"
      />

      <div
        v-if="navigationMenu === 'horizontal' && $vuetify.display.lgAndUp"
        class="text-primary d-flex align-center gap-1"
      >
        <Logo />
        <h6 class="text-h6 font-weight-bold text-gradient">
          {{ appConfig.title.value }}
        </h6>
      </div>

      <template v-if="navigationMenu === 'vertical'">
        <GlobalSearch />
      </template>

      <VSpacer />

      <template v-if="navigationMenu === 'horizontal'">
        <GlobalSearch>
          <VBtn icon>
            <VIcon icon="mdi-magnify" />
          </VBtn>
        </GlobalSearch>
      </template>

      <!-- light/dark theme switcher -->
      <VBtn :icon="themeSwitcherIcon" variant="text" @click="themeSwitcher" />

      <!-- translation -->
      <VBtn icon>
        <VIcon icon="mdi-translate" />

        <VMenu activator="parent">
          <VList>
            <VListItem
              v-for="(item, index) in [
                { name: 'English', abr: 'en' },
                { name: 'German', abr: 'de' },
              ]"
              :key="index"
              :value="index"
              :active="$vuetify.locale.current === item.abr"
              @click="changeLocale(item.abr)"
            >
              <VListItemTitle>{{ t(item.name) }}</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VBtn>

      <!-- user menu -->
      <NavUserProfileMenu />
    </div>
  </VAppBar>
</template>
