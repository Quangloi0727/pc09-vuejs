<script setup lang="ts">
const status = [
    { title: 'Thành công', value: 'success' },
    { title: 'Thất bại', value: 'fail' },
];
const selectedStatus = ref();

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const totalUsers = ref(10);

// Headers
const headers = [
    { title: 'Mã đục lỗ', key: 'code', sortable: false },
    { title: 'Phương pháp chiết tách ADN', key: 'method', sortable: false },
];

const data = [
    { code: '1123', method: 'Phương pháp 1', sortable: false },
    { code: '4343', method: 'Phương pháp 2', sortable: false },
    { code: '3223', method: 'Phương pháp 3', sortable: false },
    { code: '3263', method: 'Phương pháp 4', sortable: false },
];

</script>

<template>
    <VCard class="overflow-visible">
        <div class="w-100 sticky-header overflow-hidden rounded-t">
            <div class=" d-flex align-center gap-4 flex-wrap bg-custom-background pa-2">
                <VCardTitle>Chọn mẫu phân tách</VCardTitle>
                <VSpacer />
                <div>
                    <VBtn class="me-4" color="warning" @click="$router.go(-1)">
                        Hủy chọn mẫu
                    </VBtn>
                </div>
            </div>
        </div>

        <VCardText>
            <VRow>
                <VCol cols="12" sm="6" lg="6">
                    <VCard>
                        <VCardItem>
                            <VCardTitle>Danh sách thông tin xử lý mẫu</VCardTitle>
                        </VCardItem>

                        <VCardText class="d-flex flex-wrap gap-4">
                            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                                <!-- 👉 Search  -->
                                <div style="inline-size: 15.625rem;">
                                    <AppTextField placeholder="Search" />
                                </div>
                                <div style="inline-size: 10.625rem;">
                                    <!-- 👉 Select Plan -->
                                    <AppSelect v-model="selectedStatus" placeholder="Trạng thái" :items="status"
                                        clearable clear-icon="tabler-x" />
                                </div>
                            </div>
                        </VCardText>


                        <VDivider />

                        <!-- SECTION datatable -->
                        <VDataTableServer :items="data" :items-length="totalUsers" :headers="headers"
                            class="text-no-wrap" show-select>
                            <!-- User -->
                            <template #item.code="{ item }">
                                <div class="d-flex flex-column">
                                    <h6 class="text-base">
                                        <RouterLink :to="{ name: 'apps-user-view-id', params: { id: item.code } }"
                                            class="font-weight-medium text-primary ">
                                            #{{ item.code }}
                                        </RouterLink>
                                    </h6>
                                </div>
                            </template>
                            <!-- pagination -->
                            <template #bottom>
                                <TablePagination v-model:page="page" :items-per-page="itemsPerPage"
                                    :total-items="totalUsers" />
                            </template>
                        </VDataTableServer>
                        <!-- SECTION -->
                        <VCol offset-md="8" cols="12">
                            <VBtn>
                                Kích hoạt
                                <VIcon end icon=" tabler-arrow-narrow-right" />
                            </VBtn>
                        </VCol>
                    </VCard>
                </VCol>
                <VCol cols="12" sm="6" lg="6">
                    <VCard>
                        <VCardItem>
                            <VCardTitle>Danh sách mẫu được chọn</VCardTitle>
                        </VCardItem>

                        <VCardText class="d-flex flex-wrap gap-4">
                            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                                <!-- 👉 Search  -->
                                <div style="inline-size: 15.625rem;">
                                    <AppTextField placeholder="Search" />
                                </div>
                                <div style="inline-size: 10.625rem;">
                                    <!-- 👉 Select Plan -->
                                    <AppSelect v-model="selectedStatus" placeholder="Trạng thái" :items="status"
                                        clearable clear-icon="tabler-x" />
                                </div>
                            </div>
                        </VCardText>
                        <VDivider />

                        <!-- SECTION datatable -->
                        <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="data"
                            :items-length="totalUsers" :headers="headers" class="text-no-wrap" show-select>
                            <!-- User -->
                            <template #item.code="{ item }">
                                <div class="d-flex flex-column">
                                    <h6 class="text-base">
                                        <RouterLink :to="{ name: 'apps-user-view-id', params: { id: item.code } }"
                                            class="font-weight-medium text-primary ">
                                            #{{ item.code }}
                                        </RouterLink>
                                    </h6>
                                </div>
                            </template>
                            <!-- pagination -->
                            <template #bottom>
                                <TablePagination v-model:page="page" :items-per-page="itemsPerPage"
                                    :total-items="totalUsers" />
                            </template>
                        </VDataTableServer>
                        <VCol offset-md="9" cols="12">
                            <VBtn>
                                Next
                                <VIcon end icon="tabler-arrow-narrow-right" />
                            </VBtn>
                        </VCol>
                        <!-- SECTION -->
                    </VCard>
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
</template>
