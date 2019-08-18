import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Modal, Dropdown, Menu, Icon, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './MenuManager.less';

const FormItem = Form.Item;
const { confirm } = Modal;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    handleUpdate,
    handleAddChildren,
    formValues,
  } = props;
  const okHandle = () => {
    // debugger;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // 没选中新增,选中了修改,选中了也可以新增子菜单
      if (JSON.stringify(formValues) === '{}') {
        handleAdd(fieldsValue);
      } else if (formValues.key && formValues.name) {
        handleUpdate(fieldsValue);
      } else if (!formValues.name) {
        handleAddChildren(fieldsValue);
      }

      // if(formValues.key && formValues.name) {

      //   handleUpdate(fieldsValue);

      // }
      // if(!formValues.name){
      //   handleAddChildren(fieldsValue);
      // }
    });
  };
  return (
    <Modal
      destroyOnClose
      title={JSON.stringify(formValues) === '{}' ? '新建菜单' : '修改'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少一个字符的规则描述！', min: 1 }],
          initialValue: formValues.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单路径">
        {form.getFieldDecorator('path', {
          rules: [{ required: true, message: '请输入至少一个字符的规则描述！', min: 1 }],
          initialValue: formValues.path,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单图标">
        {form.getFieldDecorator('icon', {
          rules: [{ required: true, message: '请输入至少一个字符的规则描述！', min: 1 }],
          initialValue: formValues.icon,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="">
        {form.getFieldDecorator('key', {
          rules: [{ required: false, message: '请输入至少五个字符的规则描述！' }],
          initialValue: formValues.key,
        })(<Input placeholder="请输入" type="hidden" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="">
        {form.getFieldDecorator('parentId', {
          rules: [{ required: false, message: '请输入至少五个字符的规则描述！' }],
          initialValue: formValues.parentId,
        })(<Input placeholder="请输入" type="hidden" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ menumanager, loading }) => ({
  menumanager,
  loading: loading.models.menumanager,
}))
class MenuManager extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'menumanager/fetch',
    });
  }

  // click add
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      formValues: {},
    });
  };

  // click update
  handleModalVisibleUpdate = (flag, selectedRows) => {
    if (selectedRows.length === 1) {
      this.setState({
        modalVisible: !!flag,
        formValues: selectedRows[0],
      });
    } else {
      message.info('请选择一条数据进行修改');
    }
  };

  // click  addChildren menu
  handleModalVisibleAddChildren = (flag, selectedRows) => {
    // debugger;
    if (selectedRows.length === 1) {
      this.setState({
        modalVisible: !!flag,
        formValues: {
          key: selectedRows[0].key,
        },
      });
    } else {
      message.info('请选择一条数据进行添加子菜单');
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menumanager/add',
      payload: {
        name: fields.name,
        path: fields.path,
        icon: fields.icon,
        key: fields.key,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menumanager/update',
      payload: {
        name: fields.name,
        path: fields.path,
        icon: fields.icon,
        key: fields.key,
        parentId: fields.parentId,
      },
    });

    message.success('修改成功');
    this.handleModalVisible();
  };

  handleAddChildren = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menumanager/add',
      payload: {
        name: fields.name,
        path: fields.path,
        icon: fields.icon,
        key: fields.key,
      },
    });

    message.success('增加子菜单成功');
    this.handleModalVisible();
  };

  handleDelete = keys => {
    console.log(keys);
    const { dispatch } = this.props;
    dispatch({
      type: 'menumanager/delete',
      payload: {
        keys,
      },
    });

    message.success('删除成功');
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  showDeleteConfirm = (selectedRows, handleDelete) => {
    confirm({
      title: '你确定要删除这项?',

      okText: '确定',
      okType: 'danger',
      okButtonProps: {
        disabled: false,
      },
      cancelText: '取消',
      onOk() {
        console.log('OK');
        handleDelete(
          selectedRows.map(value => {
            return value.key;
          })
        );
      },
      onCancel() {},
    });
  };

  render() {
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '菜单路径',
        dataIndex: 'path',
        key: 'path',
        width: '15%',
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        width: '10%',
        key: 'icon',
      },
      {
        title: '隐藏子菜单',
        dataIndex: 'hideChildrenInMenu',
        width: '10%',
        key: 'hideChildrenInMenu',
      },
      {
        title: '隐藏菜单',
        dataIndex: 'hideInMenu',
        width: '10%',
        key: 'hideInMenu',
      },
    ];
    // debugger;
    const {
      menumanager: { data },
    } = this.props;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdate: this.handleUpdate,
      handleAddChildren: this.handleAddChildren,
    };
    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(selectedRows);
        console.log(selected);
        console.log(record);
        this.handleSelectRows(selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };

    const { modalVisible, selectedRows, formValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="addchildren">新建子菜单</Menu.Item>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="菜单管理">
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建父菜单
            </Button>
            {selectedRows.length === 1 && (
              <span>
                <Button onClick={() => this.handleModalVisibleAddChildren(true, selectedRows)}>
                  新建子菜单
                </Button>
                <Button onClick={() => this.handleModalVisibleUpdate(true, selectedRows)}>
                  修改
                </Button>
                <Button
                  onClick={() => this.showDeleteConfirm(selectedRows, this.handleDelete)}
                  type="dashed"
                >
                  删除
                </Button>
              </span>
            )}
            {selectedRows.length > 1 && (
              <Dropdown overlay={menu}>
                <Button>
                  批量操作 <Icon type="down" />
                </Button>
              </Dropdown>
            )}
          </div>
        </div>
        <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
        <CreateForm {...parentMethods} modalVisible={modalVisible} formValues={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default MenuManager;
