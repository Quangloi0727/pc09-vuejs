<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import type { VForm } from 'vuetify/components/VForm';

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void;
  (e: 'domainData', value: any): void;
}

interface Props {
  isDrawerOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const isFormValid = ref(false);
const refForm = ref<VForm>();
const name = ref('');
const groups = ref([]);

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
      emit('domainData', {
        name: name.value,
        groups: groups.value,
      });
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

const { data: listGroup } = await useApiAuthenticationService<any>(createUrl('/manage-group/getAll'));
const itemsGroup: any = computed(() => listGroup.value.data);

</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Thêm mới domain" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <AppTextField v-model="name" :rules="[requiredValidator]" label="Tên domain"
                  placeholder="Nhập tên domain..." />
              </VCol>
              <VCol cols="12">
                <AppAutocomplete v-model="groups" label=" Nhóm" placeholder="--- Chọn nhóm ---" clear-icon="tabler-x"
                  clearable itemTitle="name" itemValue="_id" :rules="[requiredValidator]" :items="itemsGroup"
                  multiple />
              </VCol>
              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
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
