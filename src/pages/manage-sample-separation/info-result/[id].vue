<script setup lang="ts">
const numberedSteps = [
    {
        title: 'Extraction',
        subtitle: 'Kết quả',
    },
    {
        title: 'Quantitation',
        subtitle: 'Kết quả',
    },
    {
        title: 'Amplification',
        subtitle: 'Kết quả',
    },
];

const currentStep = ref(0);

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const totalUsers = ref(10);

// Headers
const headers = [
    { title: 'Locus Gen', key: 'locus', sortable: false },
    { title: 'Kiểu Gen', key: 'typeGen', sortable: false },
    { title: '', key: 'flag', sortable: false },
    { title: 'Pi', key: 'pi', sortable: false },
];

const data = [
    { locus: '1123', typeGen: 'Kiểu gen 1', flag: '', pi: '123', sortable: false },
    { locus: 'r5454', typeGen: 'Kiểu gen 2', flag: '', pi: '434', sortable: false },
    { locus: '3483h', typeGen: 'Kiểu gen 3', flag: '', pi: '554', sortable: false },
    { locus: '743n3', typeGen: 'Kiểu gen 4', flag: '', pi: '947', sortable: false },
];

</script>

<template>
    <VRow>
        <VCol md="8">
            <!-- 👉 Product Information -->
            <VCard>
                <VCardText>
                    <!-- 👉 Stepper -->
                    <AppStepper v-model:current-step="currentStep" :items="numberedSteps"
                        class="stepper-icon-step-bg" />
                </VCardText>

                <VDivider />

                <VCardText>
                    <!-- 👉 stepper content -->
                    <VForm>
                        <VWindow v-model="currentStep" class="disable-tab-transition">
                            <VWindowItem>
                                <VRow>
                                    <VCol cols="12">
                                        <h6 class="text-h6 font-weight-medium">
                                            Thông tin kết quả phân tách
                                        </h6>
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppSelect label="Người trả kết quả" placeholder="--- Chọn ---"
                                            :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']"
                                            clear-icon="tabler-x" clearable />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppSelect label="Người phụ trách" placeholder="--- Chọn ---"
                                            :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']"
                                            clear-icon="tabler-x" clearable />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppDateTimePicker label="Ngày trả kết quả mẫu"
                                            prepend-inner-icon="tabler-calendar" placeholder="Chọn ngày tạo"
                                            :config="{ dateFormat: 'd/m/Y' }" modelValue="" />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppTextField label="Mã nhân viên" placeholder="Nhập..." />
                                    </VCol>

                                    <VCol cols="12" md="12">
                                        <AppTextField label="Cơ sở thêm mẫu" placeholder="Nhập..." />
                                    </VCol>

                                    <VCol cols="12" md="12">
                                        <label class="v-label mb-1 text-body-2">Ghi chú</label>
                                        <TiptapEditor label="Ghi chú" class="border rounded basic-editor"
                                            model-value="" />
                                    </VCol>
                                </VRow>
                                <VCard class="mb-6 mt-6">
                                    <VCardItem>
                                        <template #title>
                                            Thông tin kết quả
                                        </template>
                                        <template #append>
                                            <span class="text-primary font-weight-medium text-sm cursor-pointer">Kéo thả
                                                file
                                                kết quả</span>
                                        </template>
                                    </VCardItem>

                                    <VCardText>
                                        <DropZone />
                                    </VCardText>
                                </VCard>

                                <VCard class="mb-6 mt-6">
                                    <!-- SECTION datatable -->
                                    <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page"
                                        :items="data" :items-length="totalUsers" :headers="headers"
                                        class="text-no-wrap">
                                        <!-- pagination -->
                                        <template #bottom>
                                            <TablePagination v-model:page="page" :items-per-page="itemsPerPage"
                                                :total-items="totalUsers" />
                                        </template>
                                    </VDataTableServer>
                                </VCard>
                            </VWindowItem>
                            <VWindowItem>
                                <VRow>
                                    <VCol cols="12">
                                        <h6 class="text-h6 font-weight-medium">
                                            Thông tin kết quả phân tách
                                        </h6>
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppSelect label="Người trả kết quả" placeholder="--- Chọn ---"
                                            :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']"
                                            clear-icon="tabler-x" clearable />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppSelect label="Người phụ trách" placeholder="--- Chọn ---"
                                            :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']"
                                            clear-icon="tabler-x" clearable />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppDateTimePicker label="Ngày trả kết quả mẫu"
                                            prepend-inner-icon="tabler-calendar" placeholder="Chọn ngày tạo"
                                            :config="{ dateFormat: 'd/m/Y' }" modelValue="" />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppTextField label="Mã nhân viên" placeholder="Nhập..." />
                                    </VCol>

                                    <VCol cols="12" md="12">
                                        <AppTextField label="Cơ sở thêm mẫu" placeholder="Nhập..." />
                                    </VCol>

                                    <VCol cols="12" md="12">
                                        <label class="v-label mb-1 text-body-2">Ghi chú</label>
                                        <TiptapEditor label="Ghi chú" class="border rounded basic-editor"
                                            model-value="" />
                                    </VCol>
                                </VRow>
                                <VCard class="mb-6 mt-6">
                                    <!-- SECTION datatable -->
                                    <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page"
                                        :items="data" :items-length="totalUsers" :headers="headers"
                                        class="text-no-wrap">
                                        <!-- pagination -->
                                        <template #bottom>
                                            <TablePagination v-model:page="page" :items-per-page="itemsPerPage"
                                                :total-items="totalUsers" />
                                        </template>
                                    </VDataTableServer>
                                </VCard>
                            </VWindowItem>
                            <VWindowItem>
                                <VRow>
                                    <VCol cols="12">
                                        <h6 class="text-h6 font-weight-medium">
                                            Thông tin kết quả phân tách
                                        </h6>
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppSelect label="Người trả kết quả" placeholder="--- Chọn ---"
                                            :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']"
                                            clear-icon="tabler-x" clearable />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppSelect label="Người phụ trách" placeholder="--- Chọn ---"
                                            :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']"
                                            clear-icon="tabler-x" clearable />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppDateTimePicker label="Ngày trả kết quả mẫu"
                                            prepend-inner-icon="tabler-calendar" placeholder="Chọn ngày tạo"
                                            :config="{ dateFormat: 'd/m/Y' }" modelValue="" />
                                    </VCol>

                                    <VCol cols="12" md="6">
                                        <AppTextField label="Mã nhân viên" placeholder="Nhập..." />
                                    </VCol>

                                    <VCol cols="12" md="12">
                                        <AppTextField label="Cơ sở thêm mẫu" placeholder="Nhập..." />
                                    </VCol>

                                    <VCol cols="12" md="12">
                                        <label class="v-label mb-1 text-body-2">Ghi chú</label>
                                        <TiptapEditor label="Ghi chú" class="border rounded basic-editor"
                                            model-value="" />
                                    </VCol>
                                </VRow>
                                <VCard class="mb-6 mt-6">
                                    <VCardItem>
                                        <template #title>
                                            Thông tin kết quả
                                        </template>
                                        <template #append>
                                            <span class="text-primary font-weight-medium text-sm cursor-pointer">Kéo thả
                                                file
                                                kết quả</span>
                                        </template>
                                    </VCardItem>

                                    <VCardText>
                                        <DropZone />
                                    </VCardText>
                                </VCard>

                                <VCard class="mb-6 mt-6">
                                    <!-- SECTION datatable -->
                                    <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page"
                                        :items="data" :items-length="totalUsers" :headers="headers"
                                        class="text-no-wrap">
                                        <!-- pagination -->
                                        <template #bottom>
                                            <TablePagination v-model:page="page" :items-per-page="itemsPerPage"
                                                :total-items="totalUsers" />
                                        </template>
                                    </VDataTableServer>
                                </VCard>
                            </VWindowItem>
                        </VWindow>
                    </VForm>
                </VCardText>
            </VCard>
        </VCol>

        <VCol md="4" cols="12">
            <!-- 👉 Pricing -->
            <VCard title="Thông tin quá trình phân tách" class="mb-6">
                <VCardText>
                    <AppDateTimePicker label="Giờ lấy mẫu" prepend-inner-icon="tabler-calendar" placeholder="Chọn giờ"
                        :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }" class="mb-6"
                        modelValue="" />
                    <AppDateTimePicker label="Thơi gian thực hiện" prepend-inner-icon="tabler-calendar"
                        placeholder="Chọn thời gian" :config="{ dateFormat: 'd/m/Y' }" class="mb-6" modelValue="" />
                    <AppDateTimePicker label="Thơi gian vào mẫu" prepend-inner-icon="tabler-calendar"
                        placeholder="Chọn thời gian" :config="{ dateFormat: 'd/m/Y' }" class="mb-6" modelValue="" />
                    <AppDateTimePicker label="Thơi gian trả kết quả" prepend-inner-icon="tabler-calendar"
                        placeholder="Chọn thời gian" :config="{ dateFormat: 'd/m/Y' }" class="mb-6" modelValue="" />
                    <AppTextField label="Kết quả cuối" placeholder="Kết quả cuối" class="mb-6" />
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
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
