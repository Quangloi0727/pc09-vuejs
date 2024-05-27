<script setup lang="ts">
import type { Domain } from '@db/apps/domain/types';
import { useRouter } from 'vue-router';

const router = useRouter();

const headers = [
  { title: 'Tên domain', key: 'name' },
  { title: 'Admin Code', key: 'adminCode' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const search = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const title = "Danh sách domain";
const dataPass = ref({});
const dialogSubmit = ref(false);
const dialogTitle = ref('');
const dialogContent = ref('');
const dialogType = ref('');


// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')

const colors: any = {
  'support': { color: 'info', text: 'Support' },
  'users': { color: 'success', text: 'Users' },
  'manager': { color: 'warning', text: 'Manager' },
  'administrator': { color: 'primary', text: 'Administrator' },
  'restricted-user': { color: 'error', text: 'Restricted User' },
}

const { data: dataFetch, execute: fetchData } = await useApi<any>(createUrl('/apps/domain', {
  query: {
    q: search,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const data = computed((): Domain[] => dataFetch.value.data)
const total = computed(() => dataFetch.value.total)
const dialogIcon = computed(() => {
  return dialogType.value === 'success' ? 'tabler-check-circle' : 'tabler-alert-circle';
});

const handleReset = () => {
  console.log('resettttttttttttttttttttttttt');
  fetchData();
  dataPass.value = {};
}
const editPermission = (item: any) => {
  isPermissionDialogVisible.value = true
  dataPass.value = item;
  console.log('dataPass.value', dataPass.value);

}

const deleteDomain = async (_id: any) => {
  console.log('xoa dataaaaaaaaaaaaaaaaaaaaaaaaaa', _id);
  if (_id) {
    const data = await $api(`/apps/domain/${_id}`, {
      method: "DELETE",
      body: {}
    });
    console.log('data detete', data);
    if (!data?.body?.error) {
      dialogSubmit.value = true;
      dialogTitle.value = "Thành công";
      dialogType.value = 'success';
      dialogContent.value = data?.body?.message;
    } else {
      dialogSubmit.value = true;
      dialogTitle.value = "Lỗi";
      dialogType.value = 'fail';
      dialogContent.value = data?.body?.data?.message;
    }
    fetchData();
  }
}

const showDomain = async (_id: any) => {
  console.log('showData', _id);
  if (_id) {
    await router.push(`/apps/domain/${_id}`);
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem class="pb-4">
          <VCardTitle>{{ title || 'Danh sách' }}</VCardTitle>
        </VCardItem>
        <VCardText class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div class="d-flex gap-2 align-center">
            <p class="text-body-1 mb-0">
              Show
            </p>
            <AppSelect :model-value="itemsPerPage" :items="[
              { value: 5, title: '5' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]" style="inline-size: 5.5rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
          </div>

          <div class="d-flex align-center gap-4 flex-wrap">
            <AppTextField v-model="search" placeholder="Tìm kiếm domain" style="inline-size: 15.625rem;" />
            <VBtn density="default" prepend-icon="tabler-plus" @click="isAddPermissionDialogVisible = true">
              Thêm mới
            </VBtn>
          </div>
        </VCardText>

        <VDivider />

        <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items-length="total"
          :items-per-page-options="[
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
          ]" :headers="headers" :items="data" item-value="name" class="text-no-wrap" @update:options="updateOptions">
          <!-- Name -->
          <template #item.name="{ item }">
            <div class="text-high-emphasis text-body-1">
              {{ item.name }}
            </div>
          </template>

          <template #bottom>
            <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="total" />
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <IconBtn title="Xem chi tiết" @click="showDomain(item._id)">
              <VIcon icon="tabler-eye" />
            </IconBtn>
            <VBtn title="Sửa domain" icon size="small" color="medium-emphasis" variant="text"
              @click="editPermission(item)">
              <VIcon size="22" icon="tabler-edit" />
            </VBtn>
            <IconBtn title="Xóa domain" @click="deleteDomain(item._id)">
              <VIcon icon="tabler-trash" />
            </IconBtn>
            <!-- <IconBtn>
              <VIcon icon="tabler-dots-vertical" size="22" />
            </IconBtn> -->
          </template>
        </VDataTableServer>
      </VCard>

      <AddEditDomainDialog v-model:isDialogVisible="isPermissionDialogVisible" @reset-data="handleReset"
        v-model:data-pass="dataPass" />
      <AddEditDomainDialog v-model:isDialogVisible="isAddPermissionDialogVisible" @reset-data="handleReset"
        v-model:data-pass="dataPass" />
    </VCol>
  </VRow>
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
