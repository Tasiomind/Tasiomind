<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authForgotPasswordImg from '@/assets/pages/girl-forgot-something.png';
import Logo from '@/components/svg/Logo.vue';

import { validatePassword } from '@/utils/validation';
import { useAuthStore } from '@/stores';

const route = useRoute();
const authStore = useAuthStore();

const { t } = useI18n();
const resetPasswordForm = ref({});
const isPasswordVisible = ref(true);
const theme = useTheme();
const password = ref('');
const token = ref(route.query.token);
const errors = ref({ password: false });

const passwordRules = [
  v => {
    const { isValid, message } = validatePassword(v);
    errors.value.password = !isValid;
    return isValid || t(message);
  },
];

const resetPassword = async () => {
  if (!resetPasswordForm.value) {
    return;
  }

  await authStore.resetPassword(token.value, password.value);
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
            <VCardTitle>{{ t('Reset Password') }}?</VCardTitle>
          </VCardItem>

          <VCardText>
            <p>
              {{ t('ResetPasswordInfo') }}
            </p>

            <VForm ref="resetPasswordForm" @submit.prevent="resetPassword">
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="password"
                    :type="isPasswordVisible ? 'password' : 'text'"
                    :label="t('password')"
                    :rules="passwordRules"
                    :append-inner-icon="
                      isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                    "
                    class="mb-6"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    required
                  />
                </VCol>

                <VCol cols="12">
                  <VBtn block type="submit" color="primary" class="mb-3">
                    {{ t('Reset Password') }}
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
