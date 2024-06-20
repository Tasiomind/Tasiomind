<script setup>
import Logo from '@/assets/svg/Logo.vue';
import { useAppConfig } from '@/composable/useAppConfig';
import verticalItems from '@/menus/vertical';
import { appConfig } from '@appConfig';
import { useLocale } from 'vuetify';
import VerticalNavGroup from './VerticalNavGroup.vue';
import VerticalNavLink from './VerticalNavLink.vue';
import { isGroupActive } from './utils';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.store';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
});
const authStore = useAuthStore();

const emit = defineEmits(['update:isDrawerOpen']);
const router = useRouter();
const { t, d } = useI18n();

const { isVerticalMenuMini, isSemiDark, skins } = useAppConfig();
const OpenedGroup = ref([]);

const resolveNavLinkGroup = computed(() => {
  return navItem => (navItem.children ? VerticalNavGroup : VerticalNavLink);
});

const filterNavItems = computed(() => {
  return verticalItems.filter(item =>
    authStore.hasAnyRole(router.resolve(item.to).meta.requiredRoles),
  );
});

OpenedGroup.value = isGroupActive(verticalItems);

// remove group active when only link active
const handleGroupClose = () => {
  OpenedGroup.value = [''];
};
</script>

<template>
  <VNavigationDrawer
    touchless
    :rail="$vuetify.display.lgAndUp ? isVerticalMenuMini : false"
    :expand-on-hover="$vuetify.display.lgAndUp ? isVerticalMenuMini : false"
    :model-value="$vuetify.display.lgAndUp ? true : props.isDrawerOpen"
    :rail-width="skins === 'modern' ? 95 : 80"
    width="260"
    :theme="isSemiDark ? 'dark' : undefined"
    :permanent="$vuetify.display.lgAndUp"
    class="layout-vertical-nav"
    @update:model-value="val => $emit('update:isDrawerOpen', val)"
  >
    <div class="d-flex flex-column h-100">
      <!-- title and logo -->
      <div
        class="d-flex align-center justify-space-between overflow-hidden gap-4 pa-4"
        style="min-block-size: 65px"
      >
        <div class="d-flex align-center text-primary gap-2">
          <!-- logo -->
          <Logo />

          <!-- title -->
          <h6
            class="app-title text-h6 text-medium-emphasis font-weight-semibold"
            :class="$vuetify.display.lgAndUp && isVerticalMenuMini ? 'rail-mode-is-on' : ''"
          >
            <span class="text-gradient">{{ appConfig.title.value }}</span>
          </h6>
        </div>

        <!-- toggle rail mode in medium and up screen -->
        <VBtn
          v-if="$vuetify.display.lgAndUp"
          icon
          variant="plain"
          size="x-small"
          :class="isVerticalMenuMini ? 'rail-mode-is-on' : ''"
          @click="isVerticalMenuMini = !isVerticalMenuMini"
        >
          <VIcon
            size="20"
            :icon="isVerticalMenuMini ? 'mdi-circle-outline' : 'mdi-radiobox-marked'"
          />
        </VBtn>

        <!-- close nav in small screen -->
        <VBtn
          v-else
          icon
          variant="text"
          size="x-small"
          @click="$emit('update:isDrawerOpen', false)"
        >
          <VIcon size="24" icon="mdi-close" />
        </VBtn>
      </div>

      <!-- navigation list -->
      <VList
        v-model:opened="OpenedGroup"
        nav
        density="compact"
        open-strategy="single"
        class="layout-vertical-nav-list text-high-emphasis"
      >
        <template v-for="navItem in filterNavItems" :key="navItem.title">
          <VListSubheader v-if="navItem.heading" class="text-uppercase font-weight-bold">
            {{ t(navItem.heading) }}
          </VListSubheader>

          <Component
            :is="resolveNavLinkGroup(navItem)"
            v-else
            :nav-item="navItem"
            @close-group="handleGroupClose"
          />
        </template>
      </VList>
    </div>
  </VNavigationDrawer>
</template>
