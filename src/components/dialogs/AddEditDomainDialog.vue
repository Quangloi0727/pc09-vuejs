<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { VForm } from 'vuetify/components/VForm';

interface Props {
  isDialogVisible: boolean
  // permissionName?: string
  dataPass: any
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:permissionName', value: string): void
  (e: 'reset-data'): void
}

const props = withDefaults(defineProps<Props>(), {
  // permissionName: '',
  dataPass: {}
})

const emit = defineEmits<Emit>()

const formData = ref({
  _id: '',
  name: '',
  adminCode: ''
});
// console.log('dataPass', props.dataPass);

const currentPermissionName = ref('')
const currentDomainAdminCode = ref('');
const dialogSubmit = ref(false);
const dialogTitle = ref('');
const dialogContent = ref('');
const dialogType = ref('');

const onReset = () => {
  emit('update:isDialogVisible', false)
  emit('reset-data');
  currentPermissionName.value = '';
  formData.value = {
    _id: '',
    name: '',
    adminCode: ''
  }
}

const onSubmit = async () => {
  console.log('vao day ????', formData.value);
  let data: any;
  if (formData?.value?._id) {
    data = await $api(`/apps/domain/${formData.value._id}`, {
      method: "PUT",
      body: formData.value,
    });
    console.log('data', data);
  } else {
    data = await $api("/apps/domain", {
      method: "POST",
      body: formData.value,
    });
    console.log('data', data);
  }

  if (data?.body?.error == false) {
    dialogSubmit.value = true;
    dialogTitle.value = "Thành công";
    dialogType.value = 'success';
    dialogContent.value = data?.body?.message;
    emit('update:isDialogVisible', false);
    emit('reset-data');
  } else {
    dialogSubmit.value = true;
    dialogTitle.value = "Lỗi";
    dialogType.value = 'fail';
    dialogContent.value = data?.body?.data?.message;
    // emit('update:isDialogVisible', false)
    // emit('reset-data');
  }

  // emit('update:isDialogVisible', false)
  // emit('update:permissionName', currentPermissionName.value)
}

const adminCodeList = [
  { desc: 'Standard - $99/month', title: 'Đội 1', value: 'DOI1' },
  { desc: 'Basic - $0/month', title: 'Đội 2', value: 'DOI2' },
  { desc: 'Enterprise - $499/month', title: 'Đội 3', value: 'DOI3' },
  { desc: 'Company - $999/month', title: 'Đội 4', value: 'DOI 4' },
]

const dialogIcon = computed(() => {
  return dialogType.value === 'success' ? 'tabler-check-circle' : 'tabler-alert-circle';
});

watch(props, () => {
  // currentPermissionName.value = props.permissionName;
  formData.value = props.dataPass;
})

</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 600" :model-value="props.isDialogVisible"
    @update:model-value="onReset">
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-2 pa-sm-10">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          {{ props.dataPass?._id ? 'Sửa' : 'Thêm mới' }} domain
        </h4>

        <!-- 👉 Form -->
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12" md="12">
              <AppTextField v-model="formData.name" label="Tên domain" placeholder="Nhập..." />
            </VCol>

            <VCol cols="12" md="12">
              <AppTextField v-model="formData.adminCode" label="Admin code" placeholder="Nhập..." />
            </VCol>
            <VCol md="12" cols="12" class="mx-auto">
              <VBtn type="submit" class="me-3">
                {{ props.dataPass?._id ? 'Sửa' : 'Thêm mới' }} domain
              </VBtn>
              <VBtn type="reset" variant="tonal" color="error" @click="onReset">
                Hủy
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="dialogSubmit" class="v-dialog-sm">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogSubmit = false" />

    <VCard :title="dialogTitle">
      <VCardText>
        <Icon :icon="dialogIcon" :style="{ color: dialogType === 'success' ? 'green' : 'red', fontSize: '24px' }" />
        {{ dialogContent }}
      </VCardText>
      <VCardText class="d-flex flex-wrap gap-3">
        <VSpacer />
        <VBtn @click="dialogSubmit = false">
          Close
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;
    padding-inline: 0;
  }
}
</style>
