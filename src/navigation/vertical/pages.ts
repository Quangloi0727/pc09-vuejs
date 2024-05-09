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
  }
];
