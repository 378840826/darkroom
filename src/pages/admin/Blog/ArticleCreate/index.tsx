import React from 'react';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import './index.less';
import { createArticle } from './service'

const { Option } = Select;

export interface article {
  title: string;
  author: string;
  classify: string;
  content?: string;
};

interface ArticleCreateState {
  article: article,
  editor?: Object;
};

class ArticleCreate extends React.Component<any, ArticleCreateState> {
  state = {
    article: {
      title: '',
      author: '',
      classify: '',
    },
    // editor: new SimpleMDE,
  };

  componentDidMount() {
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


  onFinish = async (values: any) => {
    const content = this.state.editor.value()
    const data = {
      ...values,
      content,
    }
    Modal.confirm({
      title: `确定发布？`,
      content: `标题：${values.title}； 作者：${values.author}`,
      okText: '发布',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        message.loading('正在提交');
        createArticle(data).then((res) => {
          message.success(res || '提交成功！');
        }).catch(err => {
          message.error(err);
        })
      },
    });
  };

  onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  render() {  
    return (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        // onFinish={this.onFinish}
        onFinish={(val) => this.onFinish(val)}
        onFinishFailed={this.onFinishFailed}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '文章标题为必填项!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="作者"
          name="author"
          rules={[{ required: true, message: '作者为必填项!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="分类"
          name="classify"
          rules={[{ required: true, message: '请选择一个分类!' }]}
        >
          <Select placeholder="选择文章分类">
            <Option value="程序">程序</Option>
            <Option value="设计">设计</Option>
            <Option value="随笔">随笔</Option>
          </Select>
        </Form.Item>
        <textarea id="editor" />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            发布
          </Button>
        </Form.Item>
      </Form>
    );
  };
};

export default ArticleCreate;