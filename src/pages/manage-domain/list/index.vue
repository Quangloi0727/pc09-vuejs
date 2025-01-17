<script setup lang="ts">
import AddNewDomainDrawer from '@/views/manage-domain/AddNewDomainDrawer.vue';
import EditDomainDrawer from '@/views/manage-domain/EditDomainDrawer.vue';

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
    { title: 'Tên domain', key: 'name', sortable: false, },
    { title: 'Nhóm', key: 'groups', sortable: false, },
    { title: 'Thao tác', align: 'center', key: 'actions', sortable: false, },
];

// 👉 Fetching users
const { data: listData, execute: fetchData } = await useApiAuthenticationService<any>(createUrl('/manage-domain/list', {
    query: {
        itemsPerPage,
        page,
        search: searchQuery
    },
}));

const list = computed(() => listData.value.data.data);
const total = computed(() => listData.value.data.total);
const isAddNewDomainDrawerVisible = ref(false);
const isEditDomainDrawerVisible = ref(false);

// 👉 Add new user
const addNewDomain = async (domainData: any) => {
    try {
        const response = await $apiAuthenticationService(`manage-domain/create`, {
            method: 'POST',
            body: domainData
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
const editDomain = async (data: any) => {
    try {
        const response = await $apiAuthenticationService(`manage-domain/${data._id}/update`, {
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
        const response = await $apiAuthenticationService(`manage-domain/${_id}/delete`, {
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

</script>

<template>
    <section>
        <VCard class="mb-6">
            <VCardItem class="pb-4">
                <VCardTitle>Danh sách domain</VCardTitle>
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
                    <VBtn prepend-icon="tabler-plus" @click="isAddNewDomainDrawerVisible = true">
                        Thêm mới
                    </VBtn>
                </div>
            </VCardText>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="list"
                :items-length="total" :headers="headers" class="text-no-wrap">
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
                        isEditDomainDrawerVisible = true;
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
        <AddNewDomainDrawer v-model:isDrawerOpen="isAddNewDomainDrawerVisible" @domain-data="addNewDomain" />
        <EditDomainDrawer v-model:isDrawerOpen="isEditDomainDrawerVisible" :data="dataEdit ? dataEdit : {}"
            @update-domain="editDomain" />
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
    </section>
</template>
