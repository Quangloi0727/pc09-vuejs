<script setup lang="ts">
import AddNewUserDrawer from "@/views/apps/quanliphongthinghiem/thietbi/AddNewDevice.vue";
import type { UserProperties } from "@db/apps/users/types";
import axios from 'axios';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import type { VForm } from 'vuetify/components/VForm';

const baseUrl = import.meta.env.VITE_API_BASE_URL1;

// 👉 Store
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

const headersDevices = [
  { title: "Tên thiết bị", key: "name" },
  { title: "Mã số thiết bị", key: "code" },
  { title: "Hãng sản xuất", key: "manufacturer" },
  { title: "Model", key: "model" },
  { title: "Số seri", key: "seri" },
  { title: "Ngày đưa vào sử dụng", key: "datePutIntoUse" },
  { title: "Tình trạng", key: "status" },
  { title: "Lịch sử bảo dưỡng", key: "maintenanceHistory" },
  { title: "Thông tin bảo hành", key: "warrantyInformation" },
  { title: "Actions", key: "actions", sortable: false },
];

// 👉 Fetching device
const { data: deviceData, execute: fetchDevice } = await useApi<any>(
  createUrl("/devices/find-all", {
    query: {
      q: searchQuery,
      status: selectedStatus,
      plan: selectedPlan,
      role: selectedRole,
      itemsPerPage,
      page,
      sortBy,
      orderBy,
    },
  })
);

const devices = computed((): any[] => deviceData.value.users);
const totalDevices = computed(() => deviceData.value.totalUsers);

const isAddNewUserDrawerVisible = ref(false);
const isEditNewUserDrawerVisible = ref(false);
const isDrawerOpen = ref(false);
let deviceDetail: any = {};

const refForm = ref<VForm>()
let name = ref('')
let code = ref('')
let manufacturer = ref('')
let model = ref('')
let seri = ref()
let datePutIntoUse = ref('')
let maintenanceHistory = ref('')
let warrantyInformation = ref('')

// 👉 Add new user
const addNewUser = async (userData: UserProperties) => {
  await $api("/apps/devices", {
    method: "POST",
    body: userData,
  });

  // refetch User
  fetchDevice();
};

// 👉 Delete user
const deleteUser = async (id: number) => {
  await axios.delete(`${baseUrl}/v1/devices/${id}`);
  // refetch User
  // TODO: Make this async
  fetchDevice();
};


const getDeviceDetail = async (id: number) => {
  const response = await axios.get(`${baseUrl}/v1/devices/${id}`);
  deviceDetail = { ...response.data.data };
  name = ref(deviceDetail.name)
  code = ref(deviceDetail.code)
  manufacturer = ref(deviceDetail.manufacturer)
  model = ref(deviceDetail.model)
  seri = ref(deviceDetail.seri)
  datePutIntoUse = ref(deviceDetail.datePutIntoUse)
  maintenanceHistory = ref(deviceDetail.maintenanceHistory)
  warrantyInformation = ref(deviceDetail.warrantyInformation)
};

const editDevice = (id: number) => {
  isDrawerOpen.value = true;
  getDeviceDetail(id);
}

const closeNavigationDrawer = () => {
  isDrawerOpen.value = false;
}

const onSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      const data = {
        name: name.value,
        model: model.value,
        seri: seri.value,
        manufacturer: manufacturer.value,
        datePutIntoUse: datePutIntoUse.value,
        maintenanceHistory: maintenanceHistory.value,
        warrantyInformation: warrantyInformation.value,
      }
      await axios.put(`${baseUrl}/v1/devices/${deviceDetail.id}`, data);
      await fetchDevice();
      closeNavigationDrawer();
    }
  })
}

</script>

