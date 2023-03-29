<template>
  <page-layout>
    <a-card :bordered="false" class="search-form">
      <a-form ref="searchForm" :form="form" layout="inline">
        <a-form-item label="名称">
          <a-input v-model="query.query.name"/>
        </a-form-item>

        <a-form-item label="返回类型">
          <a-select v-model="query.query.valueType" style="width: 120px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="BOOLEAN">布尔</a-select-option>
            <a-select-option value="COLLECTION">集合</a-select-option>
            <a-select-option value="STRING">字符串</a-select-option>
            <a-select-option value="NUMBER">数值</a-select-option>
            <a-select-option value="DATE">日期</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="loadFunctionList()">
            搜索
          </a-button>
          <a-button style="margin-left: 10px" type="reset" @click="reset()">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card>
      <a-button @click="addFunctionForm" type="primary">新建</a-button>
      <standard-table
          :scroll="{ x: 1000 }"
          rowKey="id"
          :columns="tableData"
          :dataSource="dataSource"
          @change="onChange"
          :pagination="{showSizeChanger: true, showQuickJumper: true,
          pageSize: this.query.page.pageSize,
          total: this.query.page.total}"
      >
        <div slot="valueType" slot-scope="{record}">
          <a-tag color="cyan">{{ getValueTypeName(record.returnValueType) }}</a-tag>
        </div>

        <div slot="action" slot-scope="{record}">
          <a style="margin-right: 8px" @click="view(record)">
            <a-icon type="edit"/>
            查看
          </a>
          <a style="margin-right: 8px" @click="test(record)">
            <a-icon type="delete"/>
            测试
          </a>
        </div>
      </standard-table>
    </a-card>
    <!--      查看-->
    <a-modal
        title="函数详情"
        :visible="form.dialogFormVisible"
        :confirm-loading="form.confirmLoading"
        :width="700"
        @cancel="selectFunctionCancel()"
    >
      <a-form-model ref="selectFunction" :model="form" :label-col="{span: 4}" :wrapper-col="{span: 14}">
        <a-form-model-item label="名称" prop="name">
          <!--                    <input type="textbox" value="Some value" readonly="readonly"/>-->
          <a-input readOnly :value="form.data.name"/>
        </a-form-model-item>
        <a-form-model-item label="执行器" prop="executor">
          <a-input readOnly :value="form.data.executor"/>
        </a-form-model-item>
        <a-form-model-item label="参数" prop="paramsJson">
          <a-textarea :rows="5" readOnly :value="form.data.paramsJson"/>
        </a-form-model-item>
        <a-form-model-item label="返回类型" prop="returnValueType">
          <a-select readOnly :value="form.data.returnValueType" placeholder="返回类型">
            <a-select-option value="BOOLEAN">布尔</a-select-option>
            <a-select-option value="COLLECTION">集合</a-select-option>
            <a-select-option value="STRING">字符串</a-select-option>
            <a-select-option value="NUMBER">数值</a-select-option>
            <a-select-option value="DATE">日期</a-select-option>
            <a-select-option value="UNKNOWN">未知</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="description">
          <a-textarea readOnly :value="form.data.description" :rows="3"/>
        </a-form-model-item>
      </a-form-model>


      <div slot="footer" class="dialog-footer">
        <a-button @click="form.dialogFormVisible = false">关 闭</a-button>
      </div>
    </a-modal>


    <a-modal
        title="模拟运行"
        :visible="runTest.dialogFormVisible"
        :confirm-loading="runTest.confirmLoading"
        :width="700"
        @ok="run"
        @cancel="runTestHandleCancel"
        ok-text="运行" cancel-text="取消"
    >
      <a-form-model ref="selectFunction" :model="runTest.form" :label-col="{span: 4}" :wrapper-col="{span: 14}">
        <a-form-model-item label="名称" prop="name">
          <!--                    <input type="textbox" value="Some value" readonly="readonly"/>-->
          <a-input readOnly :value="runTest.form.name"/>
        </a-form-model-item>
        <a-form-model-item label="返回类型" prop="returnValueType">
          <a-select readOnly :value="runTest.form.returnValueType" placeholder="返回类型">
            <a-select-option value="BOOLEAN">布尔</a-select-option>
            <a-select-option value="COLLECTION">集合</a-select-option>
            <a-select-option value="STRING">字符串</a-select-option>
            <a-select-option value="NUMBER">数值</a-select-option>
            <a-select-option value="DATE">日期</a-select-option>
            <a-select-option value="UNKNOWN">未知</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="函数参数" v-if="runTest.form.paramValues.length!==0">
          <br>
          <a-form-model-item v-for="(pv) in runTest.form.paramValues" style="margin-bottom: 10px;" :key="pv.code">
            <a-row>
              <a-col :span="5">
                {{ pv.name !== null ? pv.name : pv.code }}&nbsp;
              </a-col>
              <a-col :span="5">
                <a-select readOnly :value="pv.valueType">
                  <a-select-option value="BOOLEAN">布尔</a-select-option>
                  <a-select-option value="COLLECTION">集合</a-select-option>
                  <a-select-option value="STRING">字符串</a-select-option>
                  <a-select-option value="NUMBER">数值</a-select-option>
                  <a-select-option value="DATE">日期</a-select-option>
                  <a-select-option value="UNKNOWN">未知</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="1">
              </a-col>
              <a-col :span="13">
                <a-select v-if="pv.valueType==='BOOLEAN'" v-model="pv.value" placeholder="请选择数据 ">
                  <a-select-option value="true">true</a-select-option>
                  <a-select-option value="false">false</a-select-option>
                </a-select>
                <a-input-number v-else-if="pv.valueType==='NUMBER'" v-model="pv.value" style="width: 100%"/>
                <a-date-picker v-else-if="pv.valueType==='DATE'" show-time style="width: 100%"/>
                <a-input v-else v-model="pv.value"></a-input>
              </a-col>
            </a-row>
          </a-form-model-item>
        </a-form-model-item>

        <a-form-model-item label="输出">
          <a-textarea readOnly :rows="2" :value="runTest.form.output"/>
        </a-form-model-item>

      </a-form-model>
    </a-modal>
  </page-layout>
