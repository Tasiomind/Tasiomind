<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authForgotPasswordImg from '@/assets/pages/girl-forgot-something.png';
import Logo from '@/components/Logo.vue';
import { toast } from 'vue3-toastify';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { ResetPassword } from '@/plugins/graphql/mutations';

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const resetPasswordForm = ref({});
const isPasswordVisible = ref(true);
const theme = useTheme();
const password = ref('');
const token = ref(route.query.token);

const passwordRules = [
  v => !!v || t('Password is required'),
  v => v.length >= 8 || t('Password must be at least 8 characters'),
  v => /[A-Z]/.test(v) || t('Password must contain at least one uppercase letter'),
  v => /[a-z]/.test(v) || t('Password must contain at least one lowercase letter'),
  v => /[0-9]/.test(v) || t('Password must contain at least one number'),
  v => /[@$!%*?&#]/.test(v) || t('Password must contain at least one special character'),
];

const { mutate } = useMutation(ResetPassword);

const resetPassword = async () => {
  if (!resetPasswordForm.value) {
    return;
  }

  resetPasswordForm.value.validate().then(async isValid => {
    if (isValid) {
      try {
        const { data } = await mutate({
          token: token.value,
          password: password.value,
        });
        console.log(data);
        if (data.resetPassword.success) {
          toast(data.resetPassword.message, {
            type: 'success',
          });
          router.push({ name: 'login' });
        } else {
          toast(data.resetPassword.message, {
            type: 'error',
          });
        }
      } catch (error) {
        console.error(error);
        toast('An error occurred. Please try again.', { type: 'error' });
      }
    }
  });
};

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});
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
@use "@/styles/pages/auth.scss";
</style>
