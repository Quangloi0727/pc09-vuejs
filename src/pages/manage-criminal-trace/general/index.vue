<script setup lang="ts">
// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const formData: any = ref({
    info: '',
    code: 'Default',
    type: null,
    fields: [],
    timecreated: null
});
const currentTab = ref('item-1');
const sourceImage = ref("");
const editDialog = ref(false);
const editedItem: any = ref(formData.value);
let selectedItems: any = reactive([]);
const deleteDialog = ref(false);

const formTable = ref({
    data: [],
    totalData: 0,
});

const formSearchNormal = ref({
    typeSearch: "normal",
    search: '',
    timeCreated: undefined,
});
interface FormImage {
    image: string;
    main_threshold: number;
    typeSearch: string;
}

const formSearchImage = ref<FormImage>({
    typeSearch: "image",
    image: '',
    main_threshold: 70,
});

const urlImage = import.meta.env.VITE_API_BASE_URL_IMAGE;

// Headers
const headers = [
    { title: '#', key: 'index', sortable: false },
    { title: 'Ảnh', key: 'image', sortable: false },
    { title: 'Thông tin', key: 'info', sortable: false },
    { title: 'Loại', key: 'typeText', sortable: false },
    { title: 'GD/SS', key: 'timeCreatedText', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
];

const { data: listDataType } = await useApiFetchConfigService<any>(createUrl('/type-image/get-all'));
const listType = computed(() => listDataType.value.data);

const fetchData = async (searchNormal?: any, searchImage?: any) => {
    let body: any = {
        page: page.value,
        limit: itemsPerPage.value,
    };

    if (searchNormal) {
        const { typeSearch, timeCreated, search } = searchNormal.value;

        if (typeSearch == "normal") {
            body = { ...body, search, timeCreated, typeSearch };
        }
    }

    if (searchImage) {
        const { typeSearch, image, main_threshold } = searchImage.value;
        if (typeSearch == "image") {
            body = { ...body, image, main_threshold, typeSearch };
        }
    }

    const { data } = await $fetchApiAiService('/sample/search', {
        method: 'POST',
        body: body,
    });
    formTable.value.data = data.data;
    formTable.value.totalData = data.recordsTotal;
};
fetchData();

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
const getValueImageSearch = (file: Event) => {
    const fileReader = new FileReader();
    const { files } = file.target as HTMLInputElement;

    if (files && files.length) {
        fileReader.readAsDataURL(files[0]);
        fileReader.onload = () => {
            if (typeof fileReader.result === 'string') {
                const imageBinary = fileReader.result.split(',');
                formSearchImage.value.image = imageBinary[1];
            }
        };
    }
};
const handleRemoveFile = () => {
    sourceImage.value = "";
};
const handleRemoveFileSearch = () => {
    formSearchImage.value.image = "";
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
    await $fetchApiAiService('/sample/import', {
        method: 'POST',
        body: formData.value,
    });
};

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
};

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
};
const getUrlImage = (item: any) => {
    return urlImage + '/' + item.type + '/' + item.img_url;
};
const { data: listCategory } = await useApiFetchAiService<any>(createUrl('/manage-category/getList'));
const items: any = computed(() => listCategory.value.data);

