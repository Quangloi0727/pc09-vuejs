import is from '@sindresorhus/is';
import axios from "axios";
import { destr } from 'destr';
import { HttpResponse, http } from 'msw';

// 👉 Url Auth Service
const baseUrl = import.meta.env.VITE_API_BASE_URL_AUTH;

export const handlerAppsDomain = [
  // 👉 Get Domain List
  http.get(('/api/apps/domain'), async ({ request }) => {
    const url = new URL(request.url)

    const q = url.searchParams.get('q') || '';
    const sortBy = url.searchParams.get('sortBy');
    const page = url.searchParams.get('page') || 1;
    const itemsPerPage = url.searchParams.get('itemsPerPage') || 10;
    const orderBy = url.searchParams.get('orderBy');

    const parsedSortBy = destr(sortBy);
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : '';

    const parsedOrderBy = destr(orderBy);
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : '';

    const parsedItemsPerPage = destr(itemsPerPage);
    const parsedPage = destr(page);

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10;
    const pageLocal = is.number(parsedPage) ? parsedPage : 1;

    const searchQuery = is.string(q) ? q : undefined;
    // console.log('searchQuery', searchQuery);

    const queryLower = (searchQuery ?? '').toString().toLowerCase();

    const queryParams: any = {
      page: parsedPage,
      limit: itemsPerPageLocal,
      q: queryLower
    };
    const queryString = new URLSearchParams(queryParams).toString();

    let filteredDomains: any = [];
    let totalDomains: any;
    // 👉 get data from api auth
    const apiUrl = `${baseUrl}/domains?${queryString}`;
    try {
      const response = await axios.get(apiUrl);
      console.log('response', response)
      filteredDomains = response.data.data.docs;
      totalDomains = response.data.data.total;
    } catch (error) {
      // 👉 do nothing
    }

    // return response with paginated data
    return HttpResponse.json(
      {
        data: filteredDomains,
        total: totalDomains,
      },
      {
        status: 200,
      },
    )
  }),

  // 👉 Create Domain
  http.post("/api/apps/domain", async ({ request }) => {
    const data = (await request.json()) as any;

    try {
      const response = await axios.post(`${baseUrl}/domains/`, data);
      return HttpResponse.json({ body: response.data }, { status: 201 });
    } catch (error: any) {
      return HttpResponse.json({ body: error.response }, { status: 201 });
    }

  }),

  // 👉 Update Domain
  http.put(('/api/apps/domain/:id'), async ({ request, params }) => {
    const data = (await request.json()) as any;
    try {
      const eventId = String(params.id)
      const response = await axios.put(`${baseUrl}/domains/${eventId}`, data);
      return HttpResponse.json({ body: response.data }, { status: 201 });
    } catch (error: any) {
      return HttpResponse.json({ body: error.response }, { status: 201 });
    }
  }),

  // 👉 Delete Domain
  http.delete(('/api/apps/domain/:id'), async ({ request, params }) => {
    const data = (await request.json()) as any;
    try {
      const eventId = String(params.id)
      const response = await axios.delete(`${baseUrl}/domains/${eventId}`);
      return HttpResponse.json({ body: response.data }, { status: 201 });
    } catch (error: any) {
      return HttpResponse.json({ body: error.response }, { status: 201 });
    }
  }),
]
