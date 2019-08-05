import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export async function queryRoutes() {
  return request('/api/menu/routes', {});
}

export async function queryMenuList() {
  return request('/api/menu/children');
}

export async function addMenu(params) {
  return request('/api/menu/add', {
    requestType: 'form',
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params) {
  return request('/api/menu/update', {
    requestType: 'form',
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteMenu(params) {
  return request('/api/menu/delete', {
    requestType: 'form',
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
