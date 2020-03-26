import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/api/admin/blog', {
    params,
  });
}

export async function switchArticleStatus(params: TableListItem) {
  return request(`/api/admin/blog/${params.id}/${params.status}`, {
    method: 'PUT',
  });
}


export async function updateInfo(params: TableListItem) {
  return request(`/api/admin/blog/${params.id}`, {
    params,
    method: 'PUT',
  });
}
