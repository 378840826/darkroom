import request from '@/utils/request';

// 上传缩略图
export async function uploadImg(params: any) {
  return request('/api/admin/photo/', {
    method: 'POST',
    data: params.formData,
  });
}