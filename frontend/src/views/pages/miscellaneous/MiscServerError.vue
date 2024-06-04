<script setup>
import misc500 from '@/assets/pages/girl-sitting-airport.png'
</script>

<template>
  <div class="misc-wrapper text-center">
    <div class="w-100">
      <VImg
        :src="misc500"
        width="500"
        class="mx-auto"
      />
    </div>
    <h5 class="text-h5 font-weight-semibold mb-3">
      Internal server error 👨🏻‍💻
    </h5>
    <p>Oops, something went wrong!</p>
    <VBtn
      to="/"
      variant="outlined"
      color="primary"
    >
      Go to home page
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "@/styles/pages/misc.scss";
</style>
