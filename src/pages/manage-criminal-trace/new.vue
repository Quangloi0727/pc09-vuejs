<script setup lang="ts">
import { VForm } from 'vuetify/lib/components/index.mjs';

// Data table options
const formData: any = ref({
    info: '',
    code: 'Default',
    type: null,
    fields: [],
    timecreated: null,
    keyInput: 0
});
const sourceImage = ref("");
let selectedItems: any = reactive([]);

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
    try {
        const response = await $fetchApiAiService('/sample/import', {
            method: 'POST',
            body: formData.value,
        });
        if (response.error == false) {
            toast.success('Thêm mới thành công !');
            resetForm();
        } else {
            toast.error('Thêm mới thất bại !');
        }
    } catch (error) {
        toast.error('Thêm mới thất bại !');
    }
};

const resetForm = () => {
    formData.value.image = "";
    formData.value.info = "";
    formData.value.timecreated = null;
    formData.value.keyInput += 1;
    sourceImage.value = "";
    formData.value.fields.forEach((field: any) => {
        field.value = '';
    });
};

const { data: listCategory } = await useApiFetchAiService<any>(createUrl('/manage-category/getList'));
const items: any = computed(() => listCategory.value.data);
const handleSelect = (item: any, level = 0) => {
    if (item) {
        formData.value.type = item._id;
        selectedItems.splice(level);

        // Collect fields from selected parent items
        let allParentFields: any[] = [];
        for (let i = 0; i < selectedItems.length; i++) {
            const parentItem = selectedItems[i];
            if (parentItem.fields && parentItem.fields.length > 0) {
                const filtered = parentItem.fields.filter((el: any) => el.name !== "");
                allParentFields = allParentFields.concat(filtered);
            }
        }

        if (item && item.childrenIds && item.childrenIds.length > 0) {
            selectedItems.push(item);
        }
        if (item && item.fields && item.fields.length > 0) {
            const filteredItems = item.fields.filter((el: any) => el.name.trim() !== '');
            // Merge fields from current item and fields from parents
            formData.value.fields = allParentFields.concat(filteredItems);
        } else {
            formData.value.fields = allParentFields;
        }
    } else {
        // Clear fields from the selected level and below
        selectedItems.splice(level);
        formData.value.type = null;

        // Rebuild formData.value.fields based on the remaining selected items
        let allFields: any[] = [];
        for (let i = 0; i < selectedItems.length; i++) {
            const selectedItem = selectedItems[i];
            if (selectedItem.fields && selectedItem.fields.length > 0) {
                allFields = allFields.concat(selectedItem.fields);
            }
        }
        formData.value.fields = allFields;
    }
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
                                    :key="formData.keyInput" prepend-icon="tabler-camera" @input="showImage"
                                    @click:clear="handleRemoveFile()" :rules="[requiredValidator]" />
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
