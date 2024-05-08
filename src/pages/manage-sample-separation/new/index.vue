<script setup lang="ts">
import type { CustomInputContent } from '@core/types';

const radioContent: CustomInputContent[] = [
    {
        title: 'Standard',
        desc: 'Delivery in 3-5 days.',
        value: 'standard',
        icon: { icon: 'tabler-briefcase-2', size: '32' },
    },
    {
        title: 'Express',
        desc: 'Delivery within 2 days.',
        value: 'express',
        icon: { icon: 'tabler-rocket', size: '32' },
    },
    {
        title: 'Overnight',
        desc: 'Delivery within a days.',
        value: 'overnight',
        icon: { icon: 'tabler-crown', size: '32' },
    },
];

const promoCodeList = [
    {
        code: 'TAKEITALL',
        desc: 'Apply this code to get 15% discount on orders above 20$.',
    },
    {
        code: 'FESTIVE10',
        desc: 'Apply this code to get 10% discount on all orders.',
    },
    {
        code: 'MYSTERYDEAL',
        desc: 'Apply this code to get discount between 10% - 50%.',
    },
];

const formData = ref({
    fullName: '',
    email: '',
    contactNumber: null,
    altContactNumber: null,
    address: '',
    pincode: null,
    Landmark: '',
    city: '',
    state: null,
    defaultAddress: false,
    addressType: 'home',
    deliveryType: 'overnight',
    promoCode: '',
    paymentMethod: 'card',
    cardNumber: null,
    cardName: '',
    cardExDate: '',
    cardCvv: '',
});
</script>

<template>
    <VCard class="overflow-visible">
        <div class="w-100 sticky-header overflow-hidden rounded-t">
            <div class=" d-flex align-center gap-4 flex-wrap bg-custom-background pa-2">
                <VCardTitle>Thêm mới hồ sơ</VCardTitle>
                <VSpacer />
                <div>
                    <VBtn variant="tonal" class="me-4">
                        Hủy
                    </VBtn>
                    <VBtn>Lưu</VBtn>
                </div>
            </div>
        </div>

        <VCardText>
            <VRow>
                <VCol md="11" cols="12" class="mx-auto">
                    <VForm>
                        <h5 class="text-h6 mb-6">
                            Thông tin hồ sơ
                        </h5>
                        <VRow>
                            <VCol cols="12" md="12">
                                <AppTextField v-model="formData.fullName" label="Tên hồ sơ" placeholder="Nhập..." />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppSelect v-model="formData.state" label="Người phụ trách" placeholder="--- Chọn ---"
                                    :items="['Nguyễn văn A', 'Nguyễn văn B', 'Nguyễn văn C']" clear-icon="tabler-x"
                                    clearable />
                            </VCol>

                            <VCol cols="12" md="6">
                                <AppDateTimePicker v-model="formData.contactNumber" label="Ngày tạo"
                                    prepend-inner-icon="tabler-calendar" placeholder="Chọn ngày tạo"
                                    :config="{ dateFormat: 'd/m/Y' }" />
                            </VCol>

                            <VCol cols="12">
                                <div>
                                    <TiptapEditor v-model="formData.contactNumber" label="Ghi chú"
                                        class="border rounded basic-editor" />
                                </div>
                            </VCol>
                        </VRow>
                    </VForm>
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
