<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authLoginImg from '@/assets/pages/working-desk-with-laptop.png';
import Logo from '@/components/Logo.vue';

import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { validateEmail, validatePassword } from '@/utils/validation';
import { toast } from 'vue3-toastify';

const router = useRouter();
const { t } = useI18n();
const theme = useTheme();
const authStore = useAuthStore();

const loginData = ref({
  email: '',
  password: '',
});

const errors = ref({
  email: {
    value: false,
    message: '',
  },
  password: {
    value: false,
    message: '',
  },
});

const isPasswordVisible = ref(false);
const isContentExpanded = ref(true);
const submitDisabled = ref(true);

const authBgThemeVariant = computed(() => (theme.current.value.dark ? authBgDark : authBgLight));

const validateEmailRule = value => {
  const { isValid, message } = validateEmail(value);
  errors.value.email = {
    value: !isValid,
    message: t(message),
  };
  return isValid;
};

const validatePasswordRule = value => {
  const { isValid, message } = validatePassword(value);
  errors.value.password = {
    value: !isValid,
    message: t(message),
  };
  return isValid;
};

const login = async () => {
  if (errors.value.email.value || errors.value.password.value) return;

  const { email, password } = loginData.value;
  const data = await authStore.login(email, password);

  if (data.success) {
    toast(t(data.message), { type: 'success' });
    router.push({ name: 'home' });
  } else {
    handleLoginError(data);
  }
};

const handleLoginError = ({ message }) => {
  toast(message, { type: 'error' });

  if (message === 'IncorrectPassword') {
    errors.value.password = {
      value: true,
      message: 'Incorrect Password',
    };
  } else if (message === 'IncorrectEmail') {
    errors.value.email = {
      value: true,
      message: 'Incorrect Email',
    };
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <VCard max-width="1000" :width="$vuetify.display.smAndDown ? '700' : 'auto'">
      <VRow class="h-[40rem]" no-gutters>
        <VCol md="6" cols="12" class="pa-sm-9 pa-4" style="block-size: 33rem">
          <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
            <Logo />
            <h4 class="text-h4 text-primary">{{ t('appName') }}</h4>
          </VCardText>
          <VCardItem>
            <VCardTitle class="text-3xl font-bold underline">{{ t('Login') }}</VCardTitle>
            <VCardSubtitle>{{ t('LoginInfo') }}</VCardSubtitle>
            <template #append>
              <RouterLink
                :to="{ name: 'register' }"
                class="text-body-2 text-medium-emphasis d-block d-md-none"
              >
                {{ t('Register') }}
              </RouterLink>
            </template>
          </VCardItem>
          <VCardText>
            <VAlert color="info" variant="tonal" class="mb-6">
              <strong>DEMO</strong>
              <p class="mb-1">
                <strong>{{ t('email') }}:</strong> <span>admin@admin.com</span>
              </p>
              <p class="mb-0">
                <strong>{{ t('password') }}:</strong> <span>admin</span>
              </p>
            </VAlert>
            <VForm ref="loginForm" @submit.prevent="login">
              <VExpandTransition>
                <div v-show="isContentExpanded">
                  <VTextField
                    v-model="loginData.email"
                    label="Email"
                    :rules="[validateEmailRule]"
                    class="mb-6"
                    :error-messages="errors.email.message"
                    required
                  />
                  <VTextField
                    v-model="loginData.password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :label="t('password')"
                    :rules="[validatePasswordRule]"
                    :append-inner-icon="
                      isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                    "
                    class="mb-6"
                    :error-messages="errors.password.message"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    required
                  />
                  <div class="text-center mb-6">
                    <RouterLink :to="{ name: 'forgot-password' }">
                      {{ t('Forgot Password') }}
                    </RouterLink>
                  </div>
                  <VBtn
                    block
                    type="submit"
                    color="primary"
                    :disabled="errors.email.value || errors.password.value"
                  >
                    {{ t('Login') }}
                  </VBtn>
                </div>
              </VExpandTransition>
            </VForm>
          </VCardText>
        </VCol>
        <VCol
          cols="6"
          class="pa-8 text-center border-s d-none d-md-block"
          :style="`background-image:url(${authBgThemeVariant.value});`"
        >
          <div class="d-flex align-center justify-center">
            <img width="280" :src="authLoginImg" />
          </div>
          <h6 class="text-body-1 font-weight-semibold mb-3">
            {{ t('RegisterBody1') }}
          </h6>
          <p class="text-body-2">{{ t('RegisterBody2') }}</p>
          <VBtn
            :to="{ name: 'register' }"
            variant="outlined"
            color="primary"
            append-icon="mdi-account-plus-outline"
          >
            {{ t('Register') }}
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<style lang="scss">
@use '@/styles/pages/auth.scss';
</style>
