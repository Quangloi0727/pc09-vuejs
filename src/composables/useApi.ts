import { createFetch } from '@vueuse/core';
import { destr } from 'destr';

export const useApiAuthenticationService = createFetch({
  baseUrl: import.meta.env.VITE_API_AUTHENTICATION_SERVICE || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value;

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,

        };
      }

      return { options };
    },
    afterFetch(ctx) {
      const { data, response } = ctx;
      let parsedData = null;
      try {
        parsedData = destr(data);
      }
      catch (error) {
        console.error(error);
      }
      return { data: parsedData, response };
    },
  },
});
