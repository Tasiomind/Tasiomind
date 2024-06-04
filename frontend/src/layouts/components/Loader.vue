<script setup>
const bufferValue = ref(20)
const progressValue = ref(10)
const isFallbackState = ref(false)
const interval = ref(0)
const showProgress = ref(false)

watch([progressValue, isFallbackState], () => {
  if (progressValue.value > 80 && isFallbackState.value)
    progressValue.value = 82

  startBuffer()
})

function startBuffer() {
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    progressValue.value += Math.random() * (15 - 5) + 5
    bufferValue.value += Math.random() * (15 - 5) + 6
  }, 800)
}

const fallbackHandle = () => {
  showProgress.value = true
  progressValue.value = 10
  isFallbackState.value = true
  startBuffer()
}

const resolveHandle = () => {
  isFallbackState.value = false
  progressValue.value = 100

  setTimeout(() => {
    clearInterval(interval.value)
    progressValue.value = 0
    bufferValue.value = 20
    showProgress.value = false
  }, 300)
}

defineExpose({
  fallbackHandle,
  resolveHandle,
})
</script>

<template>
  <!-- loading state via #fallback slot -->
  <v-overlay
    v-if="showProgress"
    v-model="progressValue"
    :buffer-value="bufferValue"
    persistent
    class="align-center justify-center"
  >
    <div class="loader">
      <div class="ball bg-transparent">
        <v-icon class="w-100 h-100"> </v-icon>
      </div>
      <div class="ball" />
      <div class="ball" />
      <div class="ball" />
    </div>
  </v-overlay>
</template>


<style scoped>
.loader {
  position: relative;
  width: 70px;
  height: 70px;
}

.ball {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  -webkit-animation: jelly 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  animation: jelly 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.ball:nth-child(2) {
  z-index: -2;
  transform: scale(1.4);
  -webkit-animation: jelly2 2.5s 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    infinite;
  animation: jelly2 2.5s 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}
.ball:nth-child(3) {
  z-index: -3;
  transform: scale(1.8);
  -webkit-animation: jelly3 2.5s 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    infinite;
  animation: jelly3 2.5s 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}
.ball:nth-child(4) {
  z-index: -4;
  transform: scale(2.2);
  -webkit-animation: jelly4 2.5s 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    infinite;
  animation: jelly4 2.5s 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

@-webkit-keyframes jelly {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.6);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes jelly {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.6);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes jelly2 {
  0% {
    transform: scale(1.4);
  }
  45% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.4);
  }
}
@keyframes jelly2 {
  0% {
    transform: scale(1.4);
  }
  45% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.4);
  }
}
@-webkit-keyframes jelly3 {
  0% {
    transform: scale(1.8);
  }
  40% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1.8);
  }
}
@keyframes jelly3 {
  0% {
    transform: scale(1.8);
  }
  40% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1.8);
  }
}
@-webkit-keyframes jelly4 {
  0% {
    transform: scale(2.2);
  }
  35% {
    transform: scale(1.9);
  }
  100% {
    transform: scale(2.2);
  }
}
@keyframes jelly4 {
  0% {
    transform: scale(2.2);
  }
  35% {
    transform: scale(1.9);
  }
  100% {
    transform: scale(2.2);
  }
}
</style>
