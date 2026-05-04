import { http } from "./http";

export type Category = {
  id: number;
  name: string;
  isDefault: boolean;
};

export type CreateCategoryPayload = {
  name: string;
};

export type UpdateCategoryPayload = {
  name: string;
};

export const categoriesApi = {
  list() {
    return http.get<Category[]>("/api/categories");
  },

  findById(id: number) {
    return http.get<Category>(`/api/categories/${id}`);
  },

  create(data: CreateCategoryPayload) {
    return http.post<Category>("/api/categories", data);
  },

  update(id: number, data: UpdateCategoryPayload) {
    return http.put<Category>(`/api/categories/${id}`, data);
  },

  remove(id: number) {
    return http.delete<void>(`/api/categories/${id}`);
  },
};
