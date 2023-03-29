<template>

  <a-modal
      :title="selectCondition.from.id === undefined ?'创建条件':'编辑条件'"
      :mask="false"
      :visible="selectCondition.visible"
      :ok-text="selectCondition.from.id === undefined ? '确认添加' : '确认更新'"
      @ok="addConditionOk('conditionForm')"
      @cancel="addConditionCancel"
  >
    <a-form-model style="width: 500px;"
                  ref="conditionForm"
                  :model="selectCondition.from"
                  :label-col="{span: 3}"
                  :wrapper-col="{span: 19}">
      <a-form-model-item label="名称" prop="name"
                         style="margin-bottom: 10px;"
                         :rules="{
                                        required: true,
                                        message: '请输入条件名称',
                                        trigger: ['change', 'blur'],
                                      }">
        <a-input v-model="selectCondition.from.name">
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="配置" prop="config" required style="margin-bottom: 10px;">
        <br>
        <a-row>
          <a-col :span="3">
            左值
          </a-col>
          <a-col :span="6">
            <a-form-model-item prop="config.leftValue.type"
                               style="margin-bottom: 10px;"
                               :rules="{
                                        required: true,
                                        message: '请选择左值类型',
                                        trigger: ['change', 'blur'],
                                      }">
              <a-select
                  :value="valueType(selectCondition.from.config.leftValue)"
                  placeholder="请选择"
                  @change="leftValueTypeChange">
                <a-select-option value="PARAMETER">参数</a-select-option>
                <a-select-option value="VARIABLE">变量</a-select-option>
                <a-select-option v-if="viewSelectGR" value="GENERAL_RULE">普通规则</a-select-option>
                <a-select-option value="BOOLEAN">布尔</a-select-option>
                <a-select-option value="COLLECTION">集合</a-select-option>
                <a-select-option value="STRING">字符串</a-select-option>
                <a-select-option value="NUMBER">数值</a-select-option>
                <a-select-option value="DATE">日期</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="1"/>
          <a-col :span="14">
            <a-form-model-item prop="config.leftValue.value"
                               style="margin-bottom: 10px;"
                               :rules="{
                                        required: true,
                                        message: '请输入左值',
                                        trigger: ['change', 'blur'],
                                      }">
              <a-select
                  v-if="selectCondition.from.config.leftValue.type===0||selectCondition.from.config.leftValue.type===1||selectCondition.from.config.leftValue.type===4||selectCondition.from.config.leftValue.type===10"
                  show-search
                  :disabled="selectCondition.from.config.leftValue.type==null"
                  :value="selectCondition.from.config.leftValue.valueName"
                  placeholder="请输入关键字进行搜索"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="conditionLeftSearch"
                  @change="conditionLeftChange"
              >
                <a-select-option v-for="d in selectConditionLeftSearchSelect.data"
                                 :value="d.id"
                                 :key="d.id"
                                 @click.native="conditionLeftSearchOptionClick(d)">
                  {{ d.name }}
                </a-select-option>
              </a-select>

              <a-select
                  :disabled="selectCondition.from.config.leftValue.type==null"
                  v-else-if="selectCondition.from.config.leftValue.valueType==='BOOLEAN'"
                  defaultValue="true"
                  v-model="selectCondition.from.config.leftValue.value" placeholder="请选择数据">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-input-number
                  :disabled="selectCondition.from.config.leftValue.type==null"
                  v-else-if="selectCondition.from.config.leftValue.valueType==='NUMBER'"
                  v-model="selectCondition.from.config.leftValue.value" style="width: 100%"/>
              <a-date-picker
                      :disabled="selectCondition.from.config.leftValue.type==null"
                      v-else-if="selectCondition.from.config.leftValue.valueType==='DATE'"
                      show-time
                      v-model="selectCondition.from.config.leftValue.value"
                      @change="(date,dateString)=>(datePickerChange(selectCondition.from.config.leftValue,date,dateString))"
                      style="width: 100%"/>
              <a-input v-else
                       :disabled="selectCondition.from.config.leftValue.type==null"
                       v-model="selectCondition.from.config.leftValue.value"/>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="3">
            运算符
          </a-col>
          <a-col :span="6">
            <a-form-model-item prop="config.symbol"
                               style="margin-bottom: 10px;"
                               :rules="{
                                        required: true,
                                        message: '请选择运算符',
                                        trigger: ['change', 'blur'],
                                      }">
              <a-select placeholder="请选择"
                        :disabled="(selectCondition.from.config.leftValue.value==null&&selectCondition.from.config.leftValue.type!==2&&selectCondition.from.config.rightValue.value==null)"
                        v-model="selectCondition.from.config.symbol">
                <a-select-option v-for="op in selectCondition.operators" :value="op.name"
                                 :key="op.name">
                  {{ op.explanation }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="15"/>
        </a-row>

        <a-row>
          <a-col :span="3">
            右值
          </a-col>
          <a-col :span="6">
            <a-form-model-item prop="config.rightValue.type"
                               style="margin-bottom: 10px;"
                               :rules="{
                                        required: true,
                                        message: '请选择右值类型',
                                        trigger: ['change', 'blur'],
                                      }">
              <a-select
                  :disabled="(selectCondition.from.config.leftValue.value==null&&selectCondition.from.config.leftValue.type!==2&&selectCondition.from.config.rightValue.value==null)"
                  :value="valueType(selectCondition.from.config.rightValue)"
                  placeholder="请选择"
                  @change="rightValueTypeChange"
              >
                <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null"
                                 value="PARAMETER">参数
                </a-select-option>
                <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null"
                                 value="VARIABLE">变量
                </a-select-option>
                <a-select-option v-if="selectCondition.from.config.leftValue.valueType!=null&&viewSelectGR"
                                 value="GENERAL_RULE">
                  普通规则
                </a-select-option>
                <a-select-option v-if="isRightTypeSelectView('BOOLEAN')" value="BOOLEAN">布尔
                </a-select-option>
                <a-select-option v-if="isRightTypeSelectView('COLLECTION')" value="COLLECTION">集合
                </a-select-option>
                <a-select-option v-if="isRightTypeSelectView('STRING')" value="STRING">字符串
                </a-select-option>
                <a-select-option v-if="isRightTypeSelectView('NUMBER')" value="NUMBER">数值
                </a-select-option>
                <a-select-option v-if="isRightTypeSelectView('DATE')" value="DATE">日期
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="1"/>
          <a-col :span="14">
            <a-form-model-item prop="config.rightValue.value"
                               style="margin-bottom: 10px;"
                               :rules="{
                                        required: true,
                                        message: '请输入右值',
                                        trigger: ['change', 'blur'],
                                      }">
              <a-select
                  :disabled="selectCondition.from.config.rightValue.type==null"
                  v-if="selectCondition.from.config.rightValue.type===0||selectCondition.from.config.rightValue.type===1||selectCondition.from.config.rightValue.type===4||selectCondition.from.config.rightValue.type===10"
                  show-search
                  :value="selectCondition.from.config.rightValue.valueName"
                  placeholder="请输入关键字进行搜索"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="conditionRightSearch"
                  @change="conditionRightChange"
              >
                <a-select-option v-for="d in selectConditionRightSearchSelect.data"
                                 :value="d.id"
                                 :key="d.id"
                                 @click.native="conditionRightSearchOptionClick(d)">
                  {{ d.name }}
                </a-select-option>
              </a-select>
              <a-select
                  :disabled="selectCondition.from.config.rightValue.type==null"
                  v-else-if="selectCondition.from.config.rightValue.valueType==='BOOLEAN'"
                  v-model="selectCondition.from.config.rightValue.value" placeholder="请选择数据 ">
                <a-select-option value="true">true</a-select-option>
                <a-select-option value="false">false</a-select-option>
              </a-select>
              <a-input-number v-else-if="selectCondition.from.config.rightValue.valueType==='NUMBER'"
                              :disabled="selectCondition.from.config.rightValue.type==null"
                              v-model="selectCondition.from.config.rightValue.value"
                              style="width: 100%"/>
              <a-date-picker v-else-if="selectCondition.from.config.rightValue.valueType==='DATE'"
                             :disabled="selectCondition.from.config.rightValue.type==null"
                             show-time
                             v-model="selectCondition.from.config.rightValue.value"
                             @change="(date,dateString)=>(datePickerChange(selectCondition.from.config.rightValue,date,dateString))"
                             style="width: 100%"/>
              <a-input v-else v-model="selectCondition.from.config.rightValue.value"
                       :disabled="selectCondition.from.config.rightValue.type==null"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="说明" prop="description" style="margin-bottom: 8px;">
        <a-textarea v-model="selectCondition.from.description" :rows="3"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>

