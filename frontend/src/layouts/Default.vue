<script setup>
import BackToTop from '@/components/BackToTop.vue'
import { useAppConfig } from '@/composable/useAppConfig'
import Footer from '@/layouts/components/Footer.vue'
import HorizontalNav from '@/layouts/components/HorizontalNav.vue'
import Navbar from '@/layouts/components/Navbar.vue'
import VerticalNav from '@/layouts/components/VerticalNav.vue'
import { appConfig } from '@appConfig'
import SuspenseLoader from './components/Loader.vue'

const { navigationMenu } = useAppConfig()
const isVerticalNavExpand = ref(false)

// set vertical or horizontal menu as default
const isVerticalMenu = computed(() => {
  return navigationMenu.value !== 'horizontal'
})

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

// watching if the fallback state is active and the refLoadingIndicator component is available
watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, {
  immediate: true,
})

// !SECTION
</script>

<template>
  <template v-if="$vuetify.display.mdAndDown ? true : isVerticalMenu">
    <VerticalNav
      v-model:is-drawer-open="isVerticalNavExpand"
      class="d-print-none"
    />
  </template>

  <template v-else>
    <HorizontalNav
      :is-horizontal-layout="$vuetify.display.mdAndDown ? false : !isVerticalMenu"
      class="d-print-none"
    />
  </template>

  <!-- back to top -->
  <BackToTop />

  <!-- navbar -->
  <Navbar
    v-model:is-drawer-open="isVerticalNavExpand"
    class="d-print-none"
  />

  <SuspenseLoader ref="refLoadingIndicator" />

  <!-- main content -->
  <VMain
    class="layout-page-content"
    :class="isVerticalMenu ? 'with-vertical-nav' : 'with-horizontal-nav'"
  >
    <VContainer
      :fluid="!appConfig.isBoxLayout.value"
      class="layout-page-content-wrapper"
    >
      <RouterView v-slot="{ Component }">
        <Suspense
          :timeout="0"
          @fallback="isFallbackStateActive = true"
          @resolve="isFallbackStateActive = false"
        >
          <Component :is="Component" />
        </Suspense>
      </RouterView>
    </VContainer>
    <Footer class="d-print-none" />
  </VMain>
</template>
