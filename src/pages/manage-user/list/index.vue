<script setup lang="ts">
import AddNewUserDrawer from '@/views/manage-user/AddNewUserDrawer.vue';
import EditUserDrawer from '@/views/manage-user/EditUserDrawer.vue';
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
    { title: 'Fullname', key: 'fullname', sortable: false, },
    { title: 'Username', key: 'username', sortable: false, },
    { title: 'Số điện thoại', key: 'phone', sortable: false, },
    { title: 'Domain', key: 'domain', sortable: false, },
    { title: 'Nhóm', key: 'groups', sortable: false, },
    { title: 'Thao tác', align: 'center', key: 'actions', sortable: false, },
];

// 👉 Fetching users
const { data: listData, execute: fetchData } = await useApiAuthenticationService<any>(createUrl('/manage-user/list', {
    query: {
        itemsPerPage,
        page,
        search: searchQuery
    },
}));

const list = computed(() => listData.value.data.data);
const total = computed(() => listData.value.data.total);
const isAddNewUserDrawerVisible = ref(false);
const isEditUserDrawerVisible = ref(false);

// 👉 Add new user
const addNewUser = async (userData: any) => {
    try {
        const response = await $apiAuthenticationService(`manage-user/create`, {
            method: 'POST',
            body: userData
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

const editUser = async (data: any) => {
    try {
        const { _id, ...dataUpdate } = data;
        dataUpdate.domain = dataUpdate.domain._id;
        const response = await $apiAuthenticationService(`manage-user/${data._id}/update`, {
            method: 'PUT',
            body: dataUpdate
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

// 👉 Delete user
const deleteItemConfirm = async (_id: string) => {
    try {
        const response = await $apiAuthenticationService(`manage-user/${_id}/delete`, {
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

const printInfoDomain = (item: any) => {
    return item?.domain?.name || "";
};

</script>

<template>
    <section>
        <VCard class="mb-6">
            <VCardItem class="pb-4">
                <VCardTitle>Danh sách người dùng</VCardTitle>
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
                    <div style="inline-size: 18.625rem;">
                        <AppTextField v-model="searchQuery" placeholder="Tìm kiếm theo fullname,username ..." />
                    </div>
                    <!-- 👉 Add user button -->
                    <VBtn prepend-icon="tabler-plus" @click="isAddNewUserDrawerVisible = true">
                        Thêm mới
                    </VBtn>
                </div>
            </VCardText>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="list"
                :items-length="total" :headers="headers" class="text-no-wrap">
                <template #item.domain="{ item }">
                    {{ printInfoDomain(item) }}
                </template>
                <template #item.groups="{ item }">
                    <div class="d-flex gap-4">
                        <VChip v-for="group in item.groups" :key="group" label size="small" class="font-weight-medium"
                            color="info">
                            {{ group.name }}
                        </VChip>
                    </div>
                </template>
                <!-- Actions -->
                <template #item.actions="{ item }">
                    <IconBtn @click="() => {
                        isEditUserDrawerVisible = true;
                        dataEdit = item;
                    }">
                        <VIcon icon="tabler-pencil" />
                    </IconBtn>

                    <IconBtn @click="() => {
                        deleteDialog = true;
                        deleteItem = item;
                    }">
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
        <AddNewUserDrawer v-model:isDrawerOpen="isAddNewUserDrawerVisible" @user-data="addNewUser" />
        <!-- 👉 Add New User -->
        <!-- 👉 Add New User -->
        <EditUserDrawer v-model:isDrawerOpen="isEditUserDrawerVisible" :data="dataEdit ? dataEdit : {}"
            @update-user="editUser" />
        <!-- 👉 Add New User -->
        <!-- 👉 Delete Dialog -->
        <VDialog v-model="deleteDialog" max-width="500px">
            <VCard>
                <VCardTitle class="d-block font-weight-regular text-wrap">
                    Bản ghi {{ deleteItem.fullname }} sẽ được xóa ?
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
    </section>
</template>