const handleSelect = (item: any, level = 0) => {
    formData.value.type = item._id;
    selectedItems.splice(level);
    if (item && item.childrenIds && item.childrenIds.length > 0) {
        selectedItems.push(item);
    }
    if (item && item.fields && item.fields.length > 0) {
        const filteredItems = item.fields.filter((el: any) => el.name.trim() !== '');
        formData.value.fields = filteredItems;
    } else {
        formData.value.fields = [];
    }
};
const printTypeText = (item: any) => {
    if (item && item.fields && item.fields.length) {
        const valuesArray = item.fields.map((el: any) => el.value);
        const result = valuesArray.join(',');
        return result;
    } else {
        return '';
    }
};
const searchNormal = () => {
    fetchData(formSearchNormal);
};
const searchImage = () => {
    fetchData(undefined, formSearchImage);
};
const handleSelectPageSize = () => {
    if (currentTab.value == '0') {
        fetchData(formSearchNormal);
    }
    if (currentTab.value == '1') {
        fetchData(undefined, formSearchImage);
    };
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
                                <AppAutocomplete label="Loại" placeholder="--- Chọn loại ảnh ---" :items="items"
                                    clear-icon="tabler-x" clearable itemTitle="name" :rules="[requiredValidator]"
                                    @update:model-value="item => handleSelect(item, 0)" return-object />
                            </VCol>
                            <VCol cols="12" md="12" v-for="(childItems, index) in selectedItems" :key="index">
                                <AppAutocomplete :items="childItems.childrenIds" label="Loại"
                                    placeholder="--- Chọn loại ảnh ---" clear-icon="tabler-x" clearable
                                    :rules="[requiredValidator]" itemTitle="name"
                                    @update:model-value="item => handleSelect(item, index + 1)" return-object />
                            </VCol>
                            <VCol cols="12" md="6" v-for="(field, index) in formData.fields" :key="index"
                                v-if="formData.fields.length > 0">
                                <AppTextField v-model="field.value" :label="field.name" placeholder="Nhập..."
                                    :rules="[requiredValidator]" />
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
                    <VCard class="overflow-visible mt-15">
                        <VCardText class="d-flex">
                            <VImg v-if="sourceImage !== ''" :src="sourceImage" width="300" height="300"
                                class="w-100 mx-auto" />
                            <div v-else
                                class="d-flex flex-column justify-center align-center gap-y-6 pa-6 drop-zone rounded">
                                <IconBtn variant="tonal" class="rounded-sm">
                                    <VIcon icon="tabler-photo-filled" />
                                </IconBtn>
                                <VBtn variant="tonal" size="small">
                                    Vui lòng chọn ảnh để hiện thị preview
                                </VBtn>
                            </div>
                        </VCardText>
                    </VCard>
                </VCol>
            </VRow>
        </VCardText>
    </VCard>

    <!-- 👉 products -->
    <VCard title="Bộ lọc" class="overflow-visible mt-10">
        <VCard>
            <VTabs v-model="currentTab">
                <VTab>Tra cứu thông tin</VTab>
                <VTab>Tra cứu hình ảnh</VTab>
            </VTabs>

            <VCardText>
                <VWindow v-model="currentTab">
                    <VWindowItem v-for="item in 2" :key="item" :value="`item-${item}`">
                        <VRow v-if="item === 1">
                            <VCol cols="12" sm="4">
                                <AppTextField v-model="formSearchNormal.search" label="Thông tin ảnh"
                                    placeholder="Tìm kiếm theo thông tin" />
                            </VCol>
                            <VCol cols="12" sm="4">
                                <AppAutocomplete v-model="formSearchNormal.timeCreated"
                                    label="Loại ảnh giám định/so sánh" placeholder="--- Chọn loại ảnh ---"
                                    :items="typeAppraisalOrCompareSelect" clear-icon="tabler-x" clearable />
                            </VCol>
                            <VCol cols="12" offset-sm="1" sm="2">
                                <VBtn class="mt-6" @click="searchNormal">
                                    <VIcon start icon="tabler-search" />Tìm kiếm
                                </VBtn>
                            </VCol>
                        </VRow>
                        <VRow v-if="item === 2">
                            <VCol cols="12" sm="4">
                                <label class="v-label mb-1 text-body-2">Tìm kiếm hình ảnh</label>
                                <VFileInput label="Chọn ảnh tra cứu" accept="image/png, image/jpeg, image/bmp"
                                    prepend-icon="tabler-camera" @input="getValueImageSearch"
                                    @click:clear="handleRemoveFileSearch()" />
                            </VCol>
                            <VCol cols="12" sm="4">
                                <AppTextField v-model="formSearchImage.main_threshold" label="Tỉ lệ so khớp"
                                    type="number" placeholder="Tỉ lệ so khớp" />
                            </VCol>
                            <VCol cols="12" offset-sm="1" sm="2">
                                <VBtn class="mt-6" @click="searchImage">
                                    <VIcon start icon=" tabler-search" />Tìm kiếm
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VWindowItem>
                </VWindow>
            </VCardText>
        </VCard>

        <VDivider />

        <div class="d-flex flex-wrap gap-4 ma-6">
            <div class="d-flex gap-4 flex-wrap align-center">
                <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]"
                    @update:modelValue="handleSelectPageSize" />
            </div>
        </div>

        <VDivider class="mt-4" />

        <!-- 👉 Datatable  -->
        <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers"
            :items="formTable.data" :items-length="formTable.totalData" class="text-no-wrap">
            <!-- product  -->
            <template #item.image="{ item }">
                <VImg :src="getUrlImage(item)" width="70" height="70" />
            </template>
            <template #item.index="{ item, index }">
                <div class="d-flex align-center gap-x-4">
                    <span class="text-body-1 text-high-emphasis">{{ index + 1 }}</span>
                </div>
            </template>
            <template #item.typeText="{ item }">
                <div class="d-flex align-center gap-x-4">
                    {{ printTypeText(item) }}
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
                <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="formTable.totalData"
                    @update:page="handleSelectPageSize" />
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
