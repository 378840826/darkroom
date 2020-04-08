import request from '@/utils/request';

export async function queryWeather(): Promise<any> {
  return request('/api/weather');
}