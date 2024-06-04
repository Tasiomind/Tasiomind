<script setup>
import miscComingSoon from '@/assets/pages/girl-checking-time-her-watch.png'
</script>

<template>
  <div class="misc-wrapper text-center">
    <div class="w-100">
      <VImg
        :src="miscComingSoon"
        width="400"
        class="mx-auto"
      />
    </div>
    <h5 class="text-h5 font-weight-semibold mb-3">
      We are launching soon 🚀
    </h5>

    <p>Our website is opening soon. Please register to get notified when it's ready!</p>
    <VForm @submit.prevent="() => {}">
      <div class="d-flex align-center justify-center gap-4 flex-wrap">
        <VTextField
          placeholder="Enter your email"
          density="compact"
          style="inline-size: 17.5rem;"
        />

        <VBtn
          type="submit"
          variant="outlined"
          color="primary"
          size="large"
        >
          Subscribe
        </VBtn>
      </div>
    </VForm>
  </div>
</template>

<style lang="scss">
@use "@/styles/pages/misc.scss";
</style>
