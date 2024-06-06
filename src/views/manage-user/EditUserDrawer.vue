<script setup lang="ts">
import _ from 'underscore';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import type { VForm } from 'vuetify/components/VForm';

interface Emit {
    (e: 'update:isDrawerOpen', value: boolean): void;
    (e: 'updateUser', value: any): void;
}

interface Props {
    isDrawerOpen: boolean;
    data: {
        type: any,
        required: true,
    };
}

interface DataForm {
    _id: string;
    fullname: string;
    username: string;
    domain: any;
    groups: any[];
}

const formData = ref<DataForm>({
    _id: '',
    fullname: '',
    username: '',
    domain: null,
    groups: []
});

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const isFormValid = ref(false);
const refForm = ref<VForm>();

const itemsGroups = ref([]);

// 👉 drawer close
const closeNavigationDrawer = () => {
    emit('update:isDrawerOpen', false);

    nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
    });
};

const onSubmit = () => {
    refForm.value?.validate().then(({ valid }) => {
        if (valid) {
            emit('updateUser', formData.value);
            emit('update:isDrawerOpen', false);
            nextTick(() => {
                refForm.value?.reset();
                refForm.value?.resetValidation();
            });
        }
    });
};

const handleDrawerModelValueUpdate = (val: boolean) => {
    emit('update:isDrawerOpen', val);
};

watch(() => props.data, async (dataEdit: any) => {
    if (dataEdit && !_.isEmpty(dataEdit)) {
        const { fullname, username, domain, groups, _id } = dataEdit;
        formData.value._id = _id;
        formData.value.fullname = fullname;
        formData.value.username = username;
        formData.value.domain = domain;
        formData.value.groups = groups;
        const { data } = await useApiAuthenticationService<any>(createUrl(`/manage-domain/${domain._id}/getDetail`));
        const listGroupByDomain: any = computed(() => data.value.data.groups);
        itemsGroups.value = listGroupByDomain.value;
    }
}, { immediate: true });

const { data: listDomain } = await useApiAuthenticationService<any>(createUrl('/manage-domain/getAll'));
const itemsDomain: any = computed(() => listDomain.value.data);

const handleSelect = (item: any) => {
    formData.value.groups = [];
    if (item && item.groups) {
        itemsGroups.value = item.groups;
    } else {
        formData.value.groups = [];
    }
}

</script>

<template>
    <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content"
        :model-value="props.isDrawerOpen" @update:model-value="handleDrawerModelValueUpdate">
        <!-- 👉 Title -->
        <AppDrawerHeaderSection title="Chỉnh sửa người dùng" @cancel="closeNavigationDrawer" />

        <VDivider />

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
                <VCardText>
                    <!-- 👉 Form -->
                    <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                        <VRow>
                            <VCol cols="12">
                                <AppTextField v-model="formData.fullname" :rules="[requiredValidator]" label="Fullname"
                                    placeholder="Nhập fullname..." />
                            </VCol>
                            <VCol cols="12">
                                <AppTextField v-model="formData.username" :rules="[requiredValidator]" label="Username"
                                    placeholder="Nhập username..." />
                            </VCol>
                            <VCol cols="12">
                                <AppAutocomplete v-model="formData.domain" label="Domain"
                                    placeholder="--- Chọn domain ---" clear-icon="tabler-x" clearable itemTitle="name"
                                    itemValue="_id" :rules="[requiredValidator]" :items="itemsDomain"
                                    @update:model-value="handleSelect" return-object />
                            </VCol>
                            <VCol cols="12">
                                <AppAutocomplete v-model="formData.groups" label="Nhóm" placeholder="--- Chọn nhóm ---"
                                    clear-icon="tabler-x" clearable itemTitle="name" itemValue="_id"
                                    :rules="[requiredValidator]" :items="itemsGroups" multiple />
                            </VCol>
                            <!-- 👉 Submit and Cancel -->
                            <VCol cols="12">
                                <VBtn type="submit" class="me-3">
                                    Cập nhật
                                </VBtn>
                                <VBtn type="reset" variant="tonal" color="error" @click="closeNavigationDrawer">
                                    Hủy
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </PerfectScrollbar>
    </VNavigationDrawer>
</template>
