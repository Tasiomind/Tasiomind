<template>
  <VFooter class="v-layout-footer">
    <div class="v-footer-content d-flex align-center flex-wrap">
      <span>
        {{ t("craftedWith") }}
        <VIcon icon="mdi-heart" color="error" /> {{ t("by") }}
        <strong>Aland Mariwan</strong> © 2024
      </span>

      <VSpacer />

      <div class="d-none d-md-block">
        <VBtn
          color="primary"
          variant="text"
          href="https://me.tasiomind.de/"
          target="_blank"
          rel="Me"
        >
          Me
        </VBtn>
      </div>
    </div>
  </VFooter>
</template>
<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
