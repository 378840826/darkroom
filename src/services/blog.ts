import request from '@/utils/request';

export async function queryList(): Promise<any> {
  return request('/api/blog');
}

export async function getArticle(params: string): Promise<any> {
  return request(`/api/blog/${params}`);
}

