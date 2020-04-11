/*
  修改文章信息弹窗
*/ 
import React from 'react';
import { Button } from 'antd';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import { TableListItem } from './data.d';
import { getArticle } from '@/services/blog';

export interface UpdateFormProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (info: {}, content: string | void) => void;
  updateContentVisible: boolean;
  articleInfo: Partial<TableListItem>;
}

class UpdateContentForm extends React.Component<UpdateFormProps> {
  state = {
    editor: {
      value: (content?: string) => {},
    },
  };

  componentDidMount() {
    const { articleInfo: { id } } =this.props;
    getArticle(id).then((res: any) => {
      this.state.editor.value(res.content);
    })
    const options = {
      autofocus: true,
      autosave: true,
      previewRender(plainText: string) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight(code: string) {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    };
    this.setState({
      editor: new SimpleMDE(options),
    });
  };

  render() {
    const {
      onSubmit: handleSubmit,
      onCancel: handleUpdateModalVisible,
      updateContentVisible,
      articleInfo,
    } = this.props;
    const { editor } = this.state;
    return (
      <div style={{ marginTop: '20px' }}>
        {
          updateContentVisible
          ?
          <div>
            <Button block onClick={() => handleUpdateModalVisible(false)}>取消修改</Button>
            <div style={{ textAlign: 'center' }}>
              <h1>{articleInfo.title}</h1>
              由 {articleInfo.author} 发布于 {articleInfo.classify} 分类
            </div>
            <textarea id="editor" />
            <Button onClick={() => handleUpdateModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={
                () => handleSubmit({
                  id: articleInfo.id,
                  content: editor.value(),
                })
              }
            >
              提交
            </Button>
          </div>
          :
          null
        }
      </div>
    );
  }
};

export default UpdateContentForm;
