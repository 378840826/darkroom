import React from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { PhotoModelState } from '@/models/photo';

interface PhotoProps {
  loading: boolean;
  photo: any;
  dispatch: Dispatch<AnyAction>;
};

class Photo extends React.Component<PhotoProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'photo/fetchList',
    });
  };

  callback = (key: any) => {
    console.log(key);
  };

  render() {
    const { photo: { list }, loading } = this.props;
    const photoClassify = {};
    list.forEach((photo: any) => {
      if (!photoClassify[photo.classify]) {
        photoClassify[photo.classify] = [];
      }
      photoClassify[photo.classify].push(photo)
    });
    console.log('photoClassify', photoClassify);
    return (
      <>
        {
          Object.keys(photoClassify).map(key => {
            return (
              <Card loading={loading} title={key} key={key}>
                {
                  photoClassify[key].map((imgInfo: any) => (
                   <img src={imgInfo.minUrl} alt=""/>
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
