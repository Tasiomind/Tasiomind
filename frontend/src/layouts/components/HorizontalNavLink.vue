<script setup>
import { useLocale } from 'vuetify'
import { isNavLinkActive } from './utils'

const props = defineProps({
  navItem: {
    type: Object,
    required: true,
  },
})

const { t } = useLocale()
</script>

<template>
  <template v-if="props.navItem">
    <VListItem
      v-if="props.navItem.to"
      :to="props.navItem.to"
      :active="isNavLinkActive(props.navItem)"
      :target="props.navItem.target ? props.navItem.target : ''"
    >
      <template #prepend>
        <VIcon
          :icon="props.navItem.icon"
          size="20"
          class="me-3"
        />
      </template>
      <VListItemTitle>{{ t(props.navItem.name) }}</VListItemTitle>
    </VListItem>

    <VListItem
      v-else
      :href="props.navItem.href"
      :active="isNavLinkActive(props.navItem)"
      :target="props.navItem.target ? props.navItem.target : ''"
    >
      <template #prepend>
        <VIcon
          :icon="props.navItem.icon"
          size="20"
          class="me-3"
        />
      </template>
      <VListItemTitle>{{ t(props.navItem.name) }}</VListItemTitle>
    </VListItem>
  </template>
</template>
