<script setup>
import { useLocale } from 'vuetify/lib/framework.mjs'
// eslint-disable-next-line import/no-self-import
import HorizontalNavGroup from './HorizontalNavGroup.vue'
import HorizontalNavLink from './HorizontalNavLink.vue'
import { isAnyChildActive } from './utils'

const props = defineProps({
  navItem: {
    type: Object,
    required: true,
  },
})

const resolveNavLinkGroup = computed(() => {
  return navItem => {
    return navItem.children ? HorizontalNavGroup : HorizontalNavLink
  }
})

const { t } = useLocale()
</script>

<template>
  <VListItem
    :value="props.navItem.name"
    append-icon="mdi-chevron-right"
    :class="{ 'text-primary v-list-item--active': isAnyChildActive(props.navItem) }"
  >
    <template #prepend>
      <VIcon
        size="20"
        :icon="props.navItem.icon"
      />
    </template>

    {{ t(props.navItem.name) }}

    <VMenu
      activator="parent"
      location="end"
      offset="10"
      class="nav-content"
      open-on-hover
      content-class="horizontal-nav-menu-child-content"
    >
      <VList nav>
        <template
          v-for="item in props.navItem.children"
          :key="item.name"
        >
          <Component
            :is="resolveNavLinkGroup(item)"
            :nav-item="item"
          />
        </template>
      </VList>
    </VMenu>
  </VListItem>
</template>
