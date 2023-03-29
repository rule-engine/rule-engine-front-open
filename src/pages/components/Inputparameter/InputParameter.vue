<template>
  <page-layout>
    <a-card :bordered="false" style="margin-bottom: 24px;">
      <a-form layout="inline">
        <a-form-model-item label="名称">
          <a-input
              v-model="query.query.name"/>
        </a-form-model-item>
        <a-form-model-item label="编码">
          <a-input
              v-model="query.query.code"/>
        </a-form-model-item>

        <a-form-item label="返回类型" placeholder="请选择">
          <a-select v-model="query.query.valueType" style="width: 120px">
            <a-select-option :value="null">全部</a-select-option>
            <a-select-option value="BOOLEAN">布尔</a-select-option>
            <a-select-option value="COLLECTION">集合</a-select-option>
            <a-select-option value="STRING">字符串</a-select-option>
            <a-select-option value="NUMBER">数值</a-select-option>
            <a-select-option value="DATE">日期</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-model-item>
          <a-button type="primary" @click="submitSearch()">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
            重置
          </a-button>
        </a-form-model-item>
      </a-form>
    </a-card>

    <a-card>
      <a-button @click="add.visible=true" type="primary">新建</a-button>
      <standard-table
          :scroll="{ x: 900 }"
          :loading="loading"
          rowKey="id"
          style="clear: both"
          :columns="columns"
          :dataSource="dataSource"
          @change="onPageChange"
          :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="valueType" slot-scope="{record}">
          <a-tag color="cyan">{{ getValueTypeName(record.valueType) }}</a-tag>
        </div>

        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="info(record.id)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-popconfirm
              title="你确定要删除这个参数吗"
              ok-text="是"
              cancel-text="不了"
              @confirm="deleteById(record.id)"
          >
            <a>
              <a-icon type="delete"/>
              删除
            </a>
          </a-popconfirm>

        </div>
      </standard-table>
    </a-card>
    <!--   新建参数-->
    <a-modal
        title="新建参数"
        :visible="add.visible"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="handleAddOk('addInputParameter')"
        @cancel="handleAddCancel('addInputParameter')">
      <template>
        <a-form-model ref="addInputParameter" :model="add.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 16}">
          <a-form-model-item label="参数名称" has-feedback prop="name">
            <a-input v-model="add.form.name" placeholder="请输入参数名称"/>
          </a-form-model-item>
          <a-form-model-item label="参数编码" has-feedback prop="code">
            <a-input v-model="add.form.code" placeholder="请输入参数编码"/>
          </a-form-model-item>
          <a-form-model-item label="参数值类型" prop="valueType">
            <a-select v-model="add.form.valueType" placeholder="参数值类型">
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="参数值描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>
    <!--   编辑参数-->
    <a-modal
        title="编辑参数"
        :visible="update.visible"
        :confirm-loading="update.confirmLoading"
        :width="700"
        @ok="handleUpdateOk('updateInputParameter')"
        @cancel="handleUpdateCancel('updateInputParameter')">
      <template>
        <a-form-model ref="updateInputParameter" :model="update.form" :rules="rules" :label-col="{span: 4}"
                      :wrapper-col="{span: 16}">
          <a-form-model-item label="参数名称" has-feedback prop="name">
            <a-input v-model="update.form.name" placeholder="请输入参数名称"/>
          </a-form-model-item>
          <a-form-model-item label="参数编码" has-feedback prop="code">
            <a-input v-model="update.form.code" placeholder="请输入参数编码" disabled/>
          </a-form-model-item>
          <a-form-model-item label="参数值类型" prop="valueType">
            <a-select v-model="update.form.valueType" placeholder="参数值类型" disabled>
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="参数值描述" has-feedback prop="description">
            <a-input v-model="update.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-modal>

  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'

import StandardTable from "@/components/table/StandardTable";
import {
  addInputParameter,
  listInputParameter,
  update,
  get,
  deleteById,
  verifyInputParameterCode
} from "@/services/inputParameter";
import {getValueTypeName} from "@/utils/value-type";

