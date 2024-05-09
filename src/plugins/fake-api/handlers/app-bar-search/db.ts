import type { SearchResults } from '@db/app-bar-search/types';

interface DB {
  searchItems: SearchResults[];
}

export const db: DB = {
  searchItems: [
    {
      title: 'Dashboards',
      category: 'dashboards',
      children: [
        {
          url: { name: 'manage-sample-separation-list' },
          icon: 'tabler-chart-bar',
          title: 'Danh sách',
        },
      ],
    }
  ],
};
