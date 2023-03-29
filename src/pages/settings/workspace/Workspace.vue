<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form-model layout="inline">
        <a-form-model-item label="名称">
          <a-input
              v-model="query.query.name"/>
        </a-form-model-item>
        <a-form-model-item label="编码">
          <a-input
              v-model="query.query.code"/>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="submitForm('ruleForm')">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>

    <a-card>
      <a-button @click="showAdd" v-if="isAdmin" type="primary">新建</a-button>
      <standard-table
          :scroll="{ x: 1200 }"
          rowKey="id"
          style="clear: both"
          :columns="columns"
          :dataSource="dataSource"
          @clear="onClear"
          @change="onChange"
          :loading="loading"
          @selectedRowChange="onSelectChange"
          :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="workspaceAdminList" slot-scope="{text, record}">
          <div class="admin-avatar" :style="'margin-left:'+((index*15+1)-20)+'px;z-index:'+index" :key="user.id"
               v-for="(user,index) in record.workspaceAdminList">
            <a-avatar v-if="index<4" size="small" icon="user" :src="user.avatar"/>
            <a-avatar size="small" :src="user.avatar" style="margin-left:-2px;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: cover;
                        -webkit-filter: blur(2px);
                        -moz-filter: blur(3px);
                        -o-filter: blur(3px);
                        -ms-filter: blur(2px);
                        filter: blur(2px);" v-else-if="index===4"/>
          </div>
        </div>
        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="showEdit(record)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a style="margin-right: 8px" @click="showMember(record)">
            <a-icon type="team"/>
            成员
          </a>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              更多
              <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item @click="keySettingMethod(record)">
                <a-icon type="file-protect"/>
                密钥
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                    title="你确定要删除这个工作空间吗"
                    ok-text="是"
                    cancel-text="不了"
                    @confirm="deleteWorkspace(record)"
                >
                  <a>
                    <a-icon type="delete"/>
                    删除
                  </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </a-card>

    <a-modal
        title="新建工作空间"
        :visible="add.visible"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="addHandleOk('addWorkspace')"
        @cancel="addHandleCancel('addWorkspace')">
      <template>
        <a-form-model ref="addWorkspace" :model="add.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="空间名称" has-feedback prop="name">
            <a-input v-model="add.form.name" placeholder="请输入空间名称"/>
          </a-form-model-item>
          <a-form-model-item label="空间编码" has-feedback prop="code">
            <a-input v-model="add.form.code" placeholder="请输入空间编码"/>
          </a-form-model-item>
          <a-form-model-item label="空间描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>

    <a-modal
        title="编辑工作空间"
        :visible="edit.visible"
        :confirm-loading="edit.confirmLoading"
        :width="700"
        @ok="editHandleOk('editWorkspace')"
        @cancel="editHandleCancel('editWorkspace')">
      <template>
        <a-form-model ref="editWorkspace" :model="edit.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="空间名称" has-feedback prop="name">
            <a-input v-model="edit.form.name"/>
          </a-form-model-item>
          <a-form-model-item label="空间编码">
            <a-input disabled="disabled" v-model="edit.form.code"/>
          </a-form-model-item>
          <a-form-model-item label="空间描述">
            <a-input v-model="edit.form.description" type="textarea"/>
          </a-form-model-item>
          <!--          @click="onSubmit"-->
        </a-form-model>
      </template>
    </a-modal>

    <a-modal
        title="工作空间成员"
        :visible="member.visible"
        :confirm-loading="member.confirmLoading"
        :width="700"
        @ok="memberHandleOk"
        @cancel="memberHandleCancel"
    >
      <a-form :form="form" layout="inline">
        <a-form-item label="用户名称/编码">
          <a-input v-model="member.query.query.userName"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="queryMember()">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
      <br>
      <a-space class="operator">
        <a-button @click="showAddMember" type="primary">新增成员</a-button>
      </a-space>
      <br> <br>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="管理员">

          <standard-table
              rowKey="userId"
              style="clear: both"
              :columns="member.columns"
              :loading="member.loading"
              :dataSource="member.dataSource"
              :pagination="{showSizeChanger: true, showQuickJumper: true,
              pageSize: this.member.query.page.pageSize,
              total: this.member.query.page.total}"
          >
            <div slot="user" slot-scope="{text, record}">
              <a-avatar size="small" icon="user" :src="record.avatar"/>
              {{ record.username }}
            </div>
            <div slot="action" slot-scope="{ record}">
              <a style="margin-right: 8px" @click="permissionTransfer(record,2)">
                <a-icon type="disconnect"/>
                解除管理
              </a>
              <a-popconfirm
                  title="你确定要删除这个工作空间管理员吗"
                  ok-text="是"
                  cancel-text="不了"
                  @confirm="deleteMember(record)"
              >
                <a style="margin-right: 8px">
                  <a-icon type="delete"/>
                  删除
                </a>
              </a-popconfirm>
            </div>
          </standard-table>

        </a-tab-pane>
        <a-tab-pane key="2" tab="用户" force-render>
          <standard-table
              rowKey="userId"
              style="clear: both"
              :loading="member.loading"
              :columns="member.columns"
              :dataSource="member.dataSource"
          >
            <div slot="user" slot-scope="{text, record}">
              <a-avatar size="small" icon="user" :src="record.avatar"/>
              {{ record.username }}
            </div>
            <div slot="action" slot-scope="{ record}">
              <a style="margin-right: 8px" @click="permissionTransfer(record,1)">
                <a-icon type="shrink"/>
                设为管理
              </a>
              <a-popconfirm
                  title="你确定要删除这个工作空间成员吗"
                  ok-text="是"
                  cancel-text="不了"
                  @confirm="deleteMember(record)"
              >
                <a style="margin-right: 8px">
                  <a-icon type="delete"/>
                  删除
                </a>
              </a-popconfirm>
            </div>
          </standard-table>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <a-modal
        title="新增成员"
        :visible="addMember.visible"
        :confirm-loading="addMember.confirmLoading"
        :width="700"
        @ok="addMemberHandleOk"
        @cancel="addMemberHandleCancel">
      <a-alert
          message="温馨提示"
          description="请左侧搜索指定成员，点击确认时将绑定当前已选中成员到此工作工作空间"
          type="info"
      />
      <br>
      <a-transfer
          :data-source="addMember.dataSource"
          :titles="['可选', '当前已选中']"
          :target-keys="addMember.targetKeys"
          :disabled="addMember.disabled"
          :show-search="true"
          @search="handleSearch"
          :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          :show-select-all="false"
          :list-style="{
            width: '252px',
          }"
          @change="addMemberOnChange">
        <template
            slot="children"
            slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
        >
          <a-table
              :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          " :loading="direction === 'left' ?addMember.leftLoading:addMember.rightLoading"
              :columns="addMember.columns"
              :data-source="filteredItems"
              size="small"
              :style="{ pointerEvents: listDisabled ? 'none' : null }"
              :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })
          "
          >
            <div slot="user" slot-scope="{user,avatar}">
              <a-avatar size="small" icon="user" :src="avatar"/>
              {{ user }}
            </div>
          </a-table>
        </template>
      </a-transfer>
    </a-modal>


    <a-modal
        title="密钥设置"
        :visible="keySetting.visible"
        :confirm-loading="keySetting.confirmLoading"
        :width="700"
        @ok="keySettingHandleOk('editWorkspace')"
        @cancel="keySettingHandleCancel()">
      <template>
        <a-form-model ref="editWorkspace" :model="keySetting.form" :label-col="{span: 4}" :rules="keySetting.rules"
                      :wrapper-col="{span: 14}">
          <a-form-model-item label="账号" prop="accessKeyId">
            <a-input v-model="keySetting.form.accessKeyId">
              <a-icon slot="prefix" type="safety"></a-icon>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="密码" prop="accessKeySecret">
            <a-input v-model="keySetting.form.accessKeySecret" type="password">
              <a-icon slot="prefix" type="lock"/>
            </a-input>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'
