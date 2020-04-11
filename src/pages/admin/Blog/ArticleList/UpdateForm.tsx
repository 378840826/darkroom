/*
  修改文章信息弹窗
*/ 
import React, { useState } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';

import { TableListItem } from './data.d';

export interface FormValueType extends Partial<TableListItem> {
  classify?: string;
  title?: string;
  author?: string;
  id?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Option } = Select;

const UpdateForm: React.FC<UpdateFormProps> = props => {
  const [formVals] = useState<FormValueType>({
    title: props.values.title,
    author: props.values.author,
    id: props.values.id,
    classify: props.values.classify,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = () => {
    form.validateFields().then(values => {
      handleUpdate({
        ...props.values,
        ...values,
      })
    });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="title"
          label="文章标题"
          rules={[{ required: true, message: '请输入文章标题！' }]}
        >
          <Input placeholder="标题" />
        </FormItem>
        <FormItem
          name="author"
          label="作者"
          rules={[{ required: true, message: '请输入文章作者！' }]}
        >
          <Input placeholder="作者" />
        </FormItem>
        <FormItem name="classify" label="分类">
          <Select style={{ width: '100%' }}>
            <Option value="程序">程序</Option>
            <Option value="设计">设计</Option>
            <Option value="随笔">随笔</Option>
          </Select>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={handleNext}>
          确定
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="文章信息修改"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible(false)}
    >
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 13 }}
        form={form}
        initialValues={{
          title: formVals.title,
          author: formVals.author,
          classify: formVals.classify,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
