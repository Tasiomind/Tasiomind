<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authRegisterImg from '@/assets/pages/working-laptop-while-sitting-chair.png';
import Logo from '@/assets/svg/Logo.vue';

import { useAuthStore } from '@/stores/auth.store';
import {
  validateName,
  validateUsername,
  validateEmail,
  validatePassword,
} from '@/utils/validation';

const { t } = useI18n();
const registerForm = ref();
const isPasswordVisible = ref(true);
const isContentExpand = ref(true);
const theme = useTheme();
const authStore = useAuthStore();

const registerData = ref({});

const errors = ref({
  firstName: false,
  lastName: false,
  username: false,
  email: false,
  password: false,
});

const firstNameRules = [
  v => {
    const { isValid, message } = validateName(v, t);
    errors.value.firstName = !isValid;
    return isValid || t(message);
  },
];

const lastNameRules = [
  v => {
    const { isValid, message } = validateName(v, t);
    errors.value.lastName = !isValid;
    return isValid || t(message);
  },
];

const usernameRules = [
  v => {
    const { isValid, message } = validateUsername(v, t);
    errors.value.username = !isValid;
    return isValid || t(message);
  },
];

const emailRules = [
  v => {
    const { isValid, message } = validateEmail(v, t);
    errors.value.email = !isValid;
    return isValid || t(message);
  },
];

const passwordRules = [
  v => {
    const { isValid, message } = validatePassword(v, t);
    errors.value.password = !isValid;
    return isValid || t(message);
  },
];

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});

const submit = () => {
  registerForm.value?.validate().then(async isValid => {
    if (isValid.valid) {
      authStore.register(registerData.value);
    }
  });
};
</script>

<template>
  <div class="auth-wrapper">
    <VCard max-width="1500" class="auth-card" :width="$vuetify.display.smAndDown ? '500' : 'auto'">
      <VRow no-gutters>
        <VCol md="6" cols="12" class="pa-sm-8 pa-4">
          <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
            <Logo />
            <h4 class="text-h4 text-primary">{{ t('appName') }}</h4>
          </VCardText>

          <VCardItem>
            <VCardTitle>{{ t('Register') }}</VCardTitle>

            <template #append>
              <RouterLink
                :to="{ name: 'login' }"
                class="text-body-2 text-medium-emphasis d-block d-md-none"
              >
                {{ t('Login') }}
              </RouterLink>
            </template>
          </VCardItem>

          <VCardText>
            <VForm ref="registerForm" @submit.prevent="submit">
              <VExpandTransition>
                <div v-show="isContentExpand">
                  <VRow no-gutters>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="registerData.firstName"
                        :label="t('name')"
                        :rules="firstNameRules"
                        class="mb-6 pr-4"
                        required
                      />
                    </VCol>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="registerData.lastName"
                        :label="t('lastname')"
                        :rules="lastNameRules"
                        class="mb-6"
                        required
                      />
                    </VCol>
                    <VCol md="12" cols="12">
                      <VTextField
                        v-model="registerData.username"
                        :label="t('username')"
                        :rules="usernameRules"
                        class="mb-6"
                        required
                      />

                      <VTextField
                        v-model="registerData.email"
                        :label="t('email')"
                        :rules="emailRules"
                        :error-messages="errors.email"
                        class="mb-6"
                        required
                      />
                    </VCol>
                  </VRow>

                  <VBtn
                    block
                    color="primary"
                    :disabled="
                      errors.firstName || errors.lastName || errors.username || errors.email
                    "
                    @click="isContentExpand = !isContentExpand"
                  >
                    {{ t('$vuetify.stepper.next') }}
                  </VBtn>
                </div>
              </VExpandTransition>

              <VExpandTransition>
                <div v-show="!isContentExpand">
                  <div
                    class="d-flex align-center border rounded py-1 px-2 mb-6"
                    :style="
                      !registerData.email ? 'border-color:rgb(var(--v-theme-error)) !important' : ''
                    "
                  >
                    <span class="text-caption">{{ registerData.email }}</span>

                    <VSpacer />

                    <VBtn
                      size="small"
                      color="primary"
                      variant="text"
                      @click="isContentExpand = !isContentExpand"
                    >
                      {{ t('change') }}
                    </VBtn>
                  </div>

                  <VTextField
                    v-model="registerData.password"
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

                  <VBtn
                    block
                    type="submit"
                    color="primary"
                    :disabled="
                      errors.firstName ||
                      errors.lastName ||
                      errors.username ||
                      errors.email ||
                      errors.password
                    "
                  >
                    {{ t('Register') }}
                  </VBtn>
                </div>
              </VExpandTransition>
            </VForm>
          </VCardText>
        </VCol>

        <VCol
          cols="6"
          class="pa-8 text-center border-s d-none d-md-block"
          :style="`background-image:url(${authBgThemeVariant});`"
        >
          <div class="d-flex align-center justify-center">
            <img width="280" :src="authRegisterImg" />
          </div>

          <h6 class="text-body-1 font-weight-semibold mb-3">{{ t('alreadyRegistered') }} ?</h6>
          <p class="text-body-2">
            {{ t('alreadyRegisteredInfo') }}
          </p>
          <VBtn variant="outlined" color="primary" :to="{ name: 'login' }" append-icon="mdi-login">
            {{ t('Login') }}
          </VBtn>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<style lang="scss">
@use '@/styles/pages/auth.scss';
</style>
