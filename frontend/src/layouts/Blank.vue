<script setup>
import SuspenseLoader from "./components/Loader.vue";

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false);
const refLoadingIndicator = ref(null);

// watching if the fallback state is active and the refLoadingIndicator component is available
watch(
  [isFallbackStateActive, refLoadingIndicator],
  () => {
    if (isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.fallbackHandle();

    if (!isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.resolveHandle();
  },
  {
    immediate: true,
  }
);

// !SECTION
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense
      :timeout="0"
      @fallback="isFallbackStateActive = true"
      @resolve="isFallbackStateActive = false"
    >
      <Component :is="Component" />
    </Suspense>
  </RouterView>

  <SuspenseLoader ref="refLoadingIndicator" />
</template>
