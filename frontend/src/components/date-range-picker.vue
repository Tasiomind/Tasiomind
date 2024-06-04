<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";

const date = ref(null);
</script>

<template>
  <VueDatePicker
    v-model="date"
    range
    :teleport="true"
    :enable-time-picker="false"
  />
</template>

<style lang="scss">
@use "@/styles/libs/vue-datepicker.scss";
</style>
