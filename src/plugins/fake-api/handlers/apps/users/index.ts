import { paginateArray } from "@api-utils/paginateArray";
import { db } from "@db/apps/users/db";
import is from "@sindresorhus/is";
import axios from "axios";
import destr from "destr";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";

const baseUrl = import.meta.env.VITE_API_BASE_URL1;

export const handlerAppsUsers = [
  // Get Users Details
  http.get("/api/apps/users", async ({ request }) => {
    const url = new URL(request.url);

    const q = url.searchParams.get("q");
    const role = url.searchParams.get("role");
    const plan = url.searchParams.get("plan");
    const status = url.searchParams.get("status");
    const sortBy = url.searchParams.get("sortBy");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const page = url.searchParams.get("page");
    const orderBy = url.searchParams.get("orderBy");

    const searchQuery = is.string(q) ? q : undefined;
    const queryLower = (searchQuery ?? "").toString().toLowerCase();

    const parsedSortBy = destr(sortBy);
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : "";

    const parsedOrderBy = destr(orderBy);
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : "";

    const parsedItemsPerPage = destr(itemsPerPage);
    const parsedPage = destr(page);

    const itemsPerPageLocal = is.number(parsedItemsPerPage)
      ? parsedItemsPerPage
      : 10;
    const pageLocal = is.number(parsedPage) ? parsedPage : 1;

    // filter users
    let filteredUsers = db.users
      .filter(
        (user) =>
          user.status === (status || user.status)
      )
      .reverse();
    const totalUsers = filteredUsers.length;

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal);

    return HttpResponse.json(
      {
        users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
        totalPages,
        totalUsers,
        page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
      },
      { status: 200 }
    );
  }),

  http.get("/api/devices/find-all", async ({ request }) => {
    const url = new URL(request.url);

    const q = url.searchParams.get("q");
    const role = url.searchParams.get("role");
    const plan = url.searchParams.get("plan");
    const status = url.searchParams.get("status");
    const sortBy = url.searchParams.get("sortBy");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const page = url.searchParams.get("page");
    const orderBy = url.searchParams.get("orderBy");

    const searchQuery = is.string(q) ? q : undefined;
    const queryLower = (searchQuery ?? "").toString().toLowerCase();

    const parsedSortBy = destr(sortBy);
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : "";

    const parsedOrderBy = destr(orderBy);
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : "";

    const parsedItemsPerPage = destr(itemsPerPage);
    const parsedPage = destr(page);

    const itemsPerPageLocal = is.number(parsedItemsPerPage)
      ? parsedItemsPerPage
      : 10;
    const pageLocal = is.number(parsedPage) ? parsedPage : 1;

    const apiUrl = `${baseUrl}/v1/devices/find-all?limit=1000&offset=0`;
    let filteredUsers: any = [];

    try {
      filteredUsers = await axios.get(apiUrl);
      filteredUsers = filteredUsers.data.data.list;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }

    const totalUsers = filteredUsers.length;

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal);

    return HttpResponse.json(
      {
        users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
        totalPages,
        totalUsers,
        page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
      },
      { status: 200 }
    );
  }),

  http.get("/api/materials/find-all", async ({ request }) => {
    const url = new URL(request.url);

    const q = url.searchParams.get("q");
    const role = url.searchParams.get("role");
    const plan = url.searchParams.get("plan");
    const status = url.searchParams.get("status");
    const sortBy = url.searchParams.get("sortBy");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const page = url.searchParams.get("page");
    const orderBy = url.searchParams.get("orderBy");

    const searchQuery = is.string(q) ? q : undefined;
    const queryLower = (searchQuery ?? "").toString().toLowerCase();

    const parsedSortBy = destr(sortBy);
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : "";

    const parsedOrderBy = destr(orderBy);
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : "";

    const parsedItemsPerPage = destr(itemsPerPage);
    const parsedPage = destr(page);

    const itemsPerPageLocal = is.number(parsedItemsPerPage)
      ? parsedItemsPerPage
      : 10;
    const pageLocal = is.number(parsedPage) ? parsedPage : 1;

    const apiUrl = `${baseUrl}/v1/materials/find-all?limit=1000&offset=0`;
    let filteredUsers: any = [];

    try {
      filteredUsers = await axios.get(apiUrl);
      filteredUsers = filteredUsers.data.data.list;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }

    const totalUsers = filteredUsers.length;

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal);

    return HttpResponse.json(
      {
        users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
        totalPages,
        totalUsers,
        page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
      },
      { status: 200 }
    );
  }),

  http.get("/api/sampleWarehouses/find-all", async ({ request }) => {
    const url = new URL(request.url);

    const q = url.searchParams.get("q");
    const role = url.searchParams.get("role");
    const plan = url.searchParams.get("plan");
    const status = url.searchParams.get("status");
    const sortBy = url.searchParams.get("sortBy");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const page = url.searchParams.get("page");
    const orderBy = url.searchParams.get("orderBy");

    const searchQuery = is.string(q) ? q : undefined;
    const queryLower = (searchQuery ?? "").toString().toLowerCase();

    const parsedSortBy = destr(sortBy);
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : "";

    const parsedOrderBy = destr(orderBy);
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : "";

    const parsedItemsPerPage = destr(itemsPerPage);
    const parsedPage = destr(page);

    const itemsPerPageLocal = is.number(parsedItemsPerPage)
      ? parsedItemsPerPage
      : 10;
    const pageLocal = is.number(parsedPage) ? parsedPage : 1;

    const apiUrl = `${baseUrl}/v1/sampleWarehouses/find-all?limit=1000&offset=0`;
    let filteredUsers: any = [];

    try {
      filteredUsers = await axios.get(apiUrl);
      filteredUsers = filteredUsers.data.data.list;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }

    const totalUsers = filteredUsers.length;

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal);

    return HttpResponse.json(
      {
        users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
        totalPages,
        totalUsers,
        page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
      },
      { status: 200 }
    );
  }),

  // Get Single User Detail
  http.get<PathParams>("/api/apps/users/:id", ({ params }) => {
    const userId = Number(params.id);

    const user = db.users.find((e) => e.id === userId);

    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      return HttpResponse.json(
        {
          ...user,
          ...{
            taskDone: 1230,
            projectDone: 568,
            taxId: "Tax-8894",
            language: "English",
          },
        },
        { status: 200 }
      );
    }
  }),

  // Delete User
  http.delete("/api/apps/users/:id", ({ params }) => {
    const userId = Number(params.id);

    const userIndex = db.users.findIndex((e) => e.id === userId);

    if (userIndex === -1) {
      return HttpResponse.json("User not found", { status: 404 });
    } else {
      db.users.splice(userIndex, 1);

      return new HttpResponse(null, {
        status: 204,
      });
    }
  }),

  // 👉 Add user
  http.post("/api/apps/users", async ({ request }) => {
    const user = (await request.json()) as any;

    db.users.push({
      ...user,
      id: db.users.length + 1,
    });

    return HttpResponse.json({ body: user }, { status: 201 });
  }),

  http.post("/api/apps/devices", async ({ request }) => {
    const data = (await request.json()) as any;

    try {
      const response = await axios.post(`${baseUrl}/v1/devices`, data);
      return HttpResponse.json({ body: response.data }, { status: 201 });
    } catch (error) {
      console.error('Error:', error);
    }

  }),

  http.post("/api/apps/materials", async ({ request }) => {
    const data = (await request.json()) as any;

    try {
      const response = await axios.post(`${baseUrl}/v1/materials`, data);
      return HttpResponse.json({ body: response.data }, { status: 201 });
    } catch (error) {
      console.error('Error:', error);
    }

  }),

  http.post("/api/apps/sampleWarehouses", async ({ request }) => {
    const data = (await request.json()) as any;

    try {
      const response = await axios.post(`${baseUrl}/v1/sampleWarehouses`, data);
      return HttpResponse.json({ body: response.data }, { status: 201 });
    } catch (error) {
      console.error('Error:', error);
    }

  }),
];
