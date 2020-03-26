import request from '@/utils/request';
import { article } from './index';


export async function createArticle(params?: article) {
  return request('/api/admin/blog', {
    method: 'POST',
    data: {
      ...params,
    }
  });
}
