export default [
  { heading: 'Danh sách menu' },
  {
    title: 'Phân quyền',
    icon: { icon: 'tabler-users-group' },
    children: [
      { title: 'Danh sách người dùng', to: 'manage-user-list' },
      { title: 'Danh sách domain', to: 'manage-domain-list' },
      { title: 'Danh sách module', to: 'manage-module-list' },
      { title: 'Danh sách nhóm', to: 'manage-group-list' },
      { title: 'Danh sách quyền', to: 'manage-permission-list' },
    ],
  }
];
