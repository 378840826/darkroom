import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function getList(params?: TableListParams) {
  return request('/api/admin/photo', {
    params,
  });
}

export async function deleteImg(params: TableListItem) {
  return request(`/api/admin/photo/${params.id}`, {
    method: 'DELETE',
  });
}

export async function updateInfo(params: TableListItem) {
  return request(`/api/admin/photo/${params.id}`, {
    params,
    method: 'PUT',
  });
}