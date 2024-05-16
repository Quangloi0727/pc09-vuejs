import { ofetch } from 'ofetch';

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

export const $fetchApiImageService = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_CREATE_IMAGE || '/api',
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

export const $fetchApiAiService = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_AI || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  },
  async onResponseError({ response }) {
    throw new Error(response?._data?.message || 'An error occurred');
  },
});
