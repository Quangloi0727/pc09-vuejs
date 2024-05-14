<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import type { VForm } from 'vuetify/components/VForm';

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void;
  //(e: 'userData', value: any): void;
}

interface Props {
  isDrawerOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const isFormValid = ref(false);
const refForm = ref<VForm>();
const name = ref('');

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false);

  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  // refForm.value?.validate().then(({ valid }) => {
  //   if (valid) {
  //     emit('userData', {
  //       name: name.value,
  //       code: code.value,
  //       model: model.value,
  //       seri: seri.value,
  //       manufacturer: manufacturer.value,
  //       datePutIntoUse: datePutIntoUse.value,
  //       maintenanceHistory: maintenanceHistory.value,
  //       warrantyInformation: warrantyInformation.value,
  //     });
  //     emit('update:isDrawerOpen', false);
  //     nextTick(() => {
  //       refForm.value?.reset();
  //       refForm.value?.resetValidation();
  //     });
  //   }
  //});
};

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val);
};

const counter = ref<any[]>([{ name: '' }]);

const addField = () => {
  counter.value.push({ name: '' });
};

const removeField = (index: number) => {
  counter.value.splice(index, 1);
}

</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <AppDrawerHeaderSection title="Tạo danh mục mới" @cancel="closeNavigationDrawer" />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField v-model="name" :rules="[requiredValidator]" label="Tên danh mục"
                  placeholder="Tên danh mục" />
              </VCol>

              <!-- 👉 code -->
              <VCol cols="12">
                <label class="v-label mb-1 text-body-2">Ghi chú</label>
                <TiptapEditor label="Ghi chú" class="border rounded basic-editor" model-value="" />
              </VCol>
              <template v-for="(field, index) in counter" :key="index">
                <VCol cols="12">
                  <VLabel class="d-flex">
                    <div class="d-flex text-sm justify-space-between w-100">
                      <div class="text-high-emphasis">
                        Thêm trường thông tin
                      </div>
                    </div>
                  </VLabel>
                  <div class="d-flex gap-x-4">
                    <AppTextField v-model="field.name" :rules="[requiredValidator]"
                      placeholder="Thêm trường thông tin" />
                    <VBtn v-if="index === counter.length - 1" @click="addField" rounded icon="tabler-plus"
                      variant="tonal" />
                    <VBtn v-else @click="() => removeField(index)" rounded icon="tabler-minus" variant="tonal" />
                  </div>
                </VCol>
              </template>
              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  Thêm mới
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
