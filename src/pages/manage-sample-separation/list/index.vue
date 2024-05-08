<script setup lang="ts">
import type { UserProperties } from '@db/apps/users/types';

// 👉 Store
const searchQuery = ref('');
const selectedStatus = ref();

// Data table options
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
    sortBy.value = options.sortBy[0]?.key;
    orderBy.value = options.sortBy[0]?.order;
};

// Headers
const headers = [
    { title: 'Mã số hồ sơ', key: 'code', sortable: false },
    { title: 'Giai đoạn', key: 'step', sortable: false },
    { title: 'Người phụ trách', key: 'userCare', sortable: false },
    { title: 'Tổng mẫu', key: 'totalTemplate', sortable: false },
    { title: 'Ngày xử lý', key: 'processDate', sortable: false },
    { title: 'Trạng thái', key: 'status', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
];

// 👉 Fetching users
const { data: usersData, execute: fetchUsers } = await useApi<any>(createUrl('/apps/users', {
    query: {
        q: searchQuery,
        status: selectedStatus,
        itemsPerPage,
        page,
        sortBy,
        orderBy,
    },
}));

const users = computed((): UserProperties[] => usersData.value.users);
const totalUsers = computed(() => usersData.value.totalUsers);

const status = [
    { title: 'Thành công', value: 'success' },
    { title: 'Thất bại', value: 'fail' },
];

const resolveUserStatusVariant = (stat: string) => {
    const statLowerCase = stat.toLowerCase();
    if (statLowerCase === 'fail')
        return 'warning';
    if (statLowerCase === 'success')
        return 'success';
    return 'primary';
};

const getValueStatus = (st: string) => {
    const findStatus = status.find(s => s.value === st);
    if (findStatus) return findStatus.title;
    return st;
};

// 👉 Add new user
const addNewUser = async (userData: UserProperties) => {
    await $api('/apps/users', {
        method: 'POST',
        body: userData,
    });

    // refetch User
    fetchUsers();
};

// 👉 Delete user
const deleteUser = async (id: number) => {
    await $api(`/apps/users/${id}`, {
        method: 'DELETE',
    });

    // refetch User
    // TODO: Make this async
    fetchUsers();
};

const widgetData = ref([
    { value: '24', desc: 'Tổng hồ sơ', icon: 'tabler-users', iconColor: 'primary' },
    { value: '165', desc: 'Hồ sơ thất bại', icon: 'tabler-address-book-off', iconColor: 'error' },
    { value: '195', desc: 'Hồ sơ thành công', icon: 'tabler-checks', iconColor: 'success' }
]);
</script>

<template>
    <section>
        <!-- 👉 Widgets -->
        <div class="d-flex mb-6">
            <VRow>
                <template v-for="(data, id) in widgetData" :key="id">
                    <VCol cols="12" md="4" sm="6">
                        <VCard>
                            <VCardText>
                                <div class="d-flex justify-space-between">
                                    <div class="d-flex flex-column gap-y-1">
                                        <div class="d-flex gap-x-2 align-center">
                                            <h4 class="text-h4">
                                                {{ data.value }}
                                            </h4>
                                        </div>
                                        <div class="text-sm">
                                            {{ data.desc }}
                                        </div>
                                    </div>
                                    <VAvatar :color="data.iconColor" variant="tonal" rounded size="42">
                                        <VIcon :icon="data.icon" size="26" />
                                    </VAvatar>
                                </div>
                            </VCardText>
                        </VCard>
                    </VCol>
                </template>
            </VRow>
        </div>

        <VCard class="mb-6">
            <VDivider />

            <VCardText class="d-flex flex-wrap gap-4">
                <div class="me-3 d-flex gap-3">
                    <AppSelect :model-value="itemsPerPage" :items="[
                        { value: 10, title: '10' },
                        { value: 25, title: '25' },
                        { value: 50, title: '50' },
                        { value: 100, title: '100' },
                    ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
                    <!-- 👉 Add user button -->
                    <VBtn prepend-icon="tabler-plus" :to="{ name: 'manage-sample-separation-new' }">
                        Thêm hồ sơ
                    </VBtn>
                </div>
                <VSpacer />

                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                    <!-- 👉 Search  -->
                    <div style="inline-size: 10.625rem;">
                        <!-- 👉 Select Plan -->
                        <AppSelect v-model="selectedStatus" placeholder="Trạng thái" :items="status" clearable
                            clear-icon="tabler-x" />
                    </div>
                </div>
            </VCardText>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :items="users"
                :items-length="totalUsers" :headers="headers" class="text-no-wrap" show-select
                @update:options="updateOptions">
                <!-- User -->
                <template #item.code="{ item }">
                    <div class="d-flex flex-column">
                        <h6 class="text-base">
                            <RouterLink
                                :to="{ name: 'manage-sample-separation-info-result-id', params: { id: item.id } }"
                                class="font-weight-medium text-primary ">
                                #{{ item.code }}
                            </RouterLink>
                        </h6>
                    </div>
                </template>
                <!-- Status -->
                <template #item.status="{ item }">
                    <VChip :color="resolveUserStatusVariant(item.status)" size="small" label class="text-capitalize">
                        {{ getValueStatus(item.status) }}
                    </VChip>
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">
                    <IconBtn @click="deleteUser(item.id)">
                        <VIcon icon="tabler-trash" />
                    </IconBtn>

                    <IconBtn>
                        <VIcon icon="tabler-eye" />
                    </IconBtn>

                    <VBtn icon variant="text" color="medium-emphasis">
                        <VIcon icon="tabler-dots-vertical" />
                        <VMenu activator="parent">
                            <VList>
                                <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.id } }">
                                    <template #prepend>
                                        <VIcon icon="tabler-eye" />
                                    </template>

                                    <VListItemTitle>View</VListItemTitle>
                                </VListItem>

                                <VListItem link>
                                    <template #prepend>
                                        <VIcon icon="tabler-pencil" />
                                    </template>
                                    <VListItemTitle>Edit</VListItemTitle>
                                </VListItem>

                                <VListItem @click="deleteUser(item.id)">
                                    <template #prepend>
                                        <VIcon icon="tabler-trash" />
                                    </template>
                                    <VListItemTitle>Delete</VListItemTitle>
                                </VListItem>
                            </VList>
                        </VMenu>
                    </VBtn>
                </template>

                <!-- pagination -->
                <template #bottom>
                    <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalUsers" />
                </template>
            </VDataTableServer>
            <!-- SECTION -->
        </VCard>
    </section>
</template>
