<script setup lang="ts">
import _ from 'underscore';
import { VForm } from 'vuetify/components/VForm';

interface Props {
  data?: any;
  isDialogVisible: boolean;
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void;
  (e: 'update:setGroupPermissionsModules', value: any): void;
}


interface DataForm {
  groupName: string;
  groupId: string;
  permissions: any[];
  modules: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const refPermissionForm = ref<VForm>();
const dataForm = ref<DataForm>({
  groupName: "",
  groupId: "",
  permissions: [],
  modules: []
});

watch(() => props.data, (data: any) => {
  const { name, _id, infoDetail } = data;
  const { permissions, modules } = infoDetail;
  dataForm.value.groupName = name;
  dataForm.value.groupId = _id;
  if (permissions) {
    const perIds = _.pluck(permissions, "_id");
    dataForm.value.permissions = perIds;
  }
  if (modules) {
    const modIds = _.pluck(modules, "_id");
    dataForm.value.modules = modIds;
  }
});


const onSubmit = () => {
  refPermissionForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('update:setGroupPermissionsModules', dataForm.value);
      emit('update:isDialogVisible', false);
      nextTick(() => {
        refPermissionForm.value?.reset();
        refPermissionForm.value?.resetValidation();
      });
    }
  });
};

const onClose = () => {
  emit('update:isDialogVisible', false);
};

const { data: listPermission } = await useApiAuthenticationService<any>(createUrl('/manage-permission/getAll'));
const itemsPermission: any = computed(() => listPermission.value.data);

const { data: listModule } = await useApiAuthenticationService<any>(createUrl('/manage-module/getAll'));
const itemsModule: any = computed(() => listModule.value.data);

</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 600" :model-value="props.isDialogVisible"
    @update:model-value="onClose">
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="onClose" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          Phân quyền
        </h4>
        <p class="text-body-1 text-center mb-6">
          {{ dataForm.groupName }}
        </p>

        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
          <VCol cols="12" md="12">
            <AppAutocomplete v-model="dataForm.modules" label="Chọn module" placeholder="--- Chọn module ---"
              clear-icon="tabler-x" clearable :items="itemsModule" :rules="[requiredValidator]" itemTitle="name"
              itemValue="_id" multiple />
          </VCol>
          <VCol cols="12" md="12">
            <AppAutocomplete v-model="dataForm.permissions" label="Chọn quyền" placeholder="--- Chọn quyền ---"
              clear-icon="tabler-x" clearable :items="itemsPermission" :rules="[requiredValidator]" itemTitle="name"
              itemValue="_id" multiple />
          </VCol>
          <!-- 👉 Actions button -->
          <div class=" d-flex align-center justify-center gap-4">
            <VBtn @click="onSubmit">
              Cập nhật
            </VBtn>

            <VBtn color="secondary" variant="tonal" @click="onClose">
              Hủy
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }
  }
}
</style>
