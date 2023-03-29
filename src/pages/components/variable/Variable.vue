<template>
  <page-layout>
    <a-card :bordered="false" style="margin-bottom: 24px;">
      <a-form layout="inline">
        <a-form-model-item label="名称">
          <a-input
              v-model="query.query.name"/>
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
      <a-button @click="createVariable" type="primary">新建</a-button>
      <standard-table
          :scroll="{ x: 1000 }"
          :loading="loading"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          @change="onPageChange"
          :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="valueType" slot-scope="{record}">
          <a-tag color="cyan">
            ({{ getValueTypeName(record.valueType) }})
          </a-tag>
        </div>

        <div slot="value" slot-scope="{record}">
          <a-tag color="cyan" v-if="record.type === 3">
            函数({{ record.functionName }})
          </a-tag>
          <a-tag color="cyan" v-else-if="record.type === 4">
            表达式({{ record.value }})
          </a-tag>
          <span v-else>{{ record.value }}</span>
        </div>

        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="editVariable(record.id)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a-popconfirm
              title="你确定要删除这个变量吗"
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


    <!--   新建变量-->
    <a-modal
        :title="add.form.id!==undefined?'更新变量':'新建变量'"
        :visible="add.visible"
        :getPopupContainer="triggerNode=>{return triggerNode.parentNode}"
        :confirm-loading="add.confirmLoading"
        :width="700"
        @ok="handleAddOk('addVariableForm')"
        @cancel="handleAddCancel('addVariableForm')">
      <template>

        <div v-if="add.form.id!==undefined">
          <a-alert type="info" show-icon
                   message="变量修改会影响线上所有引用此变量的规则运行，并且规则内所有版本共享同一个变量"
          />
          <br>
        </div>

        <a-form-model ref="addVariableForm" :model="add.form" :label-col="{span: 4}"
                      :wrapper-col="{span: 16}">
          <a-form-model-item label="变量名称" prop="name" has-feedback :rules="{
                                        required: true,
                                        asyncValidator:this.variableNameValidator,
                                        trigger: ['blur'],
                                      }">
            <a-input v-model="add.form.name" placeholder="请输入变量名称"/>
          </a-form-model-item>

          <a-form-model-item label="变量类型" prop="type"
                             :rules="{
                                        required: true,
                                        message: '请输入变量类型',
                                        trigger: ['change', 'blur'],
                                      }">
            <a-select :disabled="add.form.id!==undefined"
                      v-model="add.form.type"
                      @change="variableChangeValueType"
                      placeholder="请输入变量类型">
              <a-select-option :value="3">函数</a-select-option>
              <a-select-option :value="4">表达式</a-select-option>
              <a-select-option :value="2">固定值</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="值类型" prop="type"
                             v-if="add.form.type===4||add.form.type===2"
                             :rules="{
                                        required: true,
                                        message: '请输入变量类型',
                                        trigger: ['change', 'blur'],
                                      }">
            <a-select :disabled="add.form.id!==undefined"
                      @change="variableChangeValueType"
                      v-model="add.form.valueType"
                      placeholder="请选择类型">
              <a-select-option value="BOOLEAN">布尔</a-select-option>
              <a-select-option value="COLLECTION">集合</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="NUMBER">数值</a-select-option>
              <a-select-option value="DATE">日期</a-select-option>
            </a-select>
          </a-form-model-item>


          <a-form-model-item label="函数名称" prop="function.name" v-if="add.form.type===3"
                             :rules="{
                                        required: true,
                                        message: '请输入函数',
                                        trigger: ['change', 'blur'],
                                      }">
            <a-select
                show-search
                :disabled="add.form.id!==undefined"
                :value="add.form.function.name"
                placeholder="请输入关键字进行搜索"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="functionSearch"
            >
              <a-select-option v-for="d in add.form.searchSelect.data" :value="d.id"
                               :key="d.id"
                               @click.native="functionSearchOptionClick(d)">
                {{ d.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="函数参数"
                             required
                             prop="function.paramValues"
                             v-if="add.form.type===3&&add.form.function.paramValues.length!==0">
            <br>

            <a-form-model-item v-for="(pv,pvi) in add.form.function.paramValues"
                               style="margin-bottom: 10px;"
                               :key="pv.code">
              <a-row>
                <a-col :span="5">
                  {{ pv.name !== null ? pv.name : pv.code }}&nbsp;
                </a-col>
                <a-col :span="5">
                  <a-form-model-item style="margin-bottom: 10px;">
                    <a-select
                        :value="valueType(pv)"
                        @change="(valueType)=>{functionParamValueTypeChange(valueType,pv)}"
                    >
                      <a-select-option value="PARAMETER">参数</a-select-option>
                      <a-select-option value="VARIABLE">变量</a-select-option>
                      <a-select-option value="BOOLEAN" v-if="pv.valueType==='BOOLEAN'">布尔
                      </a-select-option>
                      <a-select-option value="COLLECTION" v-if="pv.valueType==='COLLECTION'">集合
                      </a-select-option>
                      <a-select-option value="STRING" v-if="pv.valueType==='STRING'">字符串
                      </a-select-option>
                      <a-select-option value="NUMBER" v-if="pv.valueType==='NUMBER'">数值
                      </a-select-option>
                      <a-select-option value="DATE" v-if="pv.valueType==='DATE'">日期
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="1">
                </a-col>
                <a-col :span="13">
                  <a-form-model-item style="margin-bottom: 10px;"
                                     :prop="`function.paramValues.${pvi}.value`"
                                     :rules="{
                                        required: true,
                                        message: `${pv.name}参数不能为空`,
                                        trigger: ['change', 'blur'],
                                      }">
                    <a-select
                        v-if="pv.type===0||pv.type===1||pv.type===4"
                        show-search
                        :value="pv.valueName"
                        placeholder="请输入关键字进行搜索"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="(value)=>{functionParamSearch(value,pv)}"
                    >
                      <a-select-option v-for="d in pv.searchSelect.data" :value="d.id"
                                       :key="d.id"
                                       @click.native="functionParamSearchOptionClick(d,pv)">
                        {{ d.name }}
                      </a-select-option>
                    </a-select>

                    <a-select v-else-if="pv.valueType==='BOOLEAN'"
                              v-model="pv.value" placeholder="请选择数据 ">
                      <a-select-option value="true">true</a-select-option>
                      <a-select-option value="false">false</a-select-option>
                    </a-select>
                    <a-input-number v-else-if="pv.valueType==='NUMBER'"
                                    v-model="pv.value" style="width: 100%"/>
                    <a-date-picker v-else-if="pv.valueType==='DATE'"
                                   show-time style="width: 100%"/>
                    <a-input v-else v-model="pv.value"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model-item>

          </a-form-model-item>

          <a-form-model-item label="表达式值" v-if="add.form.type===4" prop="value" :rules="{
                                        required: true,
                                        message: '请输入表达式值',
                                        trigger: ['change', 'blur'],
                                      }">
            <a-input v-model="add.form.value" type="textarea" placeholder="表达式值"/>
          </a-form-model-item>

          <a-form-model-item label="变量值" v-else-if="add.form.type===2" prop="value" :rules="{
                                        required: true,
                                        message: '请输入变量值',
                                        trigger: ['change', 'blur'],
                                      }">
            <a-input-number v-model="add.form.value" placeholder="请输入变量值" style="width: 100%"
                            v-if="add.form.valueType==='NUMBER'"/>

            <a-select v-model="add.form.value" placeholder="选择值" v-else-if="add.form.valueType==='BOOLEAN'">
              <a-select-option value="true">true</a-select-option>
              <a-select-option value="false">false</a-select-option>
            </a-select>

            <a-date-picker
                v-else-if="add.form.valueType==='DATE'"
                v-model="add.form.value"
                @change="(date,dateString)=>(datePickerChange(add.form,date,dateString))"
                format="YYYY-MM-DD hh:mm:ss"
                show-time
                style="width: 100%"></a-date-picker>

            <a-input v-model="add.form.value" type="textarea" placeholder="变量值"
                     v-else-if="add.form.valueType==='COLLECTION'"/>
            <a-input v-model="add.form.value" placeholder="请输入变量值" disabled
                     v-else/>
          </a-form-model-item>

          <a-form-model-item label="变量值描述" has-feedback prop="description">
            <a-input v-model="add.form.description" type="textarea" placeholder="请输入描述"/>
          </a-form-model-item>

        </a-form-model>
      </template>
    </a-modal>
  </page-layout>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import {addVariable, listVariable, updateVariable, get, deleteById, verifyVariableName} from "@/services/variable";
