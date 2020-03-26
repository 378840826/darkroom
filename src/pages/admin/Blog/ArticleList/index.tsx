import React, { useState, useRef } from 'react';
import { Modal, message, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import UpdateForm, { FormValueType } from './UpdateForm';
import { TableListItem } from './data.d';
import { Dispatch, AnyAction } from 'redux';
import { BlogModelState } from '@/models/admin/blog';
import { getList, switchArticleStatus, updateInfo } from './service'

const handleSwitchStatus = (record: TableListItem, actionRef:any) => {
  const text = record.status === 'active' ? '隐藏' : '显示';
  Modal.confirm({
    title: `确定${text}文章？`,
    content: `标题：${record.title}； 作者：${record.author}`,
    okText: '确定',
    cancelText: '取消',
    maskClosable: true,
    onOk() {
      const data = {
        id: record.id,
        status: record.status === 'active' ? 'hidden' : 'active',
      };
      switchArticleStatus(data).then((res) => {
        message.success(res || '操作成功！')
        actionRef.current.reload();
      }).catch(err => {
        message.error(err)
      })
    },
  });
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateInfo({
      id: fields.id,
      title: fields.title,
      author: fields.author,
      classify: fields.classify,
    });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

interface BlogListProps {
  dispatch: Dispatch<AnyAction>;
  adminBlog: BlogModelState;
}

const BlogList: React.FC<BlogListProps> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '作者',
      dataIndex: 'author',
      valueType: 'textarea',
    },
    {
      title: '分类',
      dataIndex: 'classify',
      valueType: 'text',
    },
    {
      title: '发布时间',
      dataIndex: 'date',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        hidden: { text: '隐藏' },
        active: { text: '显示' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return(
          <>
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              修改
          </a>
            <Button
              type="link"
              danger
              onClick={() => handleSwitchStatus(record, actionRef)}
            >
              {record.status === 'active' ? '隐藏' : '显示'}
          </Button>
          </>
        )
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="文章列表"
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{ sorter }}
        columns={columns}
        request={params => getList(params)}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false)
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default BlogList;