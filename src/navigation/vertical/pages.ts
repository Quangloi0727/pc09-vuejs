export default [
  { heading: 'Danh sách menu' },
  {
    title: 'Quản lý người dùng',
    icon: { icon: 'tabler-users' },
    children: [
      { title: 'Danh sách', to: 'manage-user-list' }
    ],
  },
  {
    title: 'Quản lý phân quyền',
    icon: { icon: 'tabler-lock' },
    children: [
      { title: 'Danh sách module', to: 'manage-module-list' },
      { title: 'Danh sách nhóm', to: 'manage-group-list' },
      { title: 'Danh sách quyền', to: 'manage-permission-list' },
    ],
  },
  {
    title: 'Quản lý domain',
    icon: { icon: 'tabler-database-cog' },
    children: [
      { title: 'Danh sách domain', to: 'manage-domain-list' },
    ],
  }
];
