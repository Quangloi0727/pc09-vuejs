<script setup lang="ts">
import AddNewGroupDrawer from '@/views/manage-group/AddNewGroupDrawer.vue';
import EditGroupDrawer from '@/views/manage-group/EditGroupDrawer.vue';

// 👉 Store
const searchQuery = ref('');

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
let dataEdit = ref();
const deleteItem: any = ref();
const deleteDialog = ref<boolean>(false);

// Headers
const headers: any[] = [
    { title: 'Tên nhóm', key: 'name', sortable: false, },
    { title: 'Danh sách module', key: 'module', sortable: false, },
    { title: 'Danh sách quyền', key: 'permissions', sortable: false, },
    { title: 'Thao tác', align: 'center', key: 'actions', sortable: false, },
];

// 👉 Fetching users
const { data: listData, execute: fetchData } = await useApiAuthenticationService<any>(createUrl('/manage-group/list', {
    query: {
        itemsPerPage,
        page,
        search: searchQuery
    },
}));

const list: any = computed(() => listData.value.data.data);
const total = computed(() => listData.value.data.total);
const isAddNewGroupDrawerVisible = ref(false);
const isEditGroupDrawerVisible = ref(false);
const isPermissionDialogVisible = ref(false);

// 👉 Add new user
const addNewGroup = async (groupData: any) => {
    try {
        const response = await $apiAuthenticationService(`manage-group/create`, {
            method: 'POST',
            body: groupData
        });
        if (response.error == false) {
            toast.success('Thêm mới thành công !');
        } else {
            toast.error('Thêm mới thất bại !');
        }
    } catch (error: any) {
        toast.error(error.message);
    }
    fetchData();
};

// 👉 Add new user
const editGroup = async (data: any) => {
    try {
        const response = await $apiAuthenticationService(`manage-group/${data._id}/update`, {
            method: 'PUT',
            body: data
        });
        if (response.error == false) {
            toast.success('Chỉnh sửa thành công !');
        } else {
            toast.error('Chỉnh sửa thất bại !');
        }
    } catch (error: any) {
        toast.error(error.message);
    }
    fetchData();
};

// 👉 Delete user
const deleteItemConfirm = async (_id: string) => {
    try {
        const response = await $apiAuthenticationService(`manage-group/${_id}/delete`, {
            method: 'DELETE'
        });
        if (response.error == false) {
            toast.success('Xóa thành công !');
        } else {
            toast.error('Xóa thất bại !');
        }
    } catch (error: any) {
        toast.error(error.message);
    }
    closeDelete();
    fetchData();
};

const closeDelete = () => {
    deleteDialog.value = false;
};

const setGroupPermissionsModules = async (data: any) => {
    try {
        const response = await $apiAuthenticationService(`group-permissions-modules/set`, {
            method: 'POST',
            body: data
        });
        if (response.error == false) {
            toast.success('Cập nhật thành công !');
        } else {
            toast.error('Cập nhật thất bại !');
        }
    } catch (error: any) {
        toast.error(error.message);
    }
    fetchData();
};

const printInfoPermission = (item: any) => {
    let string = "";
    if (item && item.infoDetail && item.infoDetail.permissions && item.infoDetail.permissions.length > 0) {
        item.infoDetail.permissions.forEach((field: any, index: number) => {
            if (field.name) {
                string += `<li :key="${index}">
                            ${field.name}
                        </li>`;
            }
        });
    }
    return string;
};

const printInfoModule = (item: any) => {
    return item?.infoDetail?.module?.name || "";
};

</script>

<template>
    <section>
        <VCard class="mb-6">
            <VCardItem class="pb-4">
                <VCardTitle>Danh sách nhóm</VCardTitle>
            </VCardItem>
            <VCardText class="d-flex flex-wrap gap-4">
                <div class="me-3 d-flex gap-3">
                    <AppSelect :model-value="itemsPerPage" :items="[
                        { value: 10, title: '10' },
                        { value: 25, title: '25' },
                        { value: 50, title: '50' },
                        { value: 100, title: '100' },
                    ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
                </div>
                <VSpacer />

                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                    <!-- 👉 Search  -->
                    <div style="inline-size: 15.625rem;">
                        <AppTextField v-model="searchQuery" placeholder="Tìm kiếm theo tên ..." />
                    </div>
                    <!-- 👉 Add user button -->
                    <VBtn prepend-icon="tabler-plus" @click="isAddNewGroupDrawerVisible = true">
                        Thêm mới
                    </VBtn>
                </div>
            </VCardText>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="list"
                :items-length="total" :headers="headers" class="text-no-wrap">
                <template #item.permissions="{ item }">
                    <div class="d-flex align-center gap-x-4">
                        <ul v-html="printInfoPermission(item)"></ul>
                    </div>
                </template>
                <template #item.module="{ item }">
                    {{ printInfoModule(item) }}
                </template>
                <!-- Actions -->
                <template #item.actions="{ item }">
                    <IconBtn @click="() => {
                        isPermissionDialogVisible = true;
                        dataEdit = item;
                    }" title="Gán quyền">
                        <VIcon icon="tabler-tag" />
                    </IconBtn>

                    <IconBtn @click="() => {
                        isEditGroupDrawerVisible = true;
                        dataEdit = item;
                    }" title="Chỉnh sửa">
                        <VIcon icon="tabler-pencil" />
                    </IconBtn>

                    <IconBtn @click="() => {
                        deleteDialog = true;
                        deleteItem = item;
                    }" title="Xóa">
                        <VIcon icon="tabler-trash" />
                    </IconBtn>

                </template>

                <!-- pagination -->
                <template #bottom>
                    <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="total" />
                </template>
            </VDataTableServer>
            <!-- SECTION -->
        </VCard>
        <!-- 👉 Add New User -->
        <AddNewGroupDrawer v-model:isDrawerOpen="isAddNewGroupDrawerVisible" @group-data="addNewGroup" />
        <EditGroupDrawer v-model:isDrawerOpen="isEditGroupDrawerVisible" :data="dataEdit ? dataEdit : {}"
            @update-group="editGroup" />
        <!-- 👉 Delete Dialog  -->
        <VDialog v-model="deleteDialog" max-width="500px">
            <VCard>
                <VCardTitle class="d-block font-weight-regular text-wrap">
                    Bản ghi {{ deleteItem.name }} sẽ được xóa ?
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

        <SetPermissionDialog v-model:is-dialog-visible="isPermissionDialogVisible" v-model:data="dataEdit"
            @update:set-group-permissions-modules="setGroupPermissionsModules" />
    </section>
</template>
