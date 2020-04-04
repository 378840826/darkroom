import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryList } from '@/services/photo';


// state
export interface PhotoModelState {
  list: Array<any>;
}

// modeel
export interface PhotoModelType {
  namespace: 'photo';
  state: PhotoModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    saveList: Reducer<PhotoModelState>;
  };
}

const PhotoModel: PhotoModelType = {
  namespace: 'photo',

  state: {
    list: [],
  },

  effects: {
    // 获取全部图片的分类、url等信息
    *fetchList(_, { call, put }) {
      const response = yield call(queryList);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload || {},
      }
    },
  },
};

export default PhotoModel;
