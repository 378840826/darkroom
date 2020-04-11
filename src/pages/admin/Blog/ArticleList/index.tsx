import React, { useState, useRef } from 'react';
import { Modal, message, Button } from 'antd';
import { ExclamationCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import UpdateForm, { FormValueType } from './UpdateForm';
import UpdateContent from './UpdateContent';
import { TableListItem } from './data.d';
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

// 修改文章信息
const handleUpdateInfo = async (fields: FormValueType) => {
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

// 修改文章内容
const handleUpdateContent = async (fields: Partial<TableListItem>) => {
  const hide = message.loading('正在提交');
  try {
    await updateInfo({
      id: fields.id,
      content: fields.content,
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

const BlogList: React.FC = () => {
  const [sorter, setSorter] = useState<string>('');
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateContentVisible, handleUpdateContentVisible] = useState<boolean>(false);
  const [infoFormValues, setInfoFormValues] = useState({});
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
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      render: value => (
        value === 'hidden'
        ?<ExclamationCircleOutlined style={{ color: "#faad14"}} />
        :<CheckCircleTwoTone twoToneColor="#52c41a" />
      ),
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
                setInfoFormValues(record);
              }}
            >
              修改信息
            </a>
            <a
              onClick={() => {
                handleUpdateContentVisible(true);
                setInfoFormValues(record);
              }}
            >
              修改内容
            </a>
            <Button
              type="link"
              onClick={() => handleSwitchStatus(record, actionRef)}
            >
              {
                record.status === 'active'
                ?<span style={{ color: '#faad14' }}>隐藏</span>
                :<span style={{ color: '#52c41a' }}>显示</span>
              }
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
      {infoFormValues && Object.keys(infoFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdateInfo(value);
            if (success) {
              handleUpdateModalVisible(false)
              setInfoFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setInfoFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={infoFormValues}
        />
      ) : null}

      {updateContentVisible ? (
        <UpdateContent
          onSubmit={async value => {
            const success = await handleUpdateContent(value);
            if (success) {
              handleUpdateContentVisible(false)
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            console.log('取消');            
            handleUpdateContentVisible(false);
          }}
          updateContentVisible={updateContentVisible}
          articleInfo={infoFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default BlogList;