import React from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu, Row, Col, Card } from 'antd';
import { FileImageOutlined, CodeOutlined, FileOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { Dispatch, AnyAction } from 'redux';
import { BlogModelState } from '@/models/blog';
import Article from './components/Article';

const { SubMenu } = Menu;

interface ListProps {
  list: any;
  dispatch: Dispatch<AnyAction>;
};

interface classifyList {
  code: Array<string>;
  design: Array<string>;
  essay: Array<string>;
};

class CatalogSider extends React.Component<ListProps> {
  // 一级菜单
  rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];

  state = {
    openKeys: ['sub1'],
  };

  onOpenChange = (openKeys: Array<string>) => {
    const latestOpenKey: any = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  handleClick = (e: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'blog/fetchArticle',
      payload: e.key,
    });
  };

  render() {
    const { list } = this.props;
    const classify: classifyList = {
      code: [],
      design: [],
      essay: [],
    };
    list.forEach((article: any) => {
      if (article.classify === '程序') {
        classify.code.push(article)
      }
      if (article.classify === '设计') {
        classify.design.push(article)
      }
      if (article.classify === '随笔') {
        classify.essay.push(article)
      }
    });
    return (
      <Menu
        mode="inline"
        defaultOpenKeys={['sub1']}
        defaultSelectedKeys={['0']}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        onClick={this.handleClick}
      >
        <SubMenu key="sub1" title={<span><CodeOutlined />程序</span>}>
          { classify.code.map((item: any) => <Menu.Item key={item.id}>{item.title}</Menu.Item>) }
        </SubMenu>
        <SubMenu key="sub2" title={<span><FileImageOutlined />设计</span>} >
          {classify.design.map((item: any) => <Menu.Item key={item.id}>{item.title}</Menu.Item>) }
        </SubMenu>
        <SubMenu key="sub3" title={<span><FileOutlined />随笔</span>}>
          {classify.essay.map((item: any) => <Menu.Item key={item.id}>{item.title}</Menu.Item>) }
        </SubMenu>
      </Menu>
    );
  }
};

interface BlogProps {
  loading: boolean;
  loadingArticle: boolean;
  blog: any;
  dispatch: Dispatch<AnyAction>;
};

class Blog extends React.Component<BlogProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'blog/fetchList',
    });
    dispatch({
      type: 'blog/fetchArticle',
      payload: 0,
    });
  }
  render() {
    const { loading, loadingArticle, blog, dispatch } = this.props;
    return (
      <GridContent>
        {blog.article.content ? 
        <Row gutter={24}>
          <Col xl={7} lg={9} md={24}>
            <Card loading={loading}>
              <CatalogSider dispatch={dispatch} list={blog.list} />
            </Card>
          </Col>
          <Col xl={17} lg={15} md={24}>
            <Article data={blog.article} loading={loadingArticle} />
          </Col>
        </Row> :
        <Row gutter={24}>
          <Col>
            <Card loading={loading}>
              <CatalogSider dispatch={dispatch} list={blog.list} />
            </Card>
          </Col>
        </Row>        
        }
      </GridContent>
    )
  }
};

export default connect(
  ({ blog, loading } : {
    loading: { effects: { [key: string]: boolean } };
    blog: BlogModelState;
  }) => ({
    blog,
    loading: loading.effects['blog/fetchList'],
    loadingArticle: loading.effects['blog/fetchArticle'],
  })
)(Blog);
