import type { HorizontalNavItems } from '@layouts/types';
import apps from './apps';
import pages from './pages';

export default [...apps, ...pages] as HorizontalNavItems;
