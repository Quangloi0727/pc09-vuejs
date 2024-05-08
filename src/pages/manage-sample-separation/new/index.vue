<script setup lang="ts">

const formData = ref({
    fullName: '',
    email: '',
    contactNumber: null,
    altContactNumber: null,
    address: '',
    pincode: null,
    Landmark: '',
    city: '',
    state: null,
    defaultAddress: false,
    addressType: 'home',
    deliveryType: 'overnight',
    promoCode: '',
    paymentMethod: 'card',
    cardNumber: null,
    cardName: '',
    cardExDate: '',
    cardCvv: '',
});

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const totalUsers = ref(10);

// Headers
const headers = [
    { title: 'Tên mẫu', key: 'name', sortable: false },
    { title: 'Người thêm', key: 'createdBy', sortable: false },
    { title: 'Mẫu máu', key: 'templateBlood', sortable: false },
    { title: 'Phân loại', key: 'type', sortable: false },
];

const data = [
    { name: '1123', createdBy: 'Nguyễn Văn A', templateBlood: 'Máu A', type: 'Tốt', sortable: false },
    { name: '4343', createdBy: 'Nguyễn Văn B', templateBlood: 'Máu A', type: 'Tốt', sortable: false },
    { name: '3223', createdBy: 'Nguyễn Văn C', templateBlood: 'Máu 0', type: 'Xấu', sortable: false },
    { name: '3263', createdBy: 'Nguyễn Văn D', templateBlood: 'Máu AB', type: 'Tốt', sortable: false },
];

</script>

<template>
    <VCard class="overflow-visible">
        <div class="w-100 sticky-header overflow-hidden rounded-t">
            <div class=" d-flex align-center gap-4 flex-wrap bg-custom-background pa-2">
                <VCardTitle>Thêm mới hồ sơ</VCardTitle>
                <VSpacer />
                <div>
                    <VBtn variant="tonal" class="me-4">
                        Hủy
                    </VBtn>
                    <VBtn>Lưu</VBtn>
                </div>
            </div>
        </div>

        <VCardText>
            <VRow>
                <VCol md="11" cols="12" class="mx-auto">
                    <VForm>
                        <h5 class="text-h6 mb-6">
                            Thông tin hồ sơ
                        </h5>
                        <VRow>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="formData.fullName" label="Tên hồ sơ" placeholder="Nhập..." />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppSelect v-model="formData.state" label="Người phụ trách" placeholder="--- Chọn ---"
                                    :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']" clear-icon="tabler-x"
                                    clearable />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppDateTimePicker v-model="formData.contactNumber" label="Ngày tạo"
                                    prepend-inner-icon="tabler-calendar" placeholder="Chọn ngày tạo"
                                    :config="{ dateFormat: 'd/m/Y' }" />
                            </VCol>

                            <VCol cols="12">
                                <label class="v-label mb-1 text-body-2">Ghi chú</label>
                                <TiptapEditor v-model="formData.city" label="Ghi chú"
                                    class="border rounded basic-editor" />
                            </VCol>
                        </VRow>
                    </VForm>
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
    <VCard class="overflow-visible mt-10">
        <VCardText>
            <VRow>
                <VCol md="11" cols="12" class="mx-auto">
                    <h5 class="text-h6">
                        Chọn mẫu máu
                    </h5>
                </VCol>
                <VCol md="11" cols="12" class="mx-auto">
                    <VBtn prepend-icon="tabler-plus" :to="{ name: 'manage-sample-separation-select-template' }">
                        Chọn mẫu
                    </VBtn>
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
    <VCard class="overflow-visible mt-10">
        <VCardText>
            <VRow>
                <VCol md="11" cols="12" class="mx-auto">
                    <h5 class="text-h6">
                        Danh sách mẫu
                    </h5>
                </VCol>
                <VCol md="11" cols="12" class="mx-auto">
                    <AppSelect :model-value="itemsPerPage" :items="[
                        { value: 10, title: '10' },
                        { value: 25, title: '25' },
                        { value: 50, title: '50' },
                        { value: 100, title: '100' },
                    ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
                    <!-- SECTION datatable -->
                    <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="data"
                        :items-length="totalUsers" :headers="headers" class="text-no-wrap">

                        <template #item.name="{ item }">
                            <div class="d-flex flex-column">
                                <h6 class="text-base">
                                    <RouterLink :to="{ name: 'manage-sample-separation-new' }"
                                        class="font-weight-medium text-primary ">
                                        #{{ item.name }}
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
                </VCol>
            </VRow>
        </VCardText>
    </VCard>
</template>

<style lang="scss" scoped>
.sticky-header {
    position: sticky;
    z-index: 9;
    transition: all 0.3s ease-in-out;
}

.layout-nav-type-vertical {
    &.layout-navbar-sticky {
        .sticky-header {
            inset-block: 4.3rem 0;
        }
    }

    &.layout-navbar-static {
        .sticky-header {
            inset-block: 0 0;
        }
    }
}

.layout-nav-type-horizontal {
    &.layout-navbar-static {
        .sticky-header {
            inset-block: 0 0;
        }
    }

    &.layout-navbar-sticky {
        .sticky-header {
            inset-block: 6.75rem 0;
        }
    }
}

.basic-editor {
    .ProseMirror {
        block-size: 200px;
        outline: none;
        overflow-y: auto;
        padding-inline: 0.5rem;
    }
}
</style>
