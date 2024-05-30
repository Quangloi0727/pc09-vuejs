import { ofetch } from 'ofetch';
import { ActiveLoader, useLoading } from 'vue-loading-overlay';

const $loading = useLoading();
let loaderInstance: ActiveLoader | null = null;

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  },
});

export const $apiAuthenticationService = ofetch.create({
  baseURL: import.meta.env.VITE_API_AUTHENTICATION_SERVICE || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    loaderInstance = $loading.show();
  },
  async onResponse() {
    if (loaderInstance) {
      loaderInstance.hide();
    }
  },
  async onResponseError({ response }) {
    if (loaderInstance) {
      loaderInstance.hide();
    }
    throw new Error(response?._data?.message || 'An error occurred');
  },
});
