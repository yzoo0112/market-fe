import api from "./axiosConfig";
import type { ViewPost } from '../type';

type SortKeyType = 'postId' | 'title' | 'nickname' | 'views' | 'create_at' | 'update_at';

interface ParamsType {
  page: number;
  size: number;
  sortKey: SortKeyType;
  sortOrder: 'asc' | 'desc';
  keyword?: string;
}

interface ApiResponse {
  data: ViewPost[];
  total: number;
}

export const getPosts = async (params: ParamsType): Promise<ApiResponse> => {
  const response = await api.get<ApiResponse>('/posts', { params });
  return response.data;
};
