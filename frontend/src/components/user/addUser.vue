<template>
  <VDialog width="1000">
    <VCard :title="t('AddNewUser')">
      <VCardText>
        <VForm ref="refUserForm" @submit.prevent="addUser">
          <VRow>
            <VCol md="6" cols="12">
              <VTextField
                v-model="userData.name"
                :label="t('name')"
                :rules="[v => !!v || t('nameIsRequired')]"
              />
            </VCol>
            <VCol md="6" cols="12">
              <VTextField
                v-model="userData.lastname"
                :label="t('lastname')"
                :rules="[v => !!v || t('lastnameIsRequired')]"
              />
            </VCol>
            <VCol md="6" cols="12">
              <VTextField
                v-model="userData.username"
                :label="t('username')"
                :rules="[v => !!v || t('usernameIsRequired')]"
              />
            </VCol>
            <VCol md="6" cols="12">
              <VTextField
                v-model="userData.email"
                :label="t('email')"
                :rules="[v => !!v || t('emailIsRequired')]"
              />
            </VCol>

            <VCol md="6" cols="12">
              <VTextField
                v-model="userData.phoneNumber"
                :label="t('phoneNumber')"
                :rules="[v => !!v || t('phoneNumberIsRequired')]"
              />
            </VCol>

            <VCol md="6" cols="12">
              <VSelect
                v-model="userData.role"
                :items="roleItems"
                item-title="title"
                item-value="value"
                :label="t('role')"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="userData.password"
                :label="t('password')"
                :rules="[v => !!v || t('passwordIsRequired')]"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="userData.descriptions"
                placeholder="Descriptions..."
                label="Descriptions"
                :rules="[v => !!v || 'Descriptions filed is required']"
                rows="3"
              />
            </VCol>

            <VCol cols="12">
              <VBtn color="success" variant="tonal" type="submit" class="me-4">
                {{ t('Submit') }}
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                type="reset"
                @click="isAddUserDialogVisible = false"
              >
                {{ t('Cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t, d } = useI18n();

const refUserForm = ref();

const userData = ref({
  name: '',
  email: '',
  company: '',
  role: '',
  status: 'inactive',
});

const isAddUserDialogVisible = ref(false);

const addUser = async () => {
  const validation = await refUserForm.value?.validate();

  if (validation?.valid) {
    try {
      isAddUserDialogVisible.value = false;
      if (response.status === 201) fetchUsers();
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
