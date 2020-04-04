import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { PhotoModelState } from '@/models/photo';
import Zmage from 'react-zmage';

interface PhotoInfo {
  id: string;
  title: string;
  mimetype: string;
  size: string;
  classify: string;
  date: number,
  url: string;
  minUrl: string;
};

interface PhotoProps {
  loading: boolean;
  photo: {
    list: Array<PhotoInfo>,
  };
  dispatch: Dispatch<AnyAction>;
};

class Photo extends React.Component<PhotoProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'photo/fetchList',
    });
  };

  handleCardClick = (imgInfo: PhotoInfo) => {
    const { photo: { list } } = this.props;
    const { classify } = imgInfo;
    let defaultPage;
    const set = list[classify].map((item: PhotoInfo, index: Number) => {
      if (item.id === imgInfo.id) {
        defaultPage = index;
      }
      return {
        src: item.url,
        alt: item.title,
      }
    })
    Zmage.browsing({
      set,
      defaultPage,
      controller: {
        download: true,
      },
    })
  };

  render() {
    const { photo: { list }, loading } = this.props;
    const photoClassify = {};
    list.forEach((photo: PhotoInfo) => {
      if (!photoClassify[photo.classify]) {
        photoClassify[photo.classify] = [];
      }
      photoClassify[photo.classify].push(photo)
    });
    return (
      <>
        {
          Object.keys(photoClassify).map(key => {
            return (
              <Card loading={loading} title={key} key={key}>
                {
                  photoClassify[key].map((imgInfo: PhotoInfo) => (
                    <img src={imgInfo.minUrl} alt={imgInfo.title} onClick={this.handleCardClick.bind(this, imgInfo)} />
                  ))
                }
              </Card>
            )
          })
        }
      </>
    );
  }
};

export default connect(
  ({ photo, loading } : {
    loading: { effects: { [key: string]: boolean } };
    photo: PhotoModelState;
  }) => ({
    photo,
    loading: loading.effects['photo/fetchList'],
    loadingArticle: loading.effects['photo/fetchArticle'],
  })
)(Photo);