import difference from 'lodash/difference';

//api
import {
  list,
  add,
  edit,
  deleteWorkspace,
  accessKey,
  updateAccessKey,
  selectWorkSpaceById,
  verifyWorkspaceCode
} from '@/services/workspace'
import {
  memberList,
  bindMember,
  optionalPersonnel,
  deleteMember,
  permissionTransferApi
} from '@/services/workspaceMember'
import {mapGetters} from "vuex";


const columns = [
  {
    title: '编号',
    dataIndex: 'id'
    , width: 80,
    sorter: true
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '编码',
    dataIndex: 'code',
  },
  {
    title: '管理员',
    scopedSlots: {customRender: 'workspaceAdminList'}
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '操作', fixed: 'right',
    scopedSlots: {customRender: 'action'}
  }
];


export default {
  name: "Workspace",
  components: {PageLayout, StandardTable},


  data() {
    return {
      keySetting: {
        visible: false,
        confirmLoading: false,
        form: {
          id: null,
          accessKeyId: null,
          accessKeySecret: null,
        },
        rules: {
          accessKeyId: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入工作空间账号",},
          accessKeySecret: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入工作空间密码",},
        }
      },
      edit: {
        visible: false,
        confirmLoading: false,
        //表单数据
        form: {
          id: null,
          name: "",
          code: "",
          description: ""
        },
      },
      add: {
        visible: false,
        confirmLoading: false,
        //表单数据
        form: {
          name: "",
          code: "",
          description: ""
        },
      },
      rules: {
        name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入空间名称",},
        code: {
          min: 1, trigger: ['blur'], asyncValidator: this.workspaceCodeValidator, required: true
        },
        description: {trigger: ['change', 'blur'], required: false, message: ""},
      },
      member: {
        loading: true,
        visible: false,
        confirmLoading: false,
        query: {
          orders: [
            {
              columnName: 'create_time',
              desc: true
            }
          ],
          page: {
            pageIndex: 1,
            pageSize: 10,
            total: 0
          },
          query: {
            workspaceId: '',
            userName: '',
            type: 1 //默认查询管理tob
          }
        },
        columns: [
          {
            title: '用户',
            scopedSlots: {customRender: 'user'}
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '操作', fixed: 'right',
            scopedSlots: {customRender: 'action'}
          }
        ],
        dataSource: []
      },
      columns: columns,
      dataSource: [],
      query: {
        orders: [
          {
            columnName: 'create_time',
            desc: true
          }
        ],
        page: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
        query: {
          code: '',
          name: ''
        }
      },
      form: this.$form.createForm(this),
      loading: true,
      visible: false,
      addMember: {
        query: {
          orders: [
            {
              columnName: 'create_time',
              desc: true
            }
          ],
          page: {
            pageIndex: 1,
            pageSize: 1000,
            total: 0
          },
          query: {
            username: '',
            workspaceId: null,
          }
        },
        leftLoading: false,
        rightLoading: false,
        visible: false,
        confirmLoading: false,
        dataSource: [],
        targetKeys: [],
        disabled: false,
        showSearch: false,
        columns: [
          {
            title: '用户',
            scopedSlots: {customRender: 'user'}
          },
          {
            dataIndex: 'email',
            title: '邮箱',
          }
        ],
      },
      confirmLoading: false,
    }

  }, watch: {
    query: {
      handler: function () {
        // console.log(val)
        // this.loadWorkspaceList()
      },
      deep: true
    },
  },
  created() {
    this.loadWorkspaceList()
  }, computed: {
    ...mapGetters('user', ['isAdmin'])
  }, mounted() {
  },
  methods: {
    workspaceCodeValidator(rule, value, callback) {
      if (this.edit.visible) {
        return false
      }
      if (value.length < 1) {
        callback(new Error('工作空间编码不能为空'));
      } else {
        verifyWorkspaceCode({code: value}).then(resp => {
          if (resp.data.code === 200) {
            if (resp.data.data) {
              callback()
            } else {
              callback(new Error('该工作空间编码已经存在！'));
            }
          } else {
            callback(new Error(resp.data.message));
          }
        })
      }
    },
    keySettingHandleOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.keySetting.confirmLoading = true;
          updateAccessKey(this.keySetting.form).then(res => {
            if (res.data.data) {
              this.$message.success("更新成功！");
              this.keySetting.visible = false;
            }
            this.keySetting.confirmLoading = false;
          })
        } else {
          console.log('error submit!!');
          this.keySetting.confirmLoading = false;
          return false;
        }
      });
    },
    keySettingHandleCancel() {
      this.keySetting.visible = false;
    },
    keySettingMethod(record) {
      // 回显数据 只有管理员以及空间管理员可以调用
      accessKey({param: record.code}).then(res => {
        if (res.data.data) {
          this.keySetting.form.id = res.data.data.id;
          this.keySetting.form.accessKeyId = res.data.data.accessKeyId;
          this.keySetting.form.accessKeySecret = res.data.data.accessKeySecret;
          this.keySetting.visible = true;
        }
      })
    },
    permissionTransfer(record, type) {
      permissionTransferApi({
        workspaceId: this.member.query.query.workspaceId,
        userId: record.userId,
        type: type,
      }).then(res => {
        if (res.data.data) {
          // 重新加载
          this.$message.success("更新成功！");
          this.queryMember();
        }
      })
    },
    resetForm() {
      this.query.query.name = this.query.query.code = ''
      this.loadWorkspaceList()
    },
    loadWorkspaceList() {
      this.loading = true
      const _this = this;
      list(this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
        this.loading = false
      })

    },
    handleSearch(dir, value) {
      if (dir === 'left') {
        this.addMember.query.query.username = value;
        // 有时间做个延迟事件，优化下
        this.addMemberLoadUserList(dir);
      }
    },
    submitForm() {
      this.loadWorkspaceList()
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    showAdd() {
      this.add.visible = true;
    },
    deleteWorkspace(record) {
      this.loading = true
      deleteWorkspace({id: record.id}).then(res => {
        if (res.data.data) {
          this.$message.success("删除成功！");
        }
      }).finally(() => this.loadWorkspaceList())
    },
    addHandleCancel(formName) {
      this.$refs[formName].resetFields();
      this.add.visible = false;
    },
    addHandleOk(formName) {
      const _this = this;
      this.add.visible = true;
      this.add.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          add(this.add.form).then(res => {
            if (res.data.data) {
              this.$message.success("添加成功！");
              _this.add.visible = false;
              _this.$refs[formName].resetFields();
              this.loadWorkspaceList();
            }
            _this.add.confirmLoading = false;
          })
        } else {
          console.log('error submit!!');
          _this.add.confirmLoading = false;
          return false;
        }
      });
    },
    editHandleOk(formName) {
      this.edit.visible = true;
      this.edit.confirmLoading = true;
      // update
      this.$refs[formName].validate(valid => {
        if (valid) {
          edit(this.edit.form).then(res => {
            if (res.data.data) {
              this.$message.success("修改成功！");
              this.edit.visible = false;
              this.$refs[formName].resetFields();
              this.loadWorkspaceList();
            }
            this.edit.confirmLoading = false;
          })
        } else {
          console.log('error submit!!');
          this.edit.confirmLoading = false;
          return false;
        }
      });
    },
    deleteMember(record) {
      deleteMember({
        userId: record.userId,
        workspaceId: this.member.query.query.workspaceId
      }).then(res => {
        if (res.data) {
          // 重新加载列表
          this.$message.success("删除成功！");
          this.queryMember();
        } else {
          this.$message.error("删除失败！");
        }
      })
    },
    editHandleCancel(formName) {
      this.edit.visible = false;
      this.$refs[formName].resetFields();
    },
    handleMenuClick() {

    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(pagination, filters, sorter, {currentDataSource}) {
      if (pagination) {
        this.query.page.pageIndex = pagination.current
        this.query.page.pageSize = pagination.pageSize
      }
      if (sorter) {
        this.query.orders[0].desc = (!sorter.order || sorter.order === 'ascend')
      }
      console.log(pagination, filters, sorter, currentDataSource)
      this.loadWorkspaceList()
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
    },
    showEdit(record) {
      this.loading = true
      selectWorkSpaceById(record).then(res => {
        const resp = res.data;
        if (resp.code === 200) {
          this.edit.visible = true;
          // 回显数据
          this.edit.form.id = resp.data.id;
          this.edit.form.code = resp.data.code;
          this.edit.form.name = resp.data.name;
          this.edit.form.description = resp.data.description;
        }
      }).finally(() => this.loading = false)
    },
    showMember(record) {
      this.member.visible = true;
      // this.addMember.query.query.workspaceId 筛选查询用户列表需要
      this.addMember.query.query.workspaceId = this.member.query.query.workspaceId = record.id;
      this.queryMember();
    },
    queryMember() {
      // 查询后端数据
      this.member.loading = true
      const _this = this.member;
      memberList(this.member.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
        this.member.loading = false
      })
    },
    showAddMember() {
      this.addMember.targetKeys = [];
      this.addMember.dataSource = [];
      this.addMember.query.query.username = '';
      // 查询用户列表
      this.addMemberLoadUserList('left');
      this.addMember.visible = true;
    },
    addMemberLoadUserList(dir) {
      const _this = this.addMember;
      if (_this.query.query.username === '') {
        //_this.dataSource = []
        return;
      }
      // 判断是否为左边的加载table
      if (dir === 'left') {
        this.addMember.leftLoading = true;
      } else {
        this.addMember.rightLoading = true;
      }
      optionalPersonnel(_this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          // 删除掉没有引用的
          let temp = [];
          _this.dataSource.forEach(f => {
            if (_this.targetKeys.indexOf(f.key) !== -1) {
              temp.push(f);
            }
          })
          _this.dataSource = temp;
          // 加载新的
          resp.data.rows.forEach(f => {
            let boo = false;
            _this.dataSource.forEach(fe => {
              if (fe.key === f.userId + '') {
                boo = true;
              }
            })
            if (!boo) {
              _this.dataSource.push({
                key: f.userId + '',
                title: f.username, // 搜索用
                user: f.username,
                email: f.email,
                avatar: f.avatar,
                disabled: false,
              })
            }
          });
          _this.query.page = resp.data.page
        }
        if (dir === 'left') {
          this.addMember.leftLoading = false;
        } else {
          this.addMember.rightLoading = false;
        }
      })
    },
    memberHandleOk(/*e*/) {
      this.loadWorkspaceList();
      this.member.confirmLoading = false;
      this.member.visible = false;
    },
    addMemberHandleOk(/*e*/) {

      this.addMember.confirmLoading = true;
      // 调用接口
      // this.addMember.targetKeys; 为已选择的用户id
      bindMember({
        workspaceId: this.member.query.query.workspaceId,
        userList: this.addMember.targetKeys
      }).then(res => {
        if (res.data) {
          this.$message.success("添加成功！");
          this.addMember.visible = false;
          // 添加成员后，重新加载 后期优化
          this.queryMember();
        } else {
          this.$message.error("添加失败！");
        }
        this.addMember.confirmLoading = false;
      })
    },
    memberHandleCancel(/*e*/) {
      this.member.visible = false;
      this.loadWorkspaceList();
    },
    addMemberHandleCancel(/*e*/) {
      console.log('Clicked cancel button');
      this.addMember.visible = false;
    },
    callback(key) {
      this.member.query.query.type = key;
      // 切换tob
      this.queryMember();
    },
    addMemberOnChange(nextTargetKeys) {
      this.addMember.targetKeys = nextTargetKeys;
    },
    triggerDisable(disabled) {
      this.disabled = disabled;
    },
    triggerShowSearch(showSearch) {
      this.showSearch = showSearch;
    },
    getRowSelection({disabled, selectedKeys, itemSelectAll, itemSelect}) {
      return {
        getCheckboxProps: item => ({props: {disabled: disabled || item.disabled}}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
              .filter(item => !item.disabled)
              .map(({key}) => key);
          const diffKeys = selected
              ? difference(treeSelectedKeys, selectedKeys)
              : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({key}, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  margin-bottom: 24px;
}

.admin-avatar {
  float: left;
  margin-top: -10px;
}

</style>
