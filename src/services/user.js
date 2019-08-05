import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

// 所有请求头带上 ticket,在request.js里设置
export async function queryCurrent() {
  return request('/api/currentUser2');
}
