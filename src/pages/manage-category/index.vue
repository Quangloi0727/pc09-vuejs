<script setup lang="ts">
import AddNewCategory from "@/views/manage-category/add-category.vue";
const header = [{
    "title": "Tên thư mục",
    "format": "Đinh dạng",
    "action": "Thao tác",
}];
const items: any[] = [
    {
        "id": 1,
        "title": "Văn bản tài liệu",
        "format": "Thư mục",
        "children": [
            {
                "id": 2,
                "title": "Công văn cung cấp mẫu hình dấu,chữ ký",
                "format": "Thư mục",
            },
            {
                "id": 3,
                "title": "Thông báo mẫu dấu,chữ ký",
                "format": "Thư mục",
            },
            {
                "id": 4,
                "title": "Thông báo thay đổi mẫu dấu,chữ ký",
                "format": "Thư mục",
            },
            {
                "id": 5,
                "title": "Biên bản thu mẫu hình dấu,chữ ký",
                "format": "Thư mục",
            },
            {
                "id": 4,
                "title": "Tài liệu chứ hình dấu,chữ ký",
                "format": "Thư mục",
            },
            {
                "id": 4,
                "title": "Bản cung cấp mẫu hình dấu,chữ ký",
                "format": "Thư mục",
            }
        ]
    },
    {
        "id": 2,
        "title": "Ấn phẩm",
        "format": "Thư mục",
        "children": [
            {
                "id": 2,
                "title": "Ân phẩm trong lĩnh vực tài chính ngân hàng",
                "format": "Thư mục",
                "children": [
                    {
                        "id": 2,
                        "title": "Tiền",
                        "format": "Thư mục",
                        "children": [
                            {
                                "id": 2,
                                "title": "Tiền hỗn hợp (Hybrid banknote)",
                                "format": "Thư mục",
                            },
                            {
                                "id": 2,
                                "title": "Tiền giấy (Paper banknote)",
                                "format": "Thư mục",
                            },
                            {
                                "id": 2,
                                "title": "Tiền polyme (Polymer banknote)",
                                "format": "Thư mục",
                            },
                        ]
                    },
                ]
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực tư pháp",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực giao thông vận tải",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm liên quan đến trật tự xã hội",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực giáo dục và đào tạo",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực ý tế",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực kế hoạch và đầu tư",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực tài nguyên và môi trường",
                "format": "Thư mục",
            },
            {
                "id": 2,
                "title": "Ấn phẩm trong lĩnh vực lao động và xã hội",
                "format": "Thư mục",
            },
        ]
    },
];
let showForm = ref<boolean>(false);
const computedMoreList = computed(() => {
    return (paramId: number) => ([
        { title: 'Thêm mới', prependIcon: 'tabler-plus', value: "add", onClick: () => { showForm.value = true; } },
        {
            title: 'Sửa',
            prependIcon: 'tabler-pencil',
            value: "edit"
            // to: { name: 'apps-invoice-edit-id', params: { id: paramId } },
        },
        { title: 'Xóa', prependIcon: 'tabler-trash', value: "delete" },
    ]);
});

</script>

<template>
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
                <v-treeview collapseIcon="tabler-minus" expandIcon="tabler-plus" :items="[element]">
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
                            <v-col cols="2">
                                <MoreBtn :menu-list="computedMoreList(item.id)" item-props />
                            </v-col>
                            <!-- Actions -->
                        </v-row>
                    </template>
                    <template #prepend="{ item }">
                        <VIcon size="12" v-if="!item.children" />
                    </template>
                </v-treeview>
            </v-lazy>
        </template>
    </VCard>
    <AddNewCategory v-model:isDrawerOpen="showForm" />
</template>
