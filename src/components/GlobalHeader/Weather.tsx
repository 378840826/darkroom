import React from 'react';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { WeatherModelState } from '@/models/weather';
import styles from './index.less';

interface WeatherProps {
  dispatch: Dispatch<AnyAction>;
  weather: WeatherModelState;
};

interface WeatherState {
  data: Array<string>;
  listMarginTop: string;
  animate: boolean;
};

class Weather extends React.Component<WeatherProps, WeatherState> {
  state = {
    data: [
      '{{city}}：{{text}} {{temp}}℃',
      '湿度 {{rh}}%  {{wind_dir}}{{wind_class}}',
    ],
    listMarginTop: '0px',
    animate: false,
  };

  scrollInterval = 0;
  
  scrollTimeout = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'weather/query',
      });
    }
    this.scrollInterval = Number(setInterval(this.scrollUp, 3000));
  };

  componentWillUnmount() {
    clearInterval(this.scrollInterval);
    clearInterval(this.scrollTimeout);
  };

  scrollUp = () => {
    const { data } = this.state;
    data.push(data[0]);
    this.setState({
      animate: true,
      listMarginTop: '-63px',
      data,
    });
    this.scrollTimeout = Number(setTimeout(() => {
      const { data } = this.state;
      data.shift();
      this.setState({
        animate: false,
        listMarginTop: '0px',
        data,
      });
    }, 1000))
  };

  template(str: string, data: WeatherModelState) {
    return str.replace(/\{\{(\w+)\}\}/g, (_, key: string) => data[key]);
  };

  render() {
    const { weather } = this.props;
    const { data, animate } = this.state;
    return (
      <div className={styles.weather}>
        {
          weather.city
          ?
          <ul
            className={animate ? styles.animate : ''}
            style={{ marginRight: '15px', marginTop: this.state.listMarginTop }}
          >
            {data.map((item, i) => <li key={i}>{this.template(item, weather)}</li>)}
          </ul>
          :
          null
        }
      </div>
    )
  };
};
export default connect(
  ({ weather } : {
    weather: WeatherModelState;
  }) => ({
    weather,
  })
)(Weather);
