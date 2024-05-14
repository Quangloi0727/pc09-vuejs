export default [
  { heading: 'Danh sách menu' },
  {
    title: 'Quản lý phòng thí nghiệm',
    icon: { icon: 'tabler-door' },
    children: [
      { title: 'Thiết bị', to: 'apps-quanliphongthinghiem-thietbi' },
      { title: 'Kho nguyên liệu', to: 'apps-quanliphongthinghiem-khonguyenlieu' },
      { title: 'Kho nguyên mẫu', to: 'apps-quanliphongthinghiem-khonguyenmau' },
    ],
  },
  {
    title: 'Quy trình phân tách mẫu',
    icon: { icon: 'tabler-arrows-split-2' },
    children: [
      { title: 'Danh sách', to: 'manage-sample-separation-list' },
    ],
  },
  {
    title: 'Tra cứu thông tin',
    icon: { icon: 'tabler-database-search' },
    children: [
      { title: 'Tàng thư dấu vết hình sự', to: 'manage-criminal-trace-general' },
    ],
  },
  {
    title: 'Quản lý danh mục',
    icon: { icon: 'tabler-category' },
    to: 'manage-category',
  },
];
