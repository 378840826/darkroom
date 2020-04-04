import React from 'react';
import { Upload, Select, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import styles from './index.less';
import ImageCompressor from 'image-compressor.js';
import { uploadImg } from './service';

const { Option } = Select;
const { Dragger } = Upload;

interface UploadPhotoState {
  classify: string,
};

class UploadPhoto extends React.Component<any, UploadPhotoState> {
  state = {
    classify: '其他',
  };

  handleSelectChange = (value: string) => {
    this.setState({
      classify: value,
    })
  };

  render() {
    const ImageCompressorOptions = {
      quality: 0.5,
      maxHeight: 80,
      maxWidth: 80,
    };
    const uploadProps = {
      action: '/api/admin/photo',
      accept: 'image/*',
      className: 'upload-list-inline',
      withCredentials: true,
      multiple: true,
      name: 'uploadPhoto',
      data: {
        classify: this.state.classify,
      },
      beforeUpload: (file:any)  => {
        if (file.size > 20971520) {
          message.error('图片大小不能超过20M');
          return false;
        }
        // 因后台图片压缩工具有问题，上传一份缩略图
        const imageCompressor = new ImageCompressor();
        imageCompressor.compress(file, ImageCompressorOptions).then((result: any) => {
          const formData = new FormData();
          const minImgFile = new File([result], `min_${file.name}`, { type: file.type });
          formData.append('uploadPhoto', minImgFile);
          uploadImg({ formData });
        }).catch((err: any) => {
          message.error('创建缩略图出错');
          console.log('创建缩略图出错', err);
        })
        return true;
      },  
      onChange(info:any) {
        const { status } = info.file;
        if (status === 'done') {
          message.success(`${info.file.name} 上传成功！`);
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
        }
      },
    };
    return (
      <>
        上传到分类：
        <Select
          placeholder="选择图片分类"
          defaultValue={this.state.classify}
          onChange={this.handleSelectChange}
        >
          <Option value="摄影">摄影</Option>
          <Option value="设计">设计</Option>
          <Option value="其他">其他</Option>
        </Select>
        <div className={styles.uploadContainer}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
            <p className="ant-upload-hint">支持单个或批量上传</p>
          </Dragger>          
        </div>
      </>
    );
  };
};

export default UploadPhoto;