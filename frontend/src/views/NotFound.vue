<script setup>
import mics404 from "@/assets/pages/error-message-404.png";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="misc-wrapper text-center">
    <div class="w-100">
      <VImg :src="mics404" width="500" class="mx-auto" />
    </div>
    <h5 class="text-h5 font-weight-semibold mb-3">{{ t("PageNotFound") }}</h5>
    <p>
      {{ t("PageNotFoundInfo") }}
    </p>
    <VBtn to="/" variant="outlined" color="primary">{{ t("backToHome") }}</VBtn>
  </div>
</template>

<style lang="scss">
@use "@/styles/pages/misc.scss";
</style>
