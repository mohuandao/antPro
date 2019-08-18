import { queryMenuList, addMenu, updateMenu, deleteMenu } from '@/services/menu';

export default {
  namespace: 'menumanager',

  state: {
    data: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryMenuList);
      // console.log(response);
      yield put({
        type: 'queryMenuListPut',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMenu, payload);
      yield put({
        type: 'queryMenuListPut',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMenu, payload);
      yield put({
        type: 'queryMenuListPut',
        payload: response,
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteMenu, payload);
      yield put({
        type: 'queryMenuListPut',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    queryMenuListPut(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
