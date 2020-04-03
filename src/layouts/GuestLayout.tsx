/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { Link } from 'umi';
import { Dispatch } from 'redux';
// import { connect } from 'dva';
import RightContent from '@/components/GlobalHeader/GuestRightContent';
import logo from '../assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

// 导航菜单
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => (
  menuList.map(item => (
    { ...item, children: item.children ? menuDataRender(item.children) : [] }
  ))
);

// 页脚
const footerRender = () => {
  return (
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        页脚这里放一些链接和说明
      </div>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
  } = props;

  const layoutSettings = {
    title: 'xjt',
    logo: logo,
    fixedHeader: true,
    fixSiderbar: true,
  };
  
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  
  return (
    <ProLayout
      navTheme="light"
      layout="topmenu"
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...layoutSettings}
    >
    </ProLayout>
  );
};

export default BasicLayout

// export default connect(({ global, settings }: ConnectState) => ({
//   collapsed: global.collapsed,
//   settings,
// }))(BasicLayout);
