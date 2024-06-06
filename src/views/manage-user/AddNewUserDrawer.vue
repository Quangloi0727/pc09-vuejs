<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import type { VForm } from 'vuetify/components/VForm';

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void;
  (e: 'userData', value: any): void;
}

interface Props {
  isDrawerOpen: boolean;
}

interface DataForm {
  fullname: string;
  username: string;
  password: string;
  domain: any;
  groups: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const isPasswordVisible = ref(false);
const isFormValid = ref(false);
const refForm = ref<VForm>();
const formData = ref<DataForm>({
  fullname: '',
  username: '',
  password: '',
  domain: null,
  groups: []
});

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false);

  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      formData.value.domain = formData.value.domain._id;
      emit('userData', formData.value);
      emit('update:isDrawerOpen', false);
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
    }
  });
};

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val);
};

const { data: listDomain } = await useApiAuthenticationService<any>(createUrl('/manage-domain/getAll'));
const itemsDomain: any = computed(() => listDomain.value.data);

const itemsGroups = ref([]);

const handleSelect = (item: any) => {
  formData.value.groups = [];
  if (item && item.groups) {
    itemsGroups.value = item.groups;
  } else {
    formData.value.groups = [];
  }
}

</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Thêm mới người dùng" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <AppTextField v-model="formData.fullname" :rules="[requiredValidator]" label="Fullname"
                  placeholder="Nhập fullname..." />
              </VCol>
              <VCol cols="12">
                <AppTextField v-model="formData.username" :rules="[requiredValidator]" label="Username"
                  placeholder="Nhập username..." />
              </VCol>
              <VCol cols="12">
                <AppTextField label="Password" placeholder="Nhập password" v-model="formData.password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" :rules="[requiredValidator]" />
              </VCol>
              <VCol cols="12">
                <AppAutocomplete v-model="formData.domain" label="Domain" placeholder="--- Chọn domain ---"
                  clear-icon="tabler-x" clearable itemTitle="name" itemValue="_id" :rules="[requiredValidator]"
                  :items="itemsDomain" @update:model-value="handleSelect" return-object />
              </VCol>
              <VCol cols="12">
                <AppAutocomplete v-model="formData.groups" label="Nhóm" placeholder="--- Chọn nhóm ---"
                  clear-icon="tabler-x" clearable itemTitle="name" itemValue="_id" :rules="[requiredValidator]"
                  :items="itemsGroups" multiple />
              </VCol>
              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="" class="me-3">
                  Thêm
                </VBtn>
                <VBtn type="reset" variant="tonal" color="error" @click="closeNavigationDrawer">
                  Hủy
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
