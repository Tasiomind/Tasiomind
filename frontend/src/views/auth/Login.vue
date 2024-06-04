<script setup>
import authBgDark from '@/assets/pages/auth-bg-dark.svg';
import authBgLight from '@/assets/pages/auth-bg-light.svg';
import authLoginImg from '@/assets/pages/working-desk-with-laptop.png';
import Logo from '@/components/Logo.vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
// const { mutate, onDone, onError } = useMutation(LoginWithEmail);

const { t } = useI18n();
const loginForm = ref();
const isPasswordVisible = ref(true);
const isContentExpand = ref(true);
const theme = useTheme();
const authStore = useAuthStore();
const loginData = ref({});

const errors = ref({
  email: '',
  password: '',
});

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});

const router = useRouter();
const route = useRoute();

const login = async () => {
  if (!loginForm.value) {
    console.error('Login-Formular nicht initialisiert');
    return;
  }

  loginForm.value.validate().then(
    async isValid => {
      if (isValid) {
        const { email, password } = loginData.value;

        if (!email || !password) {
          toast('Bitte füllen Sie alle Felder aus', {
            autoClose: 5000,
            type: 'error',
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return;
        }
        await authStore.login(email, password);
        // const { data } = await mutate({
        //   email: email,
        //   password: password,
        // });
        // if (data.loginWithEmail.success) {
        //   toast(data.loginWithEmail.message, {
        //     type: 'success',
        //   });
        //   localStorage.setItem('userData', JSON.stringify(response.data.user));
        //   router.replace(route.query.to ? String(route.query.to) : '/');
        // } else {
        //   toast(data.loginWithEmail.message || 'Anmeldefehler', {
        //     type: 'error',
        //   });
        // }
      }
    },
    error => {
      console.error('Fehler beim Validieren des Formulars:', error);
    },
  );
};

onMounted(async () => {
  // const isAuthenticated = await isUserLoggedIn();
  // if (isAuthenticated)
  //   return router.replace(route.query.to ? String(route.query.to) : "/");
});
</script>

<template>
  <div class="auth-wrapper">
    <VCard max-width="900" :width="$vuetify.display.smAndDown ? '500' : 'auto'">
      <VRow no-gutters>
        <VCol md="6" cols="12" class="pa-sm-8 pa-4" style="block-size: 33rem">
          <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
            <Logo />
            <h4 class="text-h4 text-primary">{{ t('appName') }}</h4>
          </VCardText>

          <VCardItem>
            <VCardTitle>{{ t('Login') }}</VCardTitle>
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
                <div v-show="isContentExpand">
                  <VTextField
                    v-model="loginData.email"
                    label="Email or username"
                    :rules="[v => !!v || t('EmailIsRequired')]"
                    class="mb-6"
                  />

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
                      !loginData.email ? 'border-color:rgb(var(--v-theme-error)) !important' : ''
                    "
                  >
                    <span class="text-caption">{{ loginData.email }}</span>

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
                    v-model="loginData.password"
                    :type="isPasswordVisible ? 'password' : 'text'"
                    :label="t('password')"
                    :rules="[v => !!v || t('passwordIsRequired')]"
                    :append-inner-icon="
                      isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                    "
                    :error-messages="errors.email"
                    class="mb-6"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />

                  <div class="text-center mb-6">
                    <RouterLink :to="{ name: 'forgot-password' }">
                      {{ t('Forgot Password') }}
                    </RouterLink>
                  </div>

                  <VBtn block type="submit" color="primary">
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
          :style="`background-image:url(${authBgThemeVariant});`"
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
@use "@/styles/pages/auth.scss";
</style>
