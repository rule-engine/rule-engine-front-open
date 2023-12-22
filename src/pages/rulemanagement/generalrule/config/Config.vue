<template>
  <div>
    <page-layout>

      <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect"/>

      <a-card title="规则配置" :bordered="false" @contextmenu="onContextmenu">
        <span slot="extra" style="margin-left: 16px;">
                    <a-popover title="当前编辑人员" trigger="click" arrow-point-at-center>
                        <template slot="content">
                        <a-list item-layout="horizontal" :data-source="[{
    title: '张三',
  },
  {
    title: '李四',
  }]">
                          <a-list-item slot="renderItem" slot-scope="item">
                            <a-list-item-meta
                                description="我新增了一个条件组（最后一次操作记录）"
                            >
                              <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
                              <a-avatar
                                  slot="avatar"
                                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                              />
                            </a-list-item-meta>
                          </a-list-item>
                        </a-list>
                        </template>
                          <a-icon type="usergroup-add"
                                  style="font-size: 18px"/>
                    </a-popover>
        </span>
        <vue-scroll :ops="ops" style="width:100%;height:100%">
          <a-row :style="isMobile?'width:1000px;margin: 0 auto':''">
            <a-col :span="1"/>
            <a-col :span="22">
              <a-card title="条件集" class="condition_set" size="small">

                <a-skeleton v-if="generalRule.conditionGroup.length===0" :paragraph="{ rows: 3 }"/>
                <a-spin :spinning="conditionMoveLoading">

                  <task-group title="条件集" :group="generalRule.ruleId"
                              handle=".mover"
                              :rule-id="generalRule.ruleId"
                              :loading.sync="conditionMoveLoading"
                              :data-list="generalRule.conditionGroup">
                    <a-card :bordered="false" size="small"
                            v-for="(cg,cgi) in generalRule.conditionGroup"
                            :key="cg.id">

                      <div slot="title" style="margin-right: 16px;padding-left: 2px;">
                        <a-input class="conditionGroupNameInput"
                                 style="padding: 0;border: none;background: none;"
                                 @blur="updateConditionGroupName(cg)"
                                 :placeholder="`条件组${cgi}`" v-model="cg.name"/>
                      </div>

                      <a-icon type="drag" class="dynamic-delete-button mover"
                              style="font-size: 18px;margin-right: 10px;"
                              slot="extra"/>

                      <a-icon type="delete" class="dynamic-delete-button" style="font-size: 18px"
                              slot="extra"
                              @click="deleteConditionGroup(cg)"/>

                      <a-skeleton v-if="cg.conditionGroupCondition.length===0"
                                  :paragraph="{ rows: 2 }"/>
                      <task-group :title="cg.name" :group="cg.id"
                                  :data-list="generalRule.conditionGroup"
                                  :id="cg.id"
                                  :loading.sync="conditionMoveLoading">
                        <a-alert closable
                                 style="border:none;padding: 6px 30px 6px 6px;margin-bottom: 10px"
                                 v-for="cgc in cg.conditionGroupCondition"
                                 :key="cgc.id"
                                 @dblclick.native="$refs.modal.editCondition(cg,cgc)"
                                 @close="deleteCondition(cg.conditionGroupCondition,cgc.id,cgc.condition.id)"
                                 class="conditionItem task-item">
                          <p slot="description" style="margin-bottom: 0;">
                            <a-tag color="blue"
                                   style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                              （{{ cgc.condition.name }}）
                            </a-tag>
                            <a-tag color="cyan"
                                   style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                              {{
                                getTypeName(cgc.condition.config.leftValue)
                              }}
                            </a-tag>
                            {{ getViewValue(cgc.condition.config.leftValue) }}
                            &nbsp;
                            <a-tag color="orange"
                                   style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                              {{ getSymbolExplanation(cgc.condition.config.symbol) }}
                            </a-tag>
                            <a-tag color="cyan"
                                   style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                              {{
                                getTypeName(cgc.condition.config.rightValue)
                              }}
                            </a-tag>
                            {{ getViewValue(cgc.condition.config.rightValue) }}
                          </p>
                        </a-alert>
                      </task-group>


                      <br>

                      <a-button type="dashed" style="width: 50%;display:block;margin:0 auto"
                                @click="$refs.modal.addCondition(cg)">
                        <a-icon type="plus" style="color: #777;"/>
                        添加条件
                      </a-button>
                    </a-card>
                  </task-group>
                </a-spin>
                <a-button type="dashed" style="width: 100%" @click="addConditionGroup()">
                  <a-icon type="plus" style="color: #777;"/>
                  添加条件组
                </a-button>
              </a-card>
              <br>
              <br>


              <a-form-model ref="generalRuleForm" :model="generalRule">
                <a-card title="结果" size="small">
                <span slot="extra">
                          <a-popover title="温馨提示">
                              <template slot="content">
                                  <p>普通规则结果类型确认后，及规则发布后，则不支持修改！</p>
                                  <p>（具体原因可参考链接：T320523）</p>
                              </template>
                              <a-icon type="info-circle" class="dynamic-delete-button" style="font-size: 18px"/>
                          </a-popover>
                      </span>
                  <a-row>
                    <a-col :span="5">
                      <a-form-model-item prop="action.type"
                                         style="margin-bottom: 0;"
                                         :rules="{
                                          required: true,
                                          message: '请选择结果类型',
                                          trigger: ['change', 'blur'],
                                        }">
                        <a-select style="width:100%"
                                  :disabled="generalRule.publishVersion!==null"
                                  placeholder="请选择结果类型"
                                  :value="valueType(generalRule.action)"
                                  @change="actionValueTypeChange">
                          <a-select-option value="PARAMETER">参数</a-select-option>
                          <a-select-option value="VARIABLE">变量</a-select-option>
                          <a-select-option value="BOOLEAN">布尔</a-select-option>
                          <a-select-option value="COLLECTION">集合</a-select-option>
                          <a-select-option value="STRING">字符串</a-select-option>
                          <a-select-option value="NUMBER">数值</a-select-option>
                          <a-select-option value="DATE">日期</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="1"></a-col>
                    <a-col :span="18">
                      <a-form-model-item prop="action.value"
                                         style="margin-bottom: 0;"
                                         :rules="{
                                          required: true,
                                          message: '请输入结果值',
                                          trigger: ['change', 'blur'],
                                        }">
                        <a-select
                            v-if="generalRule.action.type===0||generalRule.action.type===1||generalRule.action.type===4"
                            show-search
                            :disabled="generalRule.action.type==null"
                            :value="generalRule.action.valueName"
                            placeholder="请输入关键字进行搜索"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="actionSearch"
                        >
                          <a-select-option v-for="d in actionSearchSelect.data" :value="d.id"
                                           :key="d.id"
                                           @click.native="actionSearchOptionClick(d)">
                            {{ d.name }}
                          </a-select-option>
                        </a-select>

                        <a-select
                            :disabled="!generalRule.action.type"
                            v-else-if="generalRule.action.valueType==='BOOLEAN'"
                            defaultValue="true"
                            @blur="saveAction"
                            style="width: 100%"
                            v-model="generalRule.action.value" placeholder="请选择数据">
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                        <a-input-number
                            :disabled="!generalRule.action.type"
                            @blur="saveAction"
                            v-else-if="generalRule.action.valueType==='NUMBER'"
                            v-model="generalRule.action.value" style="width: 100%"/>
                        <a-date-picker
                                :disabled="!generalRule.action.type"
                                @openChange="actionValueDatePickerOpenChange"
                                v-else-if="generalRule.action.valueType==='DATE'"
                                show-time
                                @change="(date,dateString)=>(datePickerChange(generalRule.action,date,dateString))"
                                format="YYYY-MM-DD hh:mm:ss"
                                v-model="generalRule.action.value"
                                style="width: 100%"/>
                        <a-input v-else
                                 :disabled="!generalRule.action.type"
                                 @blur="saveAction"
                                 v-model="generalRule.action.value"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>

                </a-card>

                <br>

                <a-card title="默认结果" size="small">
                  <a-switch
                      :disabled="generalRule.action.valueType==null"
                      @change="enableDefaultActionChange"
                      :checked="generalRule.defaultAction.enableDefaultAction===0"/>
                  <br> <br>
                  <a-row>
                    <a-col :span="5">
                      <a-form-model-item prop="defaultAction.type"
                                         style="margin-bottom: 0;"
                                         :rules="generalRule.defaultAction.enableDefaultAction===0?{
                                          required: true,
                                          message: '请选择默认结果类型',
                                          trigger: ['change', 'blur'],
                                        }:{required:false}">
                        <a-select style="width:100%"
                                  :disabled="generalRule.action.valueType==null||generalRule.publishVersion!==null"
                                  placeholder="请选择类型"
                                  :value="valueType(generalRule.defaultAction)"
                                  @change="defaultActionValueTypeChange"
                        >
                          <a-select-option value="PARAMETER">参数</a-select-option>
                          <a-select-option value="VARIABLE">变量</a-select-option>
                          <a-select-option value="BOOLEAN"
                                           v-if="generalRule.action.valueType==='BOOLEAN'">布尔
                          </a-select-option>
                          <a-select-option value="COLLECTION"
                                           v-if="generalRule.action.valueType==='COLLECTION'">
                            集合
                          </a-select-option>
                          <a-select-option value="STRING"
                                           v-if="generalRule.action.valueType==='STRING'">字符串
                          </a-select-option>
                          <a-select-option value="NUMBER"
                                           v-if="generalRule.action.valueType==='NUMBER'">数值
                          </a-select-option>
                          <a-select-option value="DATE"
                                           v-if="generalRule.action.valueType==='DATE'">日期
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="1"></a-col>
                    <a-col :span="18">
                      <a-form-model-item prop="defaultAction.value"
                                         style="margin-bottom: 0;"
                                         :rules="generalRule.defaultAction.enableDefaultAction===0?{
                                          required: true,
                                          message: '请输入默认结果值',
                                          trigger: ['change', 'blur'],
                                        }:{required:false}">
                        <a-select
                            v-if="generalRule.defaultAction.type===0||generalRule.defaultAction.type===1||generalRule.defaultAction.type===4"
                            show-search
                            style="width: 100%"
                            :disabled="generalRule.defaultAction.type==null"
                            :value="generalRule.defaultAction.valueName"
                            placeholder="请输入关键字进行搜索"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="defaultActionSearch"
                        >
                          <a-select-option v-for="d in actionSearchSelect.data" :value="d.id"
                                           :key="d.id"
                                           @click.native="defaultActionSearchOptionClick(d)">
                            {{ d.name }}
                          </a-select-option>
                        </a-select>

                        <a-select
                            :disabled="!generalRule.defaultAction.type"
                            v-else-if="generalRule.defaultAction.valueType==='BOOLEAN'"
                            defaultValue="true"
                            @blur="saveDefaultAction"
                            style="width: 100%"
                            v-model="generalRule.defaultAction.value" placeholder="请选择数据">
                          <a-select-option value="true">true</a-select-option>
                          <a-select-option value="false">false</a-select-option>
                        </a-select>
                        <a-input-number
                            @blur="saveDefaultAction"
                            :disabled="!generalRule.defaultAction.type"
                            v-else-if="generalRule.defaultAction.valueType==='NUMBER'"
                            v-model="generalRule.defaultAction.value" style="width: 100%"/>
                        <a-date-picker
                                :disabled="!generalRule.defaultAction.type"
                                v-else-if="generalRule.defaultAction.valueType==='DATE'"
                                show-time
                                @openChange="defaultActionValueDatePickerOpenChange"
                                @change="(date,dateString)=>(datePickerChange(generalRule.defaultAction,date,dateString))"
                                format="YYYY-MM-DD hh:mm:ss"
                                v-model="generalRule.defaultAction.value"
                                style="width: 100%"/>
                        <a-input v-else
                                 @blur="saveDefaultAction"
                                 :disabled="!generalRule.defaultAction.type"
                                 v-model="generalRule.defaultAction.value"/>
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-card>
              </a-form-model>
            </a-col>
            <a-col :span="1"></a-col>
          </a-row>
        </vue-scroll>
        <br>
        <br>
        <br>
      </a-card>
    </page-layout>

    <ConditionModal ref="modal" :dataId="generalRule.id" :dataType="dataType"/>


    <footer-tool-bar>
      <a-button type="primary" @click="nextStep()" :loading="footer.nextStepLoading">预览发布</a-button>
    </footer-tool-bar>

  </div>