</template>

<script>
import {updateCondition} from "@/services/condition";
import {saveConditionAndBindGroup} from "@/services/conditionGroupCondition";
import {setDefaultValue} from "@/utils/json";
import {selectSearch} from "@/utils/selectSearch";
import moment from "moment";
import {valueType} from '@/utils/value-type'
import {getSymbolByValueType} from "@/utils/symbol";

export default {
  name: "ConditionModal",
  props: ["dataId", "dataType", "viewSelectGR"],
  data() {
    return {
      selectConditionLeftSearchSelect: {
        data: [],
        value: undefined,
      },
      selectConditionRightSearchSelect: {
        data: [],
        value: undefined,
      },
      selectCondition: {
        visible: false,
        currentConditionGroup: null,
        confirmLoading: false,
        operators: this.getSymbolByValueType('STRING'),
        from: {
          id: null,
          name: null,
          description: null,
          config: {
            leftValue: {
              type: undefined,
              valueType: undefined,
              value: undefined,
              valueName: undefined,
              variableValue: undefined,
            },
            symbol: undefined,
            rightValue: {
              type: undefined,
              valueType: undefined,
              value: undefined,
              valueName: undefined,
              variableValue: undefined,
            }
          }
        }
      },
    }
  },
  methods: {
    getSymbolByValueType(valueType) {
      return getSymbolByValueType(valueType);
    },
    valueType(v) {
      return valueType(v);
    },
    datePickerChange(v, date) {
      v.value = moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    addConditionOk(formName) {
      this.selectCondition.confirmLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 更新条件
          if (this.selectCondition.from.id !== undefined) {
            updateCondition(this.selectCondition.from).then(res => {
              if (res.data.data) {
                // 刷新页面条件数据
                this.selectCondition.currentConditionGroup.conditionGroupCondition.forEach(f => {
                  if (f.condition.id === this.selectCondition.from.id) {
                    f.condition = this.selectCondition.from;
                  }
                })
                this.$message.success("条件更新成功");
                this.selectCondition.confirmLoading = false;
                this.selectCondition.visible = false;
              }
            })
            return;
          }
          // 获取最后一条的orderNo
          let orderNo = 0;
          let conditionGroupCondition = this.selectCondition.currentConditionGroup.conditionGroupCondition;
          if (conditionGroupCondition.length > 0) {
            orderNo = conditionGroupCondition[conditionGroupCondition.length - 1].orderNo + 1;
          }
          // 插入一条记录
          saveConditionAndBindGroup({
            // 传入条件组信息，条件信息 绑定关系
            conditionGroupId: this.selectCondition.currentConditionGroup.id,
            orderNo: orderNo,
            addConditionRequest: this.selectCondition.from,
            dataId: this.dataId,
            dataType: this.dataType,
          }).then(res => {
            if (res.data.data) {
              // 当前条件组内插入一条数据
              this.selectCondition.from.id = res.data.data.conditionId;
              this.selectCondition.currentConditionGroup.conditionGroupCondition.push({
                "id": res.data.data.conditionGroupConditionId,
                "orderNo": orderNo,
                "condition": JSON.parse(JSON.stringify(this.selectCondition.from))
              });
              this.$message.success("添加成功");
              this.selectCondition.confirmLoading = false;
              this.selectCondition.visible = false;
            }
            // 重置表单
            this.$refs[formName].resetFields();
          })
        } else {
          this.selectCondition.confirmLoading = false;
          return false;
        }
      });
    },
    addConditionCancel() {
      this.selectCondition.visible = false;
    },
    /**
     * 条件左值类型修改
     */
    leftValueTypeChange(valueType) {
      this.selectCondition.from.config.leftValue = {
        value: undefined,
        valueName: undefined,
        variableValue: undefined,
        valueType: undefined,
      }
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.config.leftValue.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.config.leftValue.type = 1;
      } else if (valueType === 'GENERAL_RULE') {
        this.selectCondition.from.config.leftValue.type = 10;
      } else {
        this.selectCondition.from.config.leftValue.type = 2;
        this.selectCondition.from.config.leftValue.valueType = valueType;
        // 固定值场景清空右值，如果变量或者参数，等搜索到选中时再去判断清空
        // 左面发生改变，右边也改变  如果值类型相同，则不需要更改
        if (valueType !== this.selectCondition.from.config.rightValue.valueType) {
          this.selectCondition.from.config.rightValue = setDefaultValue(this.selectCondition.from.config.rightValue);
          // 删除运算符
          this.selectCondition.from.config.symbol = undefined;
          this.selectCondition.operators = []
        }
        // 根据左值更改运算符
        this.selectCondition.operators = this.getSymbolByValueType(valueType)
      }
      // 清空远程搜索缓存
      this.selectConditionLeftSearchSelect.data = [];
      this.selectConditionLeftSearchSelect.value = undefined
    },
    conditionLeftSearch(value) {
      selectSearch({
            name: value,
            valueType: null // 查询所有类型
          }, data => (this.selectConditionLeftSearchSelect.data = data)
          , this.selectCondition.from.config.leftValue.type)
    },
    conditionLeftChange(value) {
      this.selectConditionLeftSearchSelect.value = value;
    },
    conditionLeftSearchOptionClick(d) {
      let leftValue = this.selectCondition.from.config.leftValue;
      leftValue.value = d.id;
      leftValue.valueType = d.valueType;
      leftValue.valueName = d.name;
      // 变量  d.type 如果是固定值 则直接显示变量的值
      if ((leftValue.type === 1 && d.type === 2)) {
        leftValue.variableValue = d.value;
      }
      // 判断查询的变量或者元素 类型是否与右值相同，不相同则清空右值的
      if (d.valueType !== this.selectCondition.from.config.rightValue.valueType) {
        this.selectCondition.from.config.rightValue = setDefaultValue(this.selectCondition.from.config.rightValue)
        // 并重置运算符，否则不重置
        this.selectCondition.operators = this.getSymbolByValueType(d.valueType)
        // 删除运算符
        this.selectCondition.from.config.symbol = undefined;
      }
    },
    isRightTypeSelectView(valueType) {
      // 保留一个与目前右边值类型相等的
      if (this.selectCondition.from.config.rightValue.valueType === valueType) {
        return true;
      }
      if (this.selectCondition.from.config.leftValue.valueType === null) {
        return false;
      }
      if (this.selectCondition.from.config.leftValue.valueType === valueType) {
        return true;
      }
      // 如果左值为集合时
      if (this.selectCondition.from.config.leftValue.valueType === 'COLLECTION') {
        if (this.selectCondition.from.config.symbol === null) {
          return true;
        }
        // 并且 只有左值为CONTAIN/NOT_CONTAIN 返回所有的类型
        return this.selectCondition.from.config.symbol === 'CONTAIN' || this.selectCondition.from.config.symbol === 'NOT_CONTAIN';
      }
    },
    rightValueTypeChange(valueType) {
      this.selectCondition.from.config.rightValue = {
        value: undefined,
        valueName: undefined,
        variableValue: undefined,
        valueType: undefined,
      }
      // 如果是变量或者元素
      if (valueType === 'PARAMETER') {
        this.selectCondition.from.config.rightValue.type = 0;
      } else if (valueType === 'VARIABLE') {
        this.selectCondition.from.config.rightValue.type = 1;
        // 变量的类型
      } else if (valueType === 'GENERAL_RULE') {
        this.selectCondition.from.config.rightValue.type = 10;
      } else {
        this.selectCondition.from.config.rightValue.type = 2;
        this.selectCondition.from.config.rightValue.valueType = valueType;
      }
      // 清空远程搜索缓存
      this.selectConditionRightSearchSelect.data = [];
      this.selectConditionRightSearchSelect.value = undefined
    },
    conditionRightSearch(value) {
      selectSearch({
        name: value,
        // 查询指定类型右值
        valueType: this.getRValueType(this.selectCondition.from.config.leftValue.valueType, this.selectCondition.from.config.symbol)
      }, data => (this.selectConditionRightSearchSelect.data = data), this.selectCondition.from.config.rightValue.type, null);
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
    conditionRightChange(value) {
      this.selectConditionRightSearchSelect.value = value;
    },
    conditionRightSearchOptionClick(d) {
      let rightValue = this.selectCondition.from.config.rightValue;
      rightValue.value = d.id;
      rightValue.valueType = d.valueType;
      rightValue.valueName = d.name;
      // 变量  d.type 如果是固定值
      if ((rightValue.type === 1 && d.type === 2)) {
        rightValue.variableValue = d.value;
      }
    },
    editCondition(cg, cgc) {
      this.selectCondition.from = setDefaultValue(JSON.parse(JSON.stringify(this.selectCondition.from)));
      // 当前条件组
      this.selectCondition.currentConditionGroup = cg;
      // bug修复
      this.selectCondition.from = JSON.parse(JSON.stringify(cgc.condition))
      // 加载运算符
      this.selectCondition.operators = this.getSymbolByValueType(cgc.condition.config.leftValue.valueType)
      this.selectCondition.visible = true;
    },
    addCondition(cg) {
      this.selectCondition.from = setDefaultValue(JSON.parse(JSON.stringify(this.selectCondition.from)));
      this.selectCondition.currentConditionGroup = cg;
      this.selectCondition.visible = true;
    }
  }
}
</script>

<style scoped>

</style>