<template>
  <section>

    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Danh sách thiết bị</VCardTitle>
      </VCardItem>

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect :model-value="itemsPerPage" :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem;">
            <AppTextField v-model="searchQuery" placeholder="Tìm kiếm thiết bị" />
          </div>

          <!-- 👉 Export button -->
          <VBtn variant="tonal" color="secondary" prepend-icon="tabler-upload">
            Export
          </VBtn>

          <!-- 👉 Add user button -->
          <VBtn prepend-icon="tabler-plus" @click="isAddNewUserDrawerVisible = true">
            Thêm mới thiết bị
          </VBtn>
        </div>
      </VCardText>

      <VDivider />
      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="devices"
        :items-length="totalDevices" :headers="headersDevices" class="text-no-wrap" show-select
        @update:options="updateOptions">
        <!-- User -->
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <div class="text-capitalize text-high-emphasis text-body-1">
              {{ item.name }}
            </div>
          </div>
        </template>

        <!-- 👉 Role -->
        <template #item.code="{ item }">
          <div class="d-flex align-center gap-x-4">
            <div class="text-capitalize text-high-emphasis text-body-1">
              {{ item.code }}
            </div>
          </div>
        </template>

        <!-- Status -->
        <template #item.manufacturer="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.manufacturer }}
          </div>
        </template>

        <template #item.model="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.model }}
          </div>
        </template>

        <template #item.seri="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.seri }}
          </div>
        </template>

        <template #item.datePutIntoUse="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.datePutIntoUse }}
          </div>
        </template>

        <template #item.status="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            Bảo dưỡng
          </div>
        </template>

        <template #item.maintenanceHistory="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.maintenanceHistory }}
          </div>
        </template>

        <template #item.warrantyInformation="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.warrantyInformation }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <IconBtn>
            <VIcon @click="editDevice(item.id)" icon="tabler-eye" />
          </IconBtn>

          <VBtn icon variant="text" color="medium-emphasis">
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem @click="editDevice(item.id)">
                  <template #prepend>
                    <VIcon icon="tabler-pencil" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteUser(item.id)">
                  <template #prepend>
                    <VIcon icon="tabler-trash" />
                  </template>
                  <VListItemTitle>Delete</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalDevices" />
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>
    <!-- 👉 Add New User -->
    <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" @user-data="addNewUser" />

    <!-- Edit device -->
    <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="isDrawerOpen">
      <!-- 👉 Title -->
      <AppDrawerHeaderSection title="Chỉnh sửa thiết bị" @cancel="closeNavigationDrawer" />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <!-- 👉 Form -->
            <VForm ref="refForm" @submit.prevent="onSubmit">
              <VRow>
                <!-- 👉 Full name -->
                <VCol cols="12">
                  <AppTextField v-model="name" :rules="[requiredValidator]" label="Tên thiết bị"
                    placeholder="Tên thiết bị" />
                </VCol>

                <!-- 👉 code -->
                <VCol cols="12">
                  <AppTextField v-model="code" :rules="[requiredValidator]" label="Mã thiết bị"
                    placeholder="Mã thiết bị" />
                </VCol>

                <!-- 👉 Email -->
                <VCol cols="12">
                  <AppTextField v-model="manufacturer" :rules="[requiredValidator]" label="Hãng sản xuất"
                    placeholder="Hãng sản xuất" />
                </VCol>

                <!-- 👉 model -->
                <VCol cols="12">
                  <AppTextField v-model="model" :rules="[requiredValidator]" label="Model" placeholder="Model" />
                </VCol>

                <!-- seri -->
                <VCol cols="12">
                  <AppTextField v-model="seri" label="Số seri" placeholder="Số seri" :rules="[requiredValidator]" />
                </VCol>

                <!-- ngay dua vao su dung -->
                <VCol cols="12">
                  <AppDateTimePicker v-model="datePutIntoUse" label="Ngày đưa vào sử dụng"
                    placeholder="Ngày đưa vào sử dụng" :rules="[requiredValidator]" />
                </VCol>

                <!-- lich su bao duong -->
                <VCol cols="12">
                  <AppDateTimePicker v-model="maintenanceHistory" label="Lịch sử bảo dưỡng"
                    placeholder="Lịch sử bảo dưỡng" :rules="[requiredValidator]" />
                </VCol>

                <!-- thong tin bao hanh -->
                <VCol cols="12">
                  <AppTextField v-model="warrantyInformation" label="Thông tin bảo hành"
                    placeholder="Thông tin bảo hành" :rules="[requiredValidator]" />
                </VCol>

                <!-- 👉 Submit and Cancel -->
                <VCol cols="12">
                  <VBtn type="submit" class="me-3">
                    Submit
                  </VBtn>
                  <VBtn type="reset" variant="tonal" color="error" @click="closeNavigationDrawer">
                    Cancel
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>
  </section>
</template>