</template>


<script>
import PageLayout from '@/layouts/PageLayout'
import StandardTable from '@/components/table/StandardTable'

import {functionList, selectFunctionById, runFunction} from '@/services/function'
import {getValueTypeName} from "@/utils/value-type";

const columns = [
  {
    title: '编号',
    dataIndex: 'id'
    , width: 80,
    sorter: true
  },
  {
    title: '名称',
    dataIndex: 'name'
    , width: 220
  },
  {
    title: '执行器',
    dataIndex: 'executor', width: 220
  },
  {
    title: '返回值类型',
    scopedSlots: {customRender: 'valueType'}, width: 80

  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    sorter: true
  },
  {
    title: '操作', fixed: 'right',
    scopedSlots: {customRender: 'action'}
  }
];

export default {
  name: "Function",
  components: {PageLayout, StandardTable},

  data() {
    return {
      form: {
        dialogFormVisible: false,
        confirmLoading: false,
        data: {
          name: '',
          returnValueType: '',
          description: '',
          executor: '',
          paramsJson: ''
        }
      },
      runTest: {
        dialogFormVisible: false,
        confirmLoading: false,
        form: {
          id: null,
          name: '',
          returnValueType: '',
          paramValues: [],
          output: null,
        }
      },
      tableData: columns,
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
          name: '',
          valueType: ''
        }
      },
    }
  },
  methods: {
    getValueTypeName(valueType) {
      return getValueTypeName(valueType)
    },
    //  列表
    loadFunctionList() {
      this.loading = true;
      const _this = this;
      functionList(this.query).then(res => {
        const resp = res.data;
        if (resp.code === 200) {
          _this.dataSource = resp.data.rows
          _this.query.page = resp.data.page
        } else {
          _this.dataSource = []
        }
      })
    },
    run() {
      this.runTest.confirmLoading = true
      runFunction({
        "id": this.runTest.form.id,
        "paramValues": this.runTest.form.paramValues
      }).then(res => {
        const resp = res.data;
        if (resp.data != null) {
          this.runTest.form.output = resp.data;
        } else {
          this.runTest.form.output = null;
        }
        this.runTest.confirmLoading = false
      })
    },
    //  翻页
    onChange(pagination) {
      if (pagination) {
        this.query.page.pageIndex = pagination.current
        this.query.page.pageSize = pagination.pageSize
      }
      this.loadFunctionList();
    },
    //  查看
    view(row) {
      this.form.confirmLoading = true
      selectFunctionById(row).then(res => {
        const resp = res.data;
        if (resp.code === 200) {
          this.form.data = resp.data;
          this.form.data.paramsJson = JSON.stringify(resp.data.params, null, 4);
          this.form.dialogFormVisible = true
        }
      })
    },
    test(row) {
      this.runTest.form.output = null;
      selectFunctionById(row).then(res => {
        const resp = res.data;
        if (resp.code === 200) {
          this.runTest.form.id = resp.data.id;
          this.runTest.form.returnValueType = resp.data.returnValueType;
          this.runTest.form.name = resp.data.name;
          this.runTest.form.paramValues = resp.data.params;
          this.runTest.dialogFormVisible = true
        }
      })
    },
    runTestHandleCancel() {
      this.runTest.dialogFormVisible = false
      this.runTest.confirmLoading = false
    },
    selectFunctionCancel() {
      this.form.dialogFormVisible = false
      this.form.confirmLoading = false
    },
    addFunctionForm() {
      alert("尽情期待");
    },
    reset() {
      this.query.query.name = ''
      this.loadFunctionList();
    },
  },
  mounted() {
    this.loadFunctionList();
  }
}
</script>

<style scoped>
.search-form {
  margin-bottom: 24px;
}

</style>
