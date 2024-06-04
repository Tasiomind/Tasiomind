<script setup>
import { useLocale } from 'vuetify'
import VerticalNavLink from './VerticalNavLink.vue'

const prop = defineProps({
  navItem: {
    type: null,
    required: true,
  },
})

const { t } = useLocale()

const resolveNavLinkGroup = computed(() => {
  return navItem => navItem.children ? import('./VerticalNavGroup.vue') : VerticalNavLink
})
</script>

<template>
  <VListGroup
    v-if="prop.navItem"
    :value="prop.navItem.name"
  >
    <template #activator="{ props }">
      <VListItem
        v-bind="props"
        color="secondary"
        :prepend-icon="prop.navItem.icon"
        :title="t(prop.navItem.name)"
      />
    </template>

    <template
      v-for="item in prop.navItem.children"
      :key="item.name"
    >
      <Component
        :is="resolveNavLinkGroup(item)"
        :nav-item="item"
      />
    </template>
  </VListGroup>
</template>
