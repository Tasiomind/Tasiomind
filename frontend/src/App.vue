<script setup>
import { useAppConfig } from "@/composable/useAppConfig";
import Blank from "@/layouts/Blank.vue";
import Default from "@/layouts/Default.vue";
import { appConfig } from "@appConfig";
import { useRouter } from "vue-router";

const route = useRouter();
const { initLoadingTheme, rootClasses } = useAppConfig();

const resolveLayoutVariant = computed(() => {
  if (route.currentRoute.value.meta.layout === "content") return Default;
  if (route.currentRoute.value.meta.layout === "blank") return Blank;

  return false;
});

// set rtl through @appConfig.js
const setAppRtl = computed(() => {
  if (appConfig.isRtl.value) return { rtl: true };
  else return {};
});

const classes = rootClasses();

initLoadingTheme();
</script>

<template>
  <VLocaleProvider v-bind="setAppRtl">
    <VApp :class="classes">
      <Component :is="resolveLayoutVariant" v-if="resolveLayoutVariant" />
    </VApp>
  </VLocaleProvider>
</template>
