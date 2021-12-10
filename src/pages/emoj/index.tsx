import React, { useEffect, useState } from 'react';
import { Form, Button, Table, Card, Input, Modal, FormInstance, message, Image, Popconfirm } from 'antd';
import { getEmojList, Emoj, updateEmoj, deleteEmoj } from '@services/emoj';
import { PageInfo } from '@utils/types';
import SelectEmojGroup from '@components/SelectEmojGroup';
import ModalCreateEmoj from './component/modalCreateEmoj';

const EmojPage = function () {
  const [list, setList] = useState<Emoj[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ page: 1, pageSize: 10, total: 0 });
  const [searchFrom] = Form.useForm();

  const fetchList = async (page?: number, pageSize?: number) => {
    try {
      setLoading(true);
      const { name, groupId } = await searchFrom.getFieldsValue();
      const { data } = await getEmojList({ page, pageSize, group_id: groupId, name });
      const { list: emjoList = [], ...pageInfo } = data || {};
      setList(emjoList);
      setPageInfo({ ...pageInfo });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchList(1, 10);
  };

  useEffect(() => {
    fetchList(1, 10);
  }, []);

  const handleSearch = () => {
    fetchList(1, 10);
  };

  const handleUpdateEmoj = (record?: Emoj) => {
    const { id } = record || {};
    const label = id ? '编辑表情' : '新增表情';
    const form = React.createRef<FormInstance>();
    Modal.confirm({
      title: label,
      width: 600,
      content: <ModalCreateEmoj data={record} modalCreateEmojRef={form} />,
      onOk: async () => {
        const { name, desc, url, groupId } = (await form.current?.validateFields()) || {};
        await updateEmoj({
          name,
          desc,
          url,
          group_id: groupId,
          id,
        });
        await refresh();
        message.success(`${label}成功`);
        form.current?.resetFields(['name', 'desc', 'url']);
        return Promise.reject();
      },
    });
  };

  const handleDeleteEmoj = async (record?: Emoj) => {
    const { id } = record || {};
    if (!id) return;
    await deleteEmoj({ id });
    await refresh();
    message.success('删除成功');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '描述',
      width: 100,
      dataIndex: 'desc',
      render: (text: string) => text || '无',
    },
    {
      title: '标签',
      width: 100,
      dataIndex: 'tag',
      render: (text: string) => text || '无',
    },
    {
      title: '分组',
      dataIndex: 'group_name',
      width: 150,
      ellipsis: true,
      render: (text: string) => text || '无',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '预览',
      width: 120,
      dataIndex: 'url',
      render: (text: string) => <Image width={100} src={text} />,
    },
    {
      title: '操作',
      render: (text: any, record: Emoj) => (
        <>
          <Button
            type="link"
            onClick={() => {
              handleUpdateEmoj(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              handleDeleteEmoj(record);
            }}
            onCancel={() => {}}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Form form={searchFrom} layout="inline">
          <Form.Item label="名称" name="name">
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="关联分组" name="groupId">
            <SelectEmojGroup />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button
              style={{ marginLeft: '20px' }}
              type="primary"
              onClick={() => {
                handleUpdateEmoj();
              }}
            >
              新增
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={list}
          columns={columns}
          pagination={{
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: () => `共${pageInfo.total}条`,
            pageSize: Number(pageInfo.pageSize),
            current: Number(pageInfo.page),
            total: Number(pageInfo.total),
            onChange: (current, pageSize) => {
              fetchList(current, pageSize);
            },
          }}
        />
      </Card>
    </>
  );
};

export default EmojPage;
