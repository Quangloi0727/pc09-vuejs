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

const colors: any = {
    'view': { color: 'info' },
    'create': { color: 'success' },
    'edit': { color: 'warning' },
    'delete': { color: 'primary' }
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
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items-length="total"
                class="text-no-wrap">
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header.key">
                            {{ header.title }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <template v-for="(group, index) in list" :key="group._id">
                        <template v-if="group.infoDetail.length > 0">
                            <tr v-for="(detail, detailIndex) in group.infoDetail" :key="detail._id">
                                <td v-if="detailIndex === 0" :rowspan="group.infoDetail.length">
                                    {{ group.name }}
                                </td>
                                <td style="padding-inline-start: 15px !important;">
                                    {{ detail.moduleId.name }}
                                </td>
                                <td>
                                    <div class="d-flex gap-4">
                                        <VChip v-for="permission in detail.permissions" :key="permission" label
                                            size="small" class="font-weight-medium"
                                            :color="colors[permission?.name]?.color || 'info'">
                                            {{ permission.name }}
                                        </VChip>
                                    </div>
                                </td>
                                <td v-if="detailIndex === 0" :rowspan="group.infoDetail.length"
                                    style="padding-inline-start: 0px !important;">
                                    <IconBtn @click="() => {
                                        isPermissionDialogVisible = true;
                                        dataEdit = group;
                                    }" title="Gán quyền">
                                        <VIcon icon="tabler-tag" />
                                    </IconBtn>

                                    <IconBtn @click="() => {
                                        isEditGroupDrawerVisible = true;
                                        dataEdit = group;
                                    }" title="Chỉnh sửa">
                                        <VIcon icon="tabler-pencil" />
                                    </IconBtn>

                                    <IconBtn @click="() => {
                                        deleteDialog = true;
                                        deleteItem = group;
                                    }" title="Xóa">
                                        <VIcon icon="tabler-trash" />
                                    </IconBtn>
                                </td>
                                <!-- Các cột khác tương tự -->
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td>
                                    {{ group.name }}
                                </td>
                                <td></td>
                                <td></td>
                                <td style="padding-inline-start: 0px !important;">
                                    <IconBtn @click="() => {
                                        isPermissionDialogVisible = true;
                                        dataEdit = group;
                                    }" title="Gán quyền">
                                        <VIcon icon="tabler-tag" />
                                    </IconBtn>

                                    <IconBtn @click="() => {
                                        isEditGroupDrawerVisible = true;
                                        dataEdit = group;
                                    }" title="Chỉnh sửa">
                                        <VIcon icon="tabler-pencil" />
                                    </IconBtn>

                                    <IconBtn @click="() => {
                                        deleteDialog = true;
                                        deleteItem = group;
                                    }" title="Xóa">
                                        <VIcon icon="tabler-trash" />
                                    </IconBtn>
                                </td>

                            </tr>
                        </template>
                    </template>
                </tbody>
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
