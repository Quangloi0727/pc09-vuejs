<script setup lang="ts">
// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const formData: any = ref({
    info: '',
    code: '',
    type: '',
    timecreated: ''
});
const searchAdvance = ref();
const typeAdvance = ref();
const timeCreatedAdvance = ref();

// Headers
const headers = [
    { title: '#', key: 'index', sortable: false },
    { title: 'Ảnh', key: 'image', sortable: false },
    { title: 'Thông tin', key: 'info', sortable: false },
    { title: 'Đường dẫn', key: 'img_url', sortable: false },
    { title: 'Loại', key: 'typeText', sortable: false },
    { title: 'GD/SS', key: 'timeCreatedText', sortable: false },
    { title: 'Thông tin người nhập', key: 'code', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
];

const { data: listDataType } = await useApiFetchConfigService<any>(createUrl('/type-image/get-all'));
const listType = computed(() => listDataType.value.data);

const { data: listDataTable, execute: fetchData } = await useApiFetchAiService<any>(createUrl('/sample/get-list',
    {
        query: {
            page,
            limit: itemsPerPage,
            type: typeAdvance,
            search: searchAdvance,
            timeCreated: timeCreatedAdvance,
        },
    },
));

const listData = computed(() => listDataTable.value.data.data);
const totalData = computed(() => listDataTable.value.data.recordsTotal);

const urlImage = import.meta.env.VITE_API_BASE_URL_IMAGE;

const sourceImage = ref("");
const showImage = (file: Event) => {
    const fileReader = new FileReader();
    const { files } = file.target as HTMLInputElement;

    if (files && files.length) {
        fileReader.readAsDataURL(files[0]);
        fileReader.onload = () => {
            if (typeof fileReader.result === 'string') {
                sourceImage.value = fileReader.result;
            }
        };
    }
};
const handleRemoveFile = () => {
    sourceImage.value = "";
};

const typeAppraisalOrCompareSelect = [
    { title: "Ảnh giám định", value: "0" },
    { title: "Ảnh so sánh", value: "1" },
];

const onSubmit = async () => {
    if (sourceImage.value != "") {
        const imageBinary = sourceImage.value.split(',');
        formData.value.image = imageBinary[1];
    }
    await $fetchApiImageService('/import', {
        method: 'POST',
        body: formData.value,
    });
    fetchData();
};
const editDialog = ref(false);
const editedItem: any = ref(formData.value);
// 👉 methods
const editItem = (item: any) => {
    editedItem.value = { ...item };
    editDialog.value = true;
};

const close = () => {
    editDialog.value = false;
};
const save = async (id: any) => {
    await $fetchApiAiService('/sample/edit', {
        method: 'PUT',
        body: {
            id: id,
            code: editedItem.value.code,
            info: editedItem.value.info,
            type: editedItem.value.type,
            timeCreated: editedItem.value.timecreated,
        },
    });
    close();
    fetchData();
};

const deleteDialog = ref(false);
const deleteItem = (item: any) => {
    editedItem.value = { ...item };
    deleteDialog.value = true;
};
const closeDelete = () => {
    deleteDialog.value = false;
};
const deleteItemConfirm = async (id: any) => {
    await $fetchApiAiService(`/sample/delete/${id}`, {
        method: 'PUT',

    });
    closeDelete();
    fetchData();
};
const getUrlImage = (item: any) => {
    return urlImage + '/' + item.type + '/' + item.img_url;
};
</script>

<template>
    <VCard class="overflow-visible">
        <VCardText>
            <VRow>
                <VCol md="7" cols="12" class="mx-auto">
                    <VForm @submit.prevent="onSubmit">
                        <h5 class="text-h6 mb-6">
                            Thêm ảnh tra cứu
                        </h5>
                        <VRow>
                            <VCol cols="12" md="12">
                                <VFileInput label="Chọn ảnh tra cứu" accept="image/png, image/jpeg, image/bmp"
                                    prepend-icon="tabler-camera" @input="showImage" @click:clear="handleRemoveFile()"
                                    :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12" md="12">
                                <AppTextField v-model="formData.info" label="Thông tin" placeholder="Nhập..."
                                    :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12" md="12">
                                <AppTextField v-model="formData.code" label="Thông tin người nhập" placeholder="Nhập..."
                                    :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12" md="12">
                                <AppAutocomplete v-model="formData.type" label="Loại"
                                    placeholder="--- Chọn loại ảnh ---" :items="listType" clear-icon="tabler-x"
                                    clearable itemTitle="name" itemValue="id" :rules="[requiredValidator]" />
                            </VCol>

                            <VCol cols="12" md="12">
                                <AppAutocomplete v-model="formData.timecreated" label="Loại ảnh giám định/so sánh"
                                    placeholder="--- Chọn loại ảnh ---" :items="typeAppraisalOrCompareSelect"
                                    clear-icon="tabler-x" clearable :rules="[requiredValidator]" />
                            </VCol>
                            <VCol cols="12" md="12" class="d-flex gap-4">
                                <VBtn type="submit">
                                    Nhập thông tin
                                </VBtn>
                            </VCol>

                        </VRow>
                    </VForm>
                </VCol>
                <VCol md="5" cols="12" class="mx-auto">
                    <VCardText class="d-flex">
                        <VImg :src="sourceImage" width="300" height="300" class="w-100 mx-auto" />
                    </VCardText>
                </VCol>
            </VRow>
        </VCardText>
    </VCard>

    <!-- 👉 products -->
    <VCard title="Bộ lọc" class="overflow-visible mt-10">
        <VCardText>
            <VRow>
                <VCol cols="12" sm="4">
                    <AppTextField v-model="searchAdvance" label="Thông tin ảnh" placeholder="Tìm kiếm theo thông tin" />
                </VCol>
                <VCol cols="12" sm="4">
                    <AppAutocomplete v-model="typeAdvance" label="Loại" placeholder="--- Chọn loại ảnh ---"
                        :items="listType" clear-icon="tabler-x" clearable itemTitle="name" itemValue="id" />
                </VCol>
                <VCol cols="12" sm="4">
                    <AppAutocomplete v-model="timeCreatedAdvance" label="Loại ảnh giám định/so sánh"
                        placeholder="--- Chọn loại ảnh ---" :items="typeAppraisalOrCompareSelect" clear-icon="tabler-x"
                        clearable />
                </VCol>
            </VRow>
        </VCardText>

        <VDivider />

        <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex gap-4 flex-wrap align-center">
                <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]" />
            </div>
        </div>

        <VDivider class="mt-4" />

        <!-- 👉 Datatable  -->
        <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers" :items="listData"
            :items-length="totalData" class="text-no-wrap">
            <!-- product  -->
            <template #item.image="{ item }">
                <VImg :src="getUrlImage(item)" width="70" height="70" />
            </template>
            <template #item.index="{ item, index }">
                <div class="d-flex align-center gap-x-4">
                    <span class="text-body-1 text-high-emphasis">{{ index + 1 }}</span>
                </div>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
                <IconBtn @click="editItem(item)">
                    <VIcon icon="tabler-edit" />
                </IconBtn>

                <IconBtn @click="deleteItem(item)">
                    <VIcon icon="tabler-trash" />
                </IconBtn>
            </template>

            <!-- pagination -->
            <template #bottom>
                <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalData" />
            </template>
        </VDataTableServer>
    </VCard>
    <!-- 👉 Edit Dialog  -->
    <VDialog v-model="editDialog" max-width="600px">
        <VCard>
            <VCardText>
                <VCardTitle>
                    <span class="headline">Chỉnh sửa thông tin</span>
                </VCardTitle>
                <VContainer>
                    <VRow>
                        <VCol cols="12">
                            <AppTextField v-model="editedItem.info" label="Thông tin" placeholder="Nhập..."
                                :rules="[requiredValidator]" />
                        </VCol>
                        <VCol cols="12">
                            <AppTextField v-model="editedItem.code" label="Thông tin người nhập" placeholder="Nhập..."
                                :rules="[requiredValidator]" />
                        </VCol>
                        <VCol cols="12">
                            <AppAutocomplete v-model="editedItem.type" label="Loại" placeholder="--- Chọn loại ảnh ---"
                                :items="listType" clear-icon="tabler-x" clearable itemTitle="name" itemValue="id"
                                :rules="[requiredValidator]" />
                        </VCol>
                        <VCol cols="12">
                            <AppAutocomplete v-model="editedItem.timecreated" label="Loại ảnh giám định/so sánh"
                                placeholder="--- Chọn loại ảnh ---" :items="typeAppraisalOrCompareSelect"
                                clear-icon="tabler-x" clearable :rules="[requiredValidator]" />
                        </VCol>
                    </VRow>
                </VContainer>
            </VCardText>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="close">
                    Đóng
                </VBtn>

                <VBtn color="success" variant="elevated" @click="save(editedItem._id)">
                    Lưu
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
    <!-- 👉 Delete Dialog  -->
    <VDialog v-model="deleteDialog" max-width="500px">
        <VCard>
            <VCardTitle>
                Bản ghi {{ editedItem.info }} sẽ được xóa ?
            </VCardTitle>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="closeDelete">
                    Hủy
                </VBtn>

                <VBtn color="success" variant="elevated" @click="deleteItemConfirm(editedItem._id)">
                    Xác nhận
                </VBtn>

                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
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
