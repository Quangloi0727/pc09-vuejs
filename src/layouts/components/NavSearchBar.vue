<script setup lang="ts">
import { useConfigStore } from '@core/stores/config';
import type { SearchResults } from '@db/app-bar-search/types';
import { withQuery } from 'ufo';
import type { RouteLocationRaw } from 'vue-router';

interface Suggestion {
  icon: string;
  title: string;
  url: RouteLocationRaw;
}

defineOptions({
  inheritAttrs: false,
});

const configStore = useConfigStore();

interface SuggestionGroup {
  title: string;
  content: Suggestion[];
}

// 👉 Is App Search Bar Visible
const isAppSearchBarVisible = ref(false);
const isLoading = ref(false);

// 👉 Default suggestions

const suggestionGroups: SuggestionGroup[] = [
  {
    title: 'Popular Searches',
    content: [
      { icon: 'tabler-chart-bar', title: 'Analytics', url: { name: 'dashboards-analytics' } },
      { icon: 'tabler-chart-donut-3', title: 'CRM', url: { name: 'dashboards-crm' } },
      { icon: 'tabler-shopping-cart', title: 'eCommerce', url: { name: 'dashboards-ecommerce' } },
      { icon: 'tabler-truck', title: 'Logistics', url: { name: 'dashboards-logistics' } },
    ],
  },
  {
    title: 'Apps & Pages',
    content: [
      { icon: 'tabler-calendar', title: 'Calendar', url: { name: 'apps-calendar' } },
      { icon: 'tabler-lock', title: 'Roles & Permissions', url: { name: 'apps-roles' } },
      { icon: 'tabler-settings', title: 'Account Settings', url: { name: 'pages-account-settings-tab', params: { tab: 'account' } } },
      { icon: 'tabler-copy', title: 'Dialog Examples', url: { name: 'pages-dialog-examples' } },
    ],
  },
  {
    title: 'User Interface',
    content: [
      { icon: 'tabler-typography', title: 'Typography', url: { name: 'pages-typography' } },
      { icon: 'tabler-menu-2', title: 'Accordion', url: { name: 'components-expansion-panel' } },
      { icon: 'tabler-info-triangle', title: 'Alert', url: { name: 'components-alert' } },
      { icon: 'tabler-checkbox', title: 'Cards', url: { name: 'pages-cards-card-basic' } },
    ],
  },
  {
    title: 'Forms & Tables',
    content: [
      { icon: 'tabler-circle-dot', title: 'Radio', url: { name: 'forms-radio' } },
      { icon: 'tabler-file-invoice', title: 'Form Layouts', url: { name: 'forms-form-layouts' } },
      { icon: 'tabler-table', title: 'Table', url: { name: 'tables-data-table' } },
      { icon: 'tabler-edit', title: 'Editor', url: { name: 'forms-editors' } },
    ],
  },
];

// 👉 No Data suggestion
const noDataSuggestions: Suggestion[] = [
  {
    title: 'Analytics',
    icon: 'tabler-chart-bar',
    url: { name: 'dashboards-analytics' },
  },
  {
    title: 'CRM',
    icon: 'tabler-chart-donut-3',
    url: { name: 'dashboards-crm' },
  },
  {
    title: 'eCommerce',
    icon: 'tabler-shopping-cart',
    url: { name: 'dashboards-ecommerce' },
  },
];

const searchQuery = ref('');

const router = useRouter();
const searchResult = ref<SearchResults[]>([]);

const fetchResults = async () => {
  isLoading.value = true;

  const { data } = await useApi<any>(withQuery('/app-bar/search', { q: searchQuery.value }));

  searchResult.value = data.value;

  // ℹ️ simulate loading: we have used setTimeout for better user experience your can remove it
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

watch(searchQuery, fetchResults);

const closeSearchBar = () => {
  isAppSearchBarVisible.value = false;
  searchQuery.value = '';
};

// 👉 redirect the selected page
const redirectToSuggestedPage = (selected: Suggestion) => {
  router.push(selected.url as string);
  closeSearchBar();
};

const LazyAppBarSearch = defineAsyncComponent(() => import('@core/components/AppBarSearch.vue'));
</script>

<style lang="scss">
@use "@styles/variables/vuetify.scss";

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  font-size: 0.8125rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-bar-search-dialog {
  .custom-letter-spacing {
    letter-spacing: 0.8px;
  }

  .card-list {
    --v-card-list-gap: 8px;
  }
}
</style>