import {getValueTypeName, valueType} from '@/utils/value-type'
import {selectSearch} from '@/utils/selectSearch'
import moment from "moment";
import {setDefaultValue} from '@/utils/json'
import PageLayout from '@/layouts/PageLayout'

export default {
  name: "Variable",
  components: {StandardTable, PageLayout},
  data() {
    return {
      add: {
        id: null,
        visible: false,
        confirmLoading: false,
        date: undefined,
        //表单数据
        form: {
          id: undefined,
          value: undefined,
          name: undefined,
          type: undefined,
          description: undefined,
          valueType: undefined,
          dataType: this.dataType,
          function: {
            returnValueType: null,
            name: undefined,
            paramValues: []
          },
          searchSelect: {
            data: [],
            value: undefined,
          }
        },
      },
      loading: true,
      columns: [
        {
          title: '编号',
          dataIndex: 'id'
          , width: 80,
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'name'
          , width: 180
        },
        {
          title: '值',
          scopedSlots: {customRender: 'value'}
        },
        {
          title: '值类型',
          dataIndex: 'valueType',
          scopedSlots: {customRender: 'valueType'}
          , width: 120
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 180,
          sorter: true
        },
        {
          title: '操作', fixed: 'right',
          key: 'operation',
          scopedSlots: {customRender: 'action'}
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
          name: null,
          valueType: null
        }
      },
    }
  },
  created() {
    this.loadVariableList();
  },
  methods: {
    valueType(v) {
      return valueType(v);
    },
    variableNameValidator(rule, value, callback) {
      if (this.add.form.id && this.add.form.orgName === this.add.form.name) {
        callback();
        return false
      }
      if (value.length < 1 || value.length > 25) {
        callback(new Error('变量名称长度在 1 到 25 个字符'));
      } else {
        verifyVariableName(this.add.form).then(resp => {
          if (resp.data.code === 200) {
            if (!resp.data.data) {
              callback()
            } else {
              callback(new Error('该变量名称已经存在！'));
            }
          } else {
            callback(new Error(resp.data.message));
          }
        })
      }
    },
    datePickerChange(v, date) {
      v.value = moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    createVariable() {
      // 重置表单数据 修复bug
      this.add.form = setDefaultValue(this.add.form);
      this.add.form.function.paramValues = [];
      let $ref = this.$refs['addVariableForm'];
      if ($ref) {
        $ref.resetFields();
      }
      this.add.visible = true;
    },
    functionParamValueTypeChange(valueType, pv) {
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        pv.type = 0;
      } else if (valueType === 'VARIABLE') {
        pv.type = 1;
      } else {
        pv.type = 2;
      }
    },
    variableChangeValueType() {
      this.add.form.value = undefined;
    },
    getValueTypeName(valueType) {
      return getValueTypeName(valueType)
    },
    functionSearch(value) {
      selectSearch({
            name: value,
            valueType: null // 查询所有类型
          }, data => (this.add.form.searchSelect.data = data)
          , this.add.form.type)
    },
    functionSearchOptionClick(d) {
      this.add.form.searchSelect.value = d.id;
      this.add.form.value = d.id;
      this.add.form.function.name = d.name;
      this.add.form.valueType = d.returnValueType;
      this.add.form.function.returnValueType = d.returnValueType;
      this.add.form.function.paramValues = this.getParamValues(d.params);
    },
    functionParamSearch(value, pv) {
      selectSearch({
            name: value,
            valueType: [pv.valueType]
          }, data => (pv.searchSelect.data = data)
          , pv.type)
    },
    functionParamSearchOptionClick(d, pv) {
      //this.add.form.function.name = d.name;
      pv.value = d.id;
      pv.valueType = d.valueType;
      pv.valueName = d.name;
      // 变量  d.type 如果是固定值
      if (pv.type === 1 && d.type === 2) {
        pv.variableValue = d.value;
      }
    },
    getParamValues(paramValues) {
      return Array.from(paramValues)
          .map(item => ({
            // 搜索用元素变量用
            searchSelect: {
              data: [],
              value: undefined,
            },
            // ...
            name: item.name,
            code: item.code,
            type: (item.type == null ? 2 : item.type), //默认固定值
            value: item.value,
            valueName: item.valueName,
            valueType: item.valueType,
          }));
    },
    handleAddOk(formName) {
      const _this = this;
      this.add.visible = true;
      this.add.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.add.form.id !== undefined) {
            updateVariable(this.add.form).then(res => {
              if (res.data.code === 200) {
                this.$message.success("更新成功！");
                _this.add.visible = false;
                _this.$refs[formName].resetFields();
                _this.loadVariableList();
              }
            }).finally(() => _this.add.confirmLoading = false)
          } else {
            addVariable(this.add.form).then(res => {
              if (res.data.code === 200) {
                this.$message.success("添加成功！");
                _this.add.visible = false;
                _this.$refs[formName].resetFields();
                _this.loadVariableList();
              }
            }).finally(() => _this.add.confirmLoading = false)
          }
        } else {
          console.log('error submit!!');
          _this.add.confirmLoading = false;
          return false;
        }
      });
    },
    handleAddCancel() {
      this.add.visible = false
    },
    onPageChange(pagination, filters, sorter, {currentDataSource}) {
      if (pagination) {
        this.query.page.pageIndex = pagination.current;
        this.query.page.pageSize = pagination.pageSize
      }
      if (sorter) {
        this.query.orders[0].desc = (!sorter.order || sorter.order === 'ascend')
      }
      console.log(pagination, filters, sorter, currentDataSource)
      this.loadVariableList()
    },
    submitSearch() {
      this.loadVariableList()
    },
    resetForm() {
      this.query.query.name = this.query.query.code = ''
      this.loadVariableList()
    },
    editVariable(id) {
      // 重置表单数据
      this.add.form = setDefaultValue(this.add.form);
      let _this = this
      get({id: id}).then(res => {
        if (res.data.code === 200) {
          let da = res.data.data;
          this.add.form.id = da.id;
          this.add.form.name = this.add.form.orgName = da.name;
          this.add.form.value = da.value;
          this.add.form.type = da.type;
          this.add.form.valueType = da.valueType;
          this.add.form.description = da.description;
          if (da.function != null) {
            this.add.form.function.paramValues = this.getParamValues(da.function.paramValues);
            this.add.form.function.name = da.function.name;
          }
          _this.add.visible = true
        }
      })
    },
    deleteById(id) {
      let _this = this
      deleteById({id: id}).then(res => {
        if (res.data.code === 200) {
          _this.loadVariableList()
        }
      })
    },
    loadVariableList() {
      this.loading = true
      const _this = this;
      if (this.query.query.valueType && this.query.query.valueType !== "") {
        this.query.query.valueType = [this.query.query.valueType];
      }
      listVariable(this.query).then(res => {
        const resp = res.data;
        if (resp.data) {
          _this.dataSource = resp.data.rows
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
