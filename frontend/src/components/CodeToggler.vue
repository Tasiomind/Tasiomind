<script setup>
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'vue-prism-component'

const props = defineProps({
  language: {
    type: String,
    default: 'javascript',
  },
  code: {
    type: String,
    default: '',
  },
})

const isCodeVisible = ref(false)
</script>

<template>
  <VCardActions class="code-actions border-t py-1">
    <span class="text-sm ms-2">View Code</span>

    <VSpacer />

    <VBtn
      size="small"
      icon="mdi-xml"
      @click="isCodeVisible = !isCodeVisible"
    />
  </VCardActions>

  <VExpandTransition>
    <div v-show="isCodeVisible">
      <Prism :language="props.language">
        {{ props.code }}
      </Prism>
    </div>
  </VExpandTransition>
</template>

<style lang="scss">
pre[class*="language-"] {
  margin: 0;
}

.code-actions {
  block-size: auto;
  min-block-size: auto;
}
</style>