</template>

<script>
import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";
import Contextmenu from '@/components/menu/Contextmenu'
import ConditionModal from "@/pages/components/condition/ConditionModal";

// api
import {saveOrUpdate, deleteConditionGroup} from '@/services/conditionGroup'
import {
  getRuleConfig,
  generationRelease,
  saveDefaultAction,
  defaultActionSwitch
} from '@/services/generalRule'
import {deleteCondition} from '@/services/conditionGroupCondition'
import {saveAction} from '@/services/rule'

import {selectSearch} from '@/utils/selectSearch'
import {getSymbolByValueType, getSymbolExplanation} from '@/utils/symbol'
import moment from 'moment';
import {mapState} from "vuex";
import TaskGroup from '@/components/task/TaskGroup'
import {getTypeName, valueType} from '@/utils/value-type'

export default {
  name: "Config",
  components: {PageLayout, FooterToolBar, Contextmenu, TaskGroup, ConditionModal},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      //条件组loading
      conditionMoveLoading: false,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          keepShow: true
        },
        bar: {
          hoverStyle: true,
          onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
          background: "#F5F5F5",//滚动条颜色
          opacity: 0.5,//滚动条透明度
          "overflow-x": "hidden"
        }
      },
      menuVisible: false,
      loading: true,
      dataType: 0,
      generalRule: {
        id: null,
        name: null,
        code: null,
        currentVersion: null,// 如果规则有版本了，则不支持修改返回值
        description: null,
        ruleId: null,
        conditionGroup: [],
        action: {
          value: undefined,
          valueName: undefined,
          valueType: undefined,
          variableValue: undefined,
          type: undefined,
        },
        defaultAction: {
          enableDefaultAction: 1,
          value: undefined,
          valueName: undefined,
          valueType: undefined,
          variableValue: undefined,
          type: undefined,
        },
      },
      actionSearchSelect: {
        data: [],
        value: undefined,
      },
      footer: {
        nextStepLoading: false,
      },
      drawer: {
        visible: false
      },
    }
  },
  mounted() {
    this.generalRule.id = this.id
    this.getRuleConfig();
  },
  computed: {
    ...mapState('setting', ['isMobile']),
    menuItemList() {
      return [
        {key: '1', icon: 'appstore', text: "组件"},
        {key: '2', icon: 'setting', text: "设置"},
      ]
    },
  },
  methods: {
    valueType(v) {
      return valueType(v);
    },
    defaultActionValueTypeChange(valueType) {
      this.generalRule.defaultAction = {
        enableDefaultAction: this.generalRule.defaultAction.enableDefaultAction,
        value: undefined,
        valueName: undefined,
        valueType: undefined,
        variableValue: undefined,
      };
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.generalRule.defaultAction.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.generalRule.defaultAction.type = 1;
      } else {
        this.generalRule.defaultAction.valueType = valueType;
        this.generalRule.defaultAction.type = 2;
      }
      // 清空远程搜索缓存
      this.actionSearchSelect = {
        data: [],
        value: undefined,
      }
    },
    enableDefaultActionChange() {
      let defaultAction = this.generalRule.defaultAction;
      if (defaultAction.enableDefaultAction === 0) {
        defaultAction.enableDefaultAction = 1;
      } else {
        // 如果开启默认规则，判断是否填写，如果没有填写，手动触发提示错误
        if (defaultAction.type == null) {
          this.$refs['generalRuleForm'].fields[2].validateMessage = '请选择默认结果类型'
          this.$refs['generalRuleForm'].fields[2].validateState = 'error'
          return;
        }
        if (defaultAction.value == null) {
          this.$refs['generalRuleForm'].fields[3].validateMessage = '请输入默认结果值'
          this.$refs['generalRuleForm'].fields[3].validateState = 'error'
          return;
        }
        defaultAction.enableDefaultAction = 0;
      }
      defaultActionSwitch({
        generalRuleId: this.generalRule.id,
        enableDefaultAction: defaultAction.enableDefaultAction
      }).then(res => {
        if (res.data.data) {
          this.$message.success(defaultAction.enableDefaultAction === 0 ? '默认结果已开启' : '默认结果已关闭');
        }
      })
    },
    onContextmenu(e) {
      if (e) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    onMenuSelect(key, target, pageKey) {
      console.log(pageKey)
      switch (key) {
        case '1':
          alert('暂不支持')
          break
        case '2':
          alert('暂不支持')
          break
        default:
          break
      }
    },
    datePickerChange(v, date) {
      v.value = moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    saveAction() {
      if (this.generalRule.action.type == null) {
        return;
      }
      if (this.generalRule.action.value !== 0 && !this.generalRule.action.value) {
        return;
      }
      if (!this.generalRule.action.valueType) {
        return;
      }
      saveAction({
        ruleId: this.generalRule.ruleId,
        configValue: this.generalRule.action
      }).then(res => {
        if (res.data.data) {
          this.$message.success("结果保存成功");
        }
      })
    },
    saveDefaultAction() {
      if (this.generalRule.defaultAction.type == null) {
        return;
      }
      if (!this.generalRule.defaultAction.value !== 0 && !this.generalRule.defaultAction.value) {
        return;
      }
      if (!this.generalRule.defaultAction.valueType) {
        return;
      }
      saveDefaultAction({
        generalRuleId: this.generalRule.id,
        configValue: this.generalRule.defaultAction
      }).then(res => {
        if (res.data.data) {
          this.$message.success("默认结果保存成功");
        }
      })
    },
    actionValueDatePickerOpenChange(s) {
      if (!s) {
        this.saveAction();
      }
    },
    defaultActionValueDatePickerOpenChange(s) {
      if (!s) {
        this.saveDefaultAction();
      }
    },
    actionSearch(value) {
      selectSearch({
            name: value,
            valueType: null // 查询所有类型
          }, data => (this.actionSearchSelect.data = data)
          , this.generalRule.action.type)
    },
    defaultActionSearch(value) {
      selectSearch({
            name: value,
            valueType: [this.generalRule.action.valueType]
          }, data => (this.actionSearchSelect.data = data)
          , this.generalRule.defaultAction.type)
    },
    actionSearchOptionClick(d) {
      let action = this.generalRule.action;
      action.value = d.id;
      action.valueType = d.valueType;
      action.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (action.type === 1 && d.type === 2) {
        action.variableValue = d.value;
      }
      this.saveAction();
    },
    defaultActionSearchOptionClick(d) {
      let defaultAction = this.generalRule.defaultAction;
      defaultAction.value = d.id;
      defaultAction.valueType = d.valueType;
      defaultAction.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if (defaultAction.type === 1 && d.type === 2) {
        defaultAction.variableValue = d.value;
      }
      this.saveDefaultAction();
    },
    deleteCondition(cgc, conditionGroupRefId, conditionId) {
      deleteCondition({
        conditionId: conditionId,
        conditionGroupRefId: conditionGroupRefId
      }).then(res => {
        if (res.data.data) {
          // 删除掉前端数组中的数据
          // cg.conditionGroupCondition
          cgc.forEach((value, index) => {
            if (value.condition.id === conditionId) {
              cgc.splice(index, 1);
            }
          });
          this.$message.success("删除条件成功");
        }
      })
    },
    getViewValue(v) {
      // 如果是固定值
      if (v.type === 2) {
        return v.value;
      }
      // 如果是固定值变量的 变量值
      if (v.variableValue) {
        return v.variableValue;
      }
      if (v.valueName) {
        return v.valueName;
      }
      return v.value;
    },
    actionValueTypeChange(valueType) {
      this.generalRule.action = {
        value: undefined,
        valueName: undefined,
        valueType: undefined,
        variableValue: undefined,
      };
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.generalRule.action.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.generalRule.action.type = 1;
      } else {
        this.generalRule.action.valueType = valueType;
        this.generalRule.action.type = 2;
      }
      // 清空远程搜索缓存
      this.actionSearchSelect = {
        data: [],
        value: undefined,
      }
    },
    getRValueType(valueType, symbol) {
      if (valueType == null) {
        return [];
      }
      // 如果左值为集合时
      if (valueType === 'COLLECTION' && symbol != null) {
        // 并且 只有左值为COLLECTION 运算符为CONTAIN/NOT_CONTAIN 返回所有的类型
        if (symbol === 'CONTAIN' || symbol === 'NOT_CONTAIN') {
          return ["STRING", "NUMBER", "BOOLEAN", "COLLECTION", "DATE"];
        }
      }
      return new Array(valueType);
    },
    getTypeName(type) {
      return getTypeName(type);
    },
    nextStep() {
      this.$refs['generalRuleForm'].validate(valid => {
        if (valid) {
          this.footer.nextStepLoading = true;
          generationRelease(this.generalRule).then(res => {
            if (res.data.data) {
              this.footer.nextStepLoading = false;
              this.$emit("choicePage", {pageIndex: 3, id: this.generalRule.id})
            }
          })
        } else {
          return false;
        }
      });
    },
    showDrawer() {
      this.drawer.visible = true;
    },
    onClose() {
      this.drawer.visible = false;
    },
    handleClick() {

    },
    addConditionGroup() {
      // 增加一个条件组
      let newOrderNo = 1;
      if (this.generalRule.conditionGroup != null) {
        let length = this.generalRule.conditionGroup.length;
        let conditionGroupElement = this.generalRule.conditionGroup[length - 1];
        if (conditionGroupElement !== undefined) {
          newOrderNo = conditionGroupElement.orderNo + 1;
        }
      } else {
        this.generalRule.conditionGroup = [];
      }
      let newConditionGroup = {
        id: null,
        name: "条件组",
        ruleId: this.generalRule.ruleId,
        orderNo: newOrderNo,
        conditionGroupCondition: []
      };
      saveOrUpdate(newConditionGroup).then(res => {
        // 回显的id
        if (res.data.data) {
          newConditionGroup.id = res.data.data;
          this.generalRule.conditionGroup.push(newConditionGroup);
          this.$message.success("添加条件组成功");
        }
      });
    },
    updateConditionGroupName(cg) {
      saveOrUpdate({
        id: cg.id,
        ruleId: this.generalRule.ruleId,
        name: cg.name
      });
    },
    deleteConditionGroup(cg) {
      // 删除条件组
      deleteConditionGroup({
        id: cg.id
      }).then(res => {
        if (res.data.data) {
          this.generalRule.conditionGroup.forEach((value, index) => {
            if (value.id === cg.id) {
              this.generalRule.conditionGroup.splice(index, 1);
            }
          });
          this.$message.success("删除条件组成功");
        }
      });
    },
    getRuleConfig() {
      getRuleConfig({
        "id": this.generalRule.id
      }).then(res => {
        let da = res.data.data;
        if (da != null) {
          this.generalRule = da;
        }
      }).finally(() => {
        this.loading = false
      });
    },
    getSymbolExplanation(name) {
      return getSymbolExplanation(name);
    },
    getSymbolByValueType(valueType) {
      return getSymbolByValueType(valueType);
    }
  }
}
</script>

<style lang="less">
.condition_set {
  .ant-alert-close-icon {
    margin-top: -5px;
  }
}
</style>

<style lang="less" scoped>
.openLeft {
  width: 30px;
  height: 80px;
  position: fixed;
  margin-left: -20px;
  z-index: 19;
}

.conditionItem {

}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 2px;
  font-size: 18px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}


.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

// 滚动条位置
/deep/ .__bar-is-vertical {
  right: -1px !important;
}

// 隐藏横向滚动条
/deep/ .__bar-is-horizontal {
  display: none !important;
}
</style>
