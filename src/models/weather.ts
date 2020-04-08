import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryWeather } from '@/services/weather';

export interface WeatherModelState {
  city?: string;
  temp?: number;
  text?: string;
  rh?: number;
  wind_dir?: string;
  wind_class?: string;
};

export interface WeatherModelType {
  namespace: 'weather';
  state: WeatherModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<WeatherModelState>;
  };
};

const WeatherModel: WeatherModelType = {
  namespace: 'weather',

  state: {
    city: '',
    temp: 0,
    text: '',
    rh: 0,
    wind_dir: '', 
    wind_class: '',
  },

  effects: {
    *query(_, { call, put }) {
      const response = yield call(queryWeather);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
};

export default WeatherModel;