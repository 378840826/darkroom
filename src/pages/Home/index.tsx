import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Typography.Text strong>
        <a href="/admin/login">管理员登录</a>
      </Typography.Text>
    </Card>
    <Card>
      <Typography.Text strong>
        <a href="/blog">blog</a>
      </Typography.Text>
    </Card>
    <Card>
      <Typography.Text strong>
        <a href="/photo">photo</a>
      </Typography.Text>
    </Card>
  </PageHeaderWrapper>
);
