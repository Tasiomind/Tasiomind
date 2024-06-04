<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authRegisterImg from '@/assets/pages/working-laptop-while-sitting-chair.png';
import Logo from '@/components/Logo.vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { toast } from 'vue3-toastify';
import { encrypt } from '@/plugins/crypto.js';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@vue/apollo-composable';
import { RegisterWithEmail } from '@/plugins/graphql/mutations';

const { t } = useI18n();
const registerForm = ref();
const router = useRouter();
const route = useRoute();
const isPasswordVisible = ref(true);
const isContentExpand = ref(true);
const theme = useTheme();

const registerData = ref({});

const errors = ref({
  email: '',
  password: '',
});

const { mutate, onDone, onError } = useMutation(RegisterWithEmail);

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});

const register = () => {
  registerForm.value?.validate().then(async isValid => {
    if (isValid.valid) {
      await mutate({
        firstName: registerData.value.firstName,
        lastName: registerData.value.lastName,
        username: registerData.value.username,
        email: registerData.value.email,
        password: registerData.value.password,
      })
        .then(({ data }) => {
          toast('Registration successful', {
            autoClose: 5000,
            type: 'success',
          });
          router.replace(route.query.to ? String(route.query.to) : '/');
        })
        .catch(error => {
          toast('Registration failed', {
            autoClose: 5000,
            type: 'error',
          });
          errors.value.email = error.response.data.email;
          errors.value.username = error.response.data.username;
        });
    }
  });
};
</script>

<template>
  <div class="auth-wrapper">
    <VCard max-width="1500" :width="$vuetify.display.smAndDown ? '500' : 'auto'">
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
            <VForm ref="registerForm" @submit.prevent="register">
              <VExpandTransition>
                <div v-show="isContentExpand">
                  <VRow no-gutters>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="registerData.firstName"
                        :label="t('name')"
                        :rules="[v => !!v || t('nameIsRequired')]"
                        class="mb-6 pr-4"
                      />
                    </VCol>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="registerData.lastName"
                        :label="t('lastname')"
                        :rules="[v => !!v || t('lastnameIsRequired')]"
                        class="mb-6"
                      />
                    </VCol>
                    <VCol md="12" cols="12">
                      <VTextField
                        v-model="registerData.username"
                        :label="t('username')"
                        :rules="[v => !!v || t('usernameIsRequired')]"
                        class="mb-6"
                      />

                      <VTextField
                        v-model="registerData.email"
                        :label="t('email')"
                        :rules="[v => !!v || t('emailIsRequired')]"
                        :error-messages="errors.email"
                        class="mb-6"
                      />
                    </VCol>
                  </VRow>

                  <VBtn block color="primary" @click="isContentExpand = !isContentExpand">
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
                    :rules="[v => !!v || t('passwordIsRequired')]"
                    :append-inner-icon="
                      isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                    "
                    class="mb-6"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <VBtn block type="submit" color="primary"> register </VBtn>
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
@use "@/styles/pages/auth.scss";
</style>