export default {
  name: "InputParameter",
  components: {StandardTable, PageLayout},
  data() {
    return {
      add: {
        visible: false,
        confirmLoading: false,
        //表单数据
        form: {
          name: "",
          code: "",
          description: "",
          valueType: undefined,
        },
      }
      , update: {
        visible: false,
        confirmLoading: false,
        //表单数据
        form: {
          id: "",
          name: "",
          code: "",
          description: "",
          valueType: undefined,
        },
      },
      rules: {
        name: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入参数名称"},
        code: {
          min: 1,
          max: 25,
          trigger: ['blur'],
          asyncValidator: this.inputParameterCodeValidator,
          required: true
        },
        description: {trigger: ['change', 'blur'], required: false, message: ""},
        valueType: {trigger: ['change', 'blur'], required: true, message: "请选择参数值类型"}
      },
      loading: true,
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          width: 80,
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'name', width: 180
        },
        {
          title: '编码',
          dataIndex: 'code', width: 180
        },
        {
          title: '值类型',
          dataIndex: 'valueType',
          scopedSlots: {customRender: 'valueType'},
          width: 80
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
        },
        {
          title: '操作', fixed: 'right',
          key: 'operation',
          scopedSlots: {customRender: 'action'},
        },
      ],
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
          code: null,
          name: null,
          valueType: null
        }
      },
    }
  },
  created() {
    this.loadInputParameterList()
  },
  methods: {
    inputParameterCodeValidator(rule, value, callback) {
      if (this.update.visible) {
        callback();
        return false
      }
      if (value.length < 1 || value.length > 25) {
        callback(new Error('规则参数Code长度在 1 到 25 个字符'));
      } else {
        if (!/^[a-zA-Z][a-zA-Z0-9_&#-]*$/.test(value)) {
          callback(new Error('规则参数Code只能字母开头，以及字母数字_&#-组成'));
          return false
        }
        verifyInputParameterCode(this.add.form).then(resp => {
          if (resp.data.code === 200) {
            if (!resp.data.data) {
              callback()
            } else {
              callback(new Error('该参数编码已经存在！'));
            }
          } else {
            callback(new Error(resp.data.message));
          }
        })
      }
    },
    getValueTypeName(valueType) {
      return getValueTypeName(valueType)
    },
    handleAddOk(formName) {
      const _this = this;
      this.add.visible = true;
      this.add.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          addInputParameter(this.add.form).then(res => {
            if (res.data.code === 200) {
              this.$message.success("添加成功！");
              _this.add.visible = false;
              _this.$refs[formName].resetFields();
              _this.loadInputParameterList();
            }
          }).finally(() => _this.add.confirmLoading = false)
        } else {
          console.log('error submit!!');
          _this.add.confirmLoading = false;
          return false;
        }
      });
    },
    handleAddCancel(formName) {
      this.$refs[formName].resetFields();
      this.add.visible = false
    },
    handleUpdateOk(formName) {
      const _this = this;
      this.update.visible = true;
      this.update.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          update(this.update.form).then(res => {
            if (res.data.code === 200) {
              this.$message.success("修改成功！");
              _this.update.visible = false;
              _this.$refs[formName].resetFields();
              _this.loadInputParameterList();
            }
          }).finally(() => _this.update.confirmLoading = false)
        } else {
          console.log('error submit!!');
          _this.update.confirmLoading = false;
          return false;
        }
      });
    },
    handleUpdateCancel(formName) {
      this.$refs[formName].resetFields();
      this.update.visible = false
    },
    onPageChange(pagination, filters, sorter, {currentDataSource}) {
      if (pagination) {
        this.query.page.pageIndex = pagination.current
        this.query.page.pageSize = pagination.pageSize
      }
      if (sorter) {
        this.query.orders[0].desc = (!sorter.order || sorter.order === 'ascend')
      }
      console.log(pagination, filters, sorter, currentDataSource)
      this.loadInputParameterList()
    },
    submitSearch() {
      this.loadInputParameterList()
    },
    resetForm() {
      this.query.query.name = this.query.query.code = ''
      this.loadInputParameterList()
    },
    info(id) {
      let _this = this
      get({id: id}).then(res => {
        if (res.data.code === 200) {
          _this.update.form = res.data.data
          _this.update.visible = true
        }

      })
    },
    deleteById(id) {
      let _this = this
      deleteById({id: id}).then(res => {
        if (res.data.code === 200) {
          _this.loadInputParameterList()
        }
      })
    },
    loadInputParameterList() {
      this.loading = true
      const _this = this;
      if (this.query.query.valueType && this.query.query.valueType !== "") {
        this.query.query.valueType = [this.query.query.valueType];
      }
      listInputParameter(this.query).then(res => {
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
  }
}
</script>

<style scoped>

</style>
