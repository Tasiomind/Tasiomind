<script setup>
import miscUnderMaintenance from '@/assets/pages/girl-with-gear-wheels.png'
</script>

<template>
  <div class="misc-wrapper text-center">
    <div class="w-100">
      <VImg
        :src="miscUnderMaintenance"
        width="400"
        class="mx-auto"
      />
    </div>
    <h5 class="text-h5 font-weight-semibold mb-3">
      Under Maintenance! 🚧
    </h5>

    <p>
      Sorry for the inconvenience but we're performing some maintenance at the moment
    </p>
    <VBtn
      to="/"
      variant="outlined"
      color="primary"
    >
      Back to home
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "@/styles/pages/misc.scss";
</style>
