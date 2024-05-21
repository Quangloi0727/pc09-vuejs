<script setup lang="ts">
import AddNewCategory from "@/views/manage-category/add-category.vue";
import EditNewCategory from "@/views/manage-category/edit-category.vue";
const header = [{
    "title": "Tên thư mục",
    "format": "Đinh dạng",
    "action": "Thao tác",
}];
let showFormAdd = ref<boolean>(false);
let showFormEdit = ref<boolean>(false);
let dataEdit = ref();
let parentId = ref();
const computedMoreList = computed(() => {
    return (item: any) => ([
        {
            title: 'Thêm mới', prependIcon: 'tabler-plus', value: "add", onClick: () => {
                showFormAdd.value = true;
                parentId.value = item._id;
            }
        },
        {
            title: 'Sửa',
            prependIcon: 'tabler-pencil',
            value: "edit",
            onClick: () => {
                showFormEdit.value = true;
                dataEdit.value = item;
                parentId.value = item._id;
            }
        },
        {
            title: 'Xóa', prependIcon: 'tabler-trash', value: "delete", onClick: () => {
                deleteDialog.value = true;
                deleteItem.value = item;
            }
        },
    ]);
});
const deleteItem: any = ref();
const deleteDialog = ref<boolean>(false);
const closeDelete = () => {
    deleteDialog.value = false;
};
const deleteItemConfirm = async (_id: any) => {
    try {
        const response = await $fetchApiAiService(`manage-category/${_id}/delete`, {
            method: 'DELETE',
        });
        if (response.error == false) {
            toast.success('Xóa thành công !');
            closeDelete();
            fetchData();
        } else {
            closeDelete();
            toast.error('Xóa thất bại !');
        }
    } catch (error: any) {
        closeDelete();
        toast.error(error.message);
    }
};

const { data: listData, execute: fetchData } = await useApiFetchAiService<any>(createUrl('/manage-category/getList'));
const items: any = computed(() => listData.value.data);

const addCategory = async (data: any) => {
    await $fetchApiAiService(`manage-category/create`, {
        method: 'POST',
        body: data,
    });
    fetchData();
};
const editCategory = async (data: any) => {
    const _id = data.parentId;
    delete data.parentId;
    await $fetchApiAiService(`manage-category/${_id}/update`, {
        method: 'PUT',
        body: data,
    });
    fetchData();
};
</script>

<template>
    <div class="d-flex flex-wrap gap-4 ma-6">
        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
            <VBtn color="primary" prepend-icon="tabler-plus" @click="() => {
                showFormAdd = true;
                parentId = null;
            }">
                Thêm danh mục
            </VBtn>
        </div>
    </div>

    <VDivider class="mt-4" />
    <VCard>
        <template v-for="(element, i) in header" :key="i">
            <v-lazy :options="{
                threshold: 0.25,
            }" :min-height="50" transition="scroll-x-reverse-transition">
                <v-treeview :items="[element]">
                    <template #title="{ item }">
                        <v-row align="center">
                            <!-- Title -->
                            <v-col cols="8">
                                {{ item.title }}
                            </v-col>
                            <v-spacer />
                            <!-- Other columns -->
                            <v-col cols="2">
                                {{ item.format }}
                            </v-col>
                            <!-- Actions -->
                            <v-col cols="2">
                                {{ item.action }}
                            </v-col>
                        </v-row>
                    </template>
                </v-treeview>
            </v-lazy>
        </template>
        <template v-for="(element, i) in items">
            <v-lazy :options="{
                threshold: 0.25,
            }" :min-height="50" transition="scroll-x-reverse-transition">
                <v-treeview collapseIcon="tabler-minus" expandIcon="tabler-plus" :items="[element]"
                    itemChildren="childrenIds">
                    <template #title="{ item }">
                        <v-row align="center">
                            <!-- Title -->
                            <v-col cols="8">
                                {{ item.name }}
                            </v-col>
                            <v-spacer />
                            <!-- Other columns -->
                            <v-col cols="2">
                                Thư mục
                            </v-col>
                            <v-col cols="2">
                                <MoreBtn :menu-list="computedMoreList(item)" item-props />
                            </v-col>
                            <!-- Actions -->
                        </v-row>
                    </template>
                    <template #prepend="{ item }">
                        <VIcon size="12" v-if="!item.childrenIds" />
                    </template>
                </v-treeview>
            </v-lazy>
        </template>
    </VCard>
    <AddNewCategory v-model:isDrawerOpen="showFormAdd" :parentId="parentId" v-if="showFormAdd"
        @add-category="addCategory" />
    <EditNewCategory v-model:isDrawerOpen="showFormEdit" :data="dataEdit" :parentId="parentId" v-if="showFormEdit"
        @edit-category="editCategory" />
    <!-- 👉 Delete Dialog  -->
    <VDialog v-model="deleteDialog" max-width="500px">
        <VCard>
            <VCardTitle class="d-block font-weight-regular text-wrap">
                Bản ghi {{ deleteItem.title }} sẽ được xóa ?
            </VCardTitle>

            <VCardActions>
                <VSpacer />

                <VBtn color="error" variant="outlined" @click="closeDelete">
                    Hủy
                </VBtn>

                <VBtn color="success" variant="elevated" @click="deleteItemConfirm(deleteItem._id)">
                    Xác nhận
                </VBtn>

                <VSpacer />
            </VCardActions>
        </VCard>
    </VDialog>
</template>
