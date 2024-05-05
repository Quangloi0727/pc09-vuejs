<script setup lang="ts">
import AddNewUserDrawer from "@/views/apps/quanliphongthinghiem/khonguyenmau/AddNewNguyenMau.vue";
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
  { title: "Tên mẫu", key: "name" },
  { title: "Mã số  mẫu", key: "code" },
  { title: "Giới tính", key: "sex" },
  { title: "Tuổi", key: "age" },
  { title: "Thông tin y tế khác	", key: "other" },
  { title: "Nguồn gốc của mẫu", key: "originOfSample" },
  { title: "Phương pháp thu thập", key: "CollectionMethod" },
  { title: "Thời gian thu thập", key: "time" },
  { title: "Địa điểm thu thập", key: "address" },
  { title: "Actions", key: "actions", sortable: false },
];

// 👉 Fetching device
const { data: deviceData, execute: fetchDevice } = await useApi<any>(
  createUrl("/sampleWarehouses/find-all", {
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
let sex = ref('')
let age = ref('')
let other = ref()
let originOfSample = ref('')
let CollectionMethod = ref('')
let time = ref('')
let address = ref('')
// 👉 Add new user
const addNewUser = async (userData: UserProperties) => {
  await $api("/apps/sampleWarehouses", {
    method: "POST",
    body: userData,
  });

  // refetch User
  fetchDevice();
};

// 👉 Delete user
const deleteUser = async (id: number) => {
  await axios.delete(`${baseUrl}/v1/sampleWarehouses/${id}`);
  // refetch User
  // TODO: Make this async
  fetchDevice();
};


const getDeviceDetail = async (id: number) => {
  const response = await axios.get(`${baseUrl}/v1/sampleWarehouses/${id}`);
  deviceDetail = { ...response.data.data };
  name = ref(deviceDetail.name)
  code = ref(deviceDetail.code)
  sex = ref(deviceDetail.sex)
  age = ref(deviceDetail.age)
  other = ref(deviceDetail.other)
  originOfSample = ref(deviceDetail.originOfSample)
  CollectionMethod = ref(deviceDetail.CollectionMethod)
  time = ref(deviceDetail.time)
  address = ref(deviceDetail.address)

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
        sex: sex.value,
        age: age.value,
        other: other.value,
        originOfSample: originOfSample.value,
        CollectionMethod: CollectionMethod.value,
        time: time.value,
        address: address.value,
      }
      await axios.put(`${baseUrl}/v1/sampleWarehouses/${deviceDetail.id}`, data);
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
        <VCardTitle>Danh sách mẫu</VCardTitle>
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
            Thêm mới mẫu
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
        <template #item.sex="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.sex }}
          </div>
        </template>

        <template #item.age="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.age }}
          </div>
        </template>

        <template #item.other="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.other }}
          </div>
        </template>

        <template #item.originOfSample="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.originOfSample }}
          </div>
        </template>

        <template #item.CollectionMethod="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.CollectionMethod }}
          </div>
        </template>

        <template #item.time="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.time }}
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
      <AppDrawerHeaderSection title="Chỉnh sửa kho mẫu" @cancel="closeNavigationDrawer" />

      <VDivider />

      <PerfectScrollbar :options="{ wheelPropagation: false }">
        <VCard flat>
          <VCardText>
            <!-- 👉 Form -->
            <VForm ref="refForm" @submit.prevent="onSubmit">
              <VRow>
                <!-- 👉 Full name -->
                <VCol cols="12">
                  <AppTextField v-model="name" :rules="[requiredValidator]" label="Tên kho mẫu"
                    placeholder="Tên kho mẫu" />
                </VCol>

                <!-- 👉 code -->
                <VCol cols="12">
                  <AppTextField v-model="code" :rules="[requiredValidator]" label="Mã kho mẫu"
                    placeholder="Mã kho mẫu" />
                </VCol>

                <!-- 👉 Email -->
                <VCol cols="12">
                  <AppTextField v-model="sex" :rules="[requiredValidator]" label="Giới tính" placeholder="Giới tính" />
                </VCol>

                <VCol cols="12">
                  <AppTextField v-model="age" label="Tuổi" placeholder="Tuổi" :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12">
                  <AppTextField v-model="other" label="Thông tin khác" placeholder="Thông tin khác"
                    :rules="[requiredValidator]" />
                </VCol>

                <!-- ngay dua vao su dung -->
                <VCol cols="12">
                  <AppTextField v-model="originOfSample" :rules="[requiredValidator]" label="Nguồn gốc của mẫu"
                    placeholder="Nguồn gốc của mẫu" />
                </VCol>

                <VCol cols="12">
                  <AppTextField v-model="CollectionMethod" label="Phương pháp thu thập"
                    placeholder="Phương pháp thu thập" :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12">
                  <AppDateTimePicker v-model="time" label="Thời gian thu thập" placeholder="Thời gian thu thập"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12">
                  <AppTextField v-model="address" label="Địa điểm thu thập" placeholder="Địa điểm thu thập"
                    :rules="[requiredValidator]" />
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
