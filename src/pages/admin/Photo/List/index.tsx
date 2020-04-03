import React, { useState, useRef } from 'react';
import { Modal, message, Button, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import UpdateForm, { FormValueType } from './UpdateForm';
import { TableListItem } from './data.d';
import { getList, deleteImg, updateInfo } from './service';


const PhotoList: React.FC = () => {
  const handleDelete = (record: TableListItem, actionRef: any) => {
    Modal.confirm({
      title: '确定删除图片？',
      content: `名称：${record.title}； 分类：${record.classify}`,
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        const data = {
          id: record.id,
        };
        deleteImg(data).then((res) => {
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

  const [sorter, setSorter] = useState<string>('');
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '图片',
      dataIndex: 'img',
      hideInSearch: true,
      render: (_, record) => (
        <Tooltip title={<img src={record.url} />} mouseEnterDelay={0} mouseLeaveDelay={0}>
          <div
            style={{
              minWidth: '75px',
              maxHeight: '75px',
              textAlign: 'center',
            }}
          >
            <img
              src={record.minUrl}
              style={{
                background: 'rgb(238, 238, 238)',
                width: 'auto',
                height: 'auto',
                maxWidth: '75px',
                maxHeight: '100%',
              }}
            />
          </div>
        </Tooltip>
      ),
    },
    {
      title: '名称',
      dataIndex: 'title',
      rules: [
        {
          required: true,
          message: '名称为必填项',
        },
      ],
    },
    {
      title: '大小',
      dataIndex: 'size',
      valueType: 'text',
      hideInSearch: true,
      render: value => {
        if (value) {
          return `${(Number(value) / 1024).toFixed(2)}K`;
        } else {
          return '无数据'
        }
      },
    },
    {
      title: '分类',
      dataIndex: 'classify',
      valueType: 'text',
    },
    {
      title: '上传时间',
      dataIndex: 'date',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
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
            onClick={() => handleDelete(record, actionRef)}
          >
            删除
        </Button>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="图片列表"
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

export default PhotoList;