<script setup>
import miscNotAuthorized from "@/assets/pages/girl-acting-cool.png";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="misc-wrapper text-center">
    <div class="d-sm-flex justify-center w-100">
      <h1
        style="font-size: 130px"
        class="font-weight-bold mt-5 me-n16 d-none d-sm-block"
      >
        401
      </h1>
      <div class="ms-sm-n8">
        <VImg :src="miscNotAuthorized" width="400" />
      </div>
    </div>
    <h5 class="text-h5 font-weight-semibold mb-3">
      {{ t("You are not authorized!") }} 🔐
    </h5>

    <p>{{ t("not authorized Info") }}</p>
    <VBtn to="/" variant="outlined" color="primary">
      {{ t("backToHome") }}
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "@/styles/pages/misc.scss";
</style>
