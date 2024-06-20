<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authForgotPasswordImg from '@/assets/pages/girl-forgot-something.png';
import Logo from '@/assets/svg/Logo.vue';
import { validateEmail } from '@/utils/validation';
import { useAuthStore } from '@/stores';

const { t } = useI18n();
const forgetPasswordForm = ref();
const theme = useTheme();
const email = ref('');
const authStore = useAuthStore();

const errors = ref({ email: false });

const emailRules = [
  v => {
    const { isValid, message } = validateEmail(v, t);
    errors.value.email = !isValid;
    return isValid || t(message);
  },
];
const sendResetLink = async () => {
  if (!forgetPasswordForm.value) {
    return;
  }

  forgetPasswordForm.value.validate().then(async isValid => {
    if (isValid) {
      await authStore.requestPasswordReset(email.value);
    }
  });
};

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});
</script>

<template>
  <div class="auth-wrapper">
    <VCard max-width="900" class="auth-card" :width="$vuetify.display.smAndDown ? '500' : 'auto'">
      <VRow no-gutters>
        <VCol md="6" cols="12" class="pa-sm-8 pa-4">
          <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
            <Logo />
            <h4 class="text-h4 text-primary">{{ t('appName') }}</h4>
          </VCardText>

          <VCardItem>
            <VCardTitle>{{ t('Forgot Password') }}?</VCardTitle>
          </VCardItem>

          <VCardText>
            <p>
              {{ t('ForgotPasswordInfo') }}
            </p>

            <VForm ref="forgetPasswordForm" @submit.prevent="sendResetLink">
              <VRow>
                <VCol cols="12">
                  <VTextField v-model="email" label="Email" :rules="emailRules" required />
                </VCol>

                <VCol cols="12">
                  <VBtn block type="submit" color="primary" class="mb-3">
                    {{ t('SendResetLink') }}
                  </VBtn>

                  <VBtn
                    block
                    variant="text"
                    color="secondary"
                    size="small"
                    prepend-icon="mdi-chevron-double-left"
                    :to="{ name: 'login' }"
                  >
                    Back to login
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
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
