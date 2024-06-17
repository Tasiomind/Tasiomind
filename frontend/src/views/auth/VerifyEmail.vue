<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authForgotPasswordImg from '@/assets/pages/girl-forgot-something.png';
import Logo from '@/components/svg/Logo.vue';
import { toast } from 'vue3-toastify';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const theme = useTheme();
const token = ref(route.query.token);

const { mutate } = useMutation(ResetPassword);

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});

onMounted(() => {});
</script>

<template>
  <div class="auth-wrapper">
    <VCard max-width="900" :width="$vuetify.display.smAndDown ? '500' : 'auto'">
      <VRow no-gutters>
        <VCol md="6" cols="12" class="pa-sm-8 pa-4">
          <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
            <Logo />
            <h4 class="text-h4 text-primary">{{ t('appName') }}</h4>
          </VCardText>

          <VCardItem>
            <VCardTitle>{{ t('verifyEmailTitle') }}?</VCardTitle>
          </VCardItem>

          <VCardText>
            <p>
              {{ t('verifyEmailInfo') }}
            </p>
          </VCardText>
        </VCol>

        <VCol
          cols="6"
          class="pa-8 text-center border-s d-none d-md-block"
          :style="`background-image:url(${authBgThemeVariant});`"
        >
          <div class="d-flex align-center justify-center">
            <img width="280" :src="authForgotPasswordImg" />
          </div>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<style lang="scss">
@use '@/styles/pages/auth.scss';
</style>
