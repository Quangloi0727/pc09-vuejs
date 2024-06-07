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
  permissions: any;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const refPermissionForm = ref<VForm>();
const dataForm = ref<DataForm>({
  groupName: "",
  groupId: "",
  permissions: {},
});

watch(() => props.data, (data: any) => {
  const { name, _id, infoDetail } = data;
  dataForm.value.groupName = name;
  dataForm.value.groupId = _id;

  if (infoDetail && !_.isEmpty(infoDetail)) {
    infoDetail.forEach((el: any) => {
      const { permissions, moduleId } = el;
      const perIds = _.pluck(permissions, "_id");
      dataForm.value.permissions[moduleId._id] = perIds;
    });
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

const isChecked = (moduleId: any, permissionId: any) => {
  return dataForm.value.permissions[moduleId] && dataForm.value.permissions[moduleId].includes(permissionId);
};

const updatePermissions = (moduleId: any, permissionId: any, event: any) => {
  if (!dataForm.value.permissions[moduleId]) {
    dataForm.value.permissions[moduleId] = [];
  }
  if (event.target.checked) {
    if (!dataForm.value.permissions[moduleId].includes(permissionId)) {
      dataForm.value.permissions[moduleId].push(permissionId);
    }
  } else {
    const index = dataForm.value.permissions[moduleId].indexOf(permissionId);
    if (index > -1) {
      dataForm.value.permissions[moduleId].splice(index, 1);
    }
  }
}


</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 800" :model-value="props.isDialogVisible"
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
            <VTable class="permission-table text-no-wrap mb-6">
              <!-- 👉 Other permission loop -->
              <tr v-for="mod in itemsModule" :key="mod._id">
                <td>
                  <h6 class="text-h6">
                    {{ mod.name }}
                  </h6>
                </td>
                <td v-for="permission in itemsPermission" :key="permission._id">
                  <div class="d-flex justify-end">
                    <VCheckbox :label="permission.name" :checked="isChecked(mod._id, permission._id)"
                      @change="updatePermissions(mod._id, permission._id, $event)" :value="permission._id"
                      v-model="dataForm.permissions[mod._id]" />
                  </div>
                </td>
              </tr>
            </VTable>
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

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
