import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryList, getArticle } from '@/services/blog';

// 目录
export interface BlogList {
  title: string;
  author: string;
  date: string;
  classify: string;
}

// 当前打开的文章
export interface Article {
  title?: string;
  date?: string;
  content?: string; 
}

// state
export interface BlogModelState {
  list?: Array<BlogList>;
  article?: Article;
}

// modeel
export interface BlogModelType {
  namespace: 'blog';
  state: BlogModelState;
  effects: {
    fetchList: Effect;
    fetchArticle: Effect;
  };
  reducers: {
    saveList: Reducer<BlogModelState>;
    saveArticle: Reducer<BlogModelState>;
  };
}

const BlogModel: BlogModelType = {
  namespace: 'blog',

  state: {
    list: [],
    article: {
      title: '',
      date: '',
      content: '',
    },
  },

  effects: {
    // 获取文章目录列表
    *fetchList(_, { call, put }) {
      const response = yield call(queryList);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    // 获取文章
    *fetchArticle({ payload }, { call, put }) {
      const response = yield call(getArticle, payload);
      yield put({
        type: 'saveArticle',
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
    saveArticle(state, action) {
      return {
        ...state,
        article: action.payload || {},
      };
    },
  },
};

export default BlogModel;
