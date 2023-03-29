<template>
  <div>
    <page-layout>
      <a-card title="规则预览发布" :bordered="false">
        <span slot="extra" style="margin-left: 16px;">
              <a-popover trigger="click" arrow-point-at-center
                         overlayClassName="runTest">
                            <a-card slot="content" title="接口地址/参数" style="width: 380px;">
                              <a-icon slot="extra" type="copy"
                                      class="pointer"
                                      @click="copyParamInfo"
                                      style="font-size: 16px;"></a-icon>

                              <a-form-model>
                                  <a-form-model-item label="接口" style="margin-bottom: 8px;">
                                        <a-input v-model="request.url" readOnly/>
                                  </a-form-model-item>
                                       <a-form-model-item label="参数" style="margin-bottom: 8px;">
                                        <a-textarea v-model="request.requestJson" readOnly :rows="10"/>
                                  </a-form-model-item>
                              </a-form-model>

                            </a-card>

                    <a-icon type="file-text"
                            style="font-size: 18px;"></a-icon>
              </a-popover>
        </span>

        <span slot="extra" style="margin-left: 16px;">
              <a-popover trigger="click" arrow-point-at-center overlayClassName="runTest">

                            <a-card slot="content" title="模拟运行" style="width: 380px">
                              <a-icon slot="extra" type="right" @click="runTestMethod"
                                      v-if="!runTest.resultView&&this.runTest.status!=='exception'"
                                      style="font-size: 16px;"></a-icon>
                              <a-icon slot="extra" type="arrow-left" @click="backToTest"
                                      v-if="runTest.resultView||this.runTest.status==='exception'"
                                      style="font-size: 16px;"></a-icon>
                              <a-icon v-if="runTest.resultView" slot="extra" type="reload"
                                      @click="runTestMethod"
                                      style="font-size: 16px;margin-left: 10px;"/>

                              <a-empty v-if="!runTest.run&&!runTest.resultView&&request.param.length===0"/>


                              <a-form-model v-else-if="!runTest.run&&runTest.resultView">
                                  <a-form-model-item label="结果">
                                    <a-textarea v-model="runTest.value"/>
                                  </a-form-model-item>
                              </a-form-model>
                              <a-form-model v-else-if="!runTest.run&&!runTest.resultView">
                                  <a-form-model-item :label="param.name+'('+param.code+')'"
                                                     style="margin-bottom: 4px;"
                                                     v-for="param in request.param" :key="param.code">
                                    <a-input-number v-if="param.valueType==='NUMBER'"
                                                    v-model="param.value" style="width: 100%"/>
                                      <a-select v-else-if="param.valueType==='BOOLEAN'"
                                                v-model="param.value" placeholder="请选择数据 ">
                                      <a-select-option value="true">true</a-select-option>
                                      <a-select-option value="false">false</a-select-option>
                                    </a-select>
                                    <a-textarea v-model="param.value"
                                                v-else-if="param.valueType==='COLLECTION'"/>
                                    <a-date-picker v-else-if="param.valueType==='DATE'" show-time
                                                   v-model="param.value"
                                                   @change="(date,dateString)=>(datePickerChange(param,date,dateString))"
                                                   style="width: 100%"></a-date-picker>
                                    <a-input v-else v-model="param.value"></a-input>
                                  </a-form-model-item>
                              </a-form-model>

                              <div style="text-align: center" v-if="runTest.run">
                                 <a-progress type="circle" :percent="runTest.percent"
                                             :status="runTest.status"/>
                              </div>

                            </a-card>


                    <a-icon type="play-circle"
                            style="font-size: 18px;"></a-icon>
              </a-popover>
        </span>

        <vue-scroll :ops="ops" style="width:100%;height:100%">
          <div :style="isMobile?'width:1000px;margin: 0 auto':''">
            <br>
            <a-timeline>
              <a-timeline-item v-for="(cg,cgi) in generalRule.conditionGroup" :key="cg.id">
                <span style="color: #606266;font-size: 14px;" v-if="0===cgi">如果</span>
                <span style="color: #606266;font-size: 14px;" v-else>或者</span>
                <div v-for="(cgc) in cg.conditionGroupCondition" style="margin-left: 20px;"
                     :key="cgc.id">
                  <a-alert style="border:none;padding: 6px 6px 6px 6px;margin-bottom: 10px"
                           class="conditionItem">
                    <p slot="description" style="margin-bottom: 0;">
                      <a-tag color="blue"
                             style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                        （{{ cgc.condition.name }}）
                      </a-tag>
                      <a-tag color="cyan"
                             style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                        {{ getTypeName(cgc.condition.config.leftValue) }}
                      </a-tag>
                      {{ getViewValue(cgc.condition.config.leftValue) }}
                      &nbsp;
                      <a-tag color="orange"
                             style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                        {{ cgc.condition.config.symbol }}
                      </a-tag>
                      <a-tag color="cyan"
                             style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                        {{ getTypeName(cgc.condition.config.rightValue) }}
                      </a-tag>
                      {{ getViewValue(cgc.condition.config.rightValue) }}
                    </p>
                  </a-alert>
                </div>
              </a-timeline-item>
            </a-timeline>
            <span style="color: #606266;font-size: 14px;">返回</span>
            <div style="margin-left: 20px;margin-top: 3px;">
              <a-alert :closable="false" type="success"
                       style="border:none;padding: 6px 6px 6px 6px;margin-bottom: 10px">
                <p slot="description" style="margin-bottom: 0;">
                  <a-tag color="cyan"
                         style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                    {{ getTypeName(generalRule.action) }}
                  </a-tag>
                  {{ getActionView(generalRule.action) }}
                </p>
              </a-alert>
            </div>
            <span v-if="generalRule.conditionGroup.length!==0">
                    <span style="color: #606266;font-size: 14px;">否则返回</span>
                    <br>
                    <div style="margin-left: 20px;margin-top: 3px;">
                      <a-alert :closable="false" type="warning"
                               style="border:none;padding: 6px 6px 6px 6px;margin-bottom: 10px">
                        <p slot="description" style="margin-bottom: 0;">
                                   <a-tag color="cyan"
                                          v-if="getDefaultActionView(generalRule.defaultAction)!=='null'"
                                          style="padding: 0 2px 2px 2px;font-size: 13px;margin-bottom: 3px">
                          {{ getTypeName(generalRule.defaultAction) }}
                        </a-tag>
                        {{ getDefaultActionView(generalRule.defaultAction) }}
                        </p>
                      </a-alert>
                    </div>
       </span>
          </div>
        </vue-scroll>
      </a-card>
    </page-layout>

    <a id="copyParamInfo" style="display: none; " @click="copy($event,(request.url + ' \n' + request.requestJson))"></a>

    <footer-tool-bar>
      <a-button type="primary" @click="previous()" :loading="footer.loading">进入编辑</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <a-button type="primary" @click="publish()" :loading="footer.loading">发布</a-button>
    </footer-tool-bar>

  </div>
</template>

<script>

import FooterToolBar from '@/components/tool/FooterToolBar'
import PageLayout from "@/layouts/PageLayout";

import {runTest, viewGeneralRule, generalRulePublish} from '@/services/generalRule'
import moment from "moment";
import {mapState} from "vuex";
import {copy} from '@/utils/clipboardUtil'
import {getTypeName} from '@/utils/value-type'

export default {
  name: "Publish.vue",
  components: {PageLayout, FooterToolBar},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
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
      generalRule: {
        id: 226,
        name: null,
        code: 'ccc2222',
        description: null,
        workspaceCode: 'test',
        ruleId: null,
        conditionGroup: [],
        action: {
          value: undefined,
          valueName: null,
          valueType: 'NUMBER',
          type: null,
          loading: false,
          searchSelect: {
            data: [],
            value: undefined,
          }
        },
        defaultAction: {
          enableDefaultAction: 1,
          value: undefined,
          valueName: null,
          valueType: 'NUMBER',
          type: null,
          loading: false,
          searchSelect: {
            data: [],
            value: undefined,
          }
        },
      },
      footer: {
        loading: false,
      },
      runTest: {
        run: false,
        percent: 0,
        status: 'normal',
        value: null,
        valueType: null,
        resultView: false,
      },
      request: {
        url: process.env.VUE_APP_COMPUTE_BASE_URL + "/ruleEngine/generalRule/execute",
        requestJson: null,
        param: [],
      },
    }
  },
  mounted() {
    this.generalRule.id = this.id;
    this.getRuleConfig();
  },
  methods: {
    copyParamInfo() {
      // 解决 a-popover  a-card  悬浮 无法复制的问题
      document.getElementById('copyParamInfo').click();
    },
    copy(e, code) {
      copy(e, code)
    },
    datePickerChange(v, date) {
      v.value = moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    getActionView(action) {
      if (action.variableValue != null) {
        return action.variableValue;
      }
      if (action.valueName === '') {
        return '空';
      }
      return action.valueName;
    },
    getDefaultActionView(defaultAction) {
      if (defaultAction.enableDefaultAction === 0) {
        return this.getActionView(defaultAction);
      } else {
        return 'null';
      }
    },
    getTypeName(type) {
      return getTypeName(type);
    },
    backToTest() {
      this.runTest.status = 'normal'
      this.runTest.resultView = false;
      this.runTest.run = false;
    },
    runTestMethod() {
      this.runTest.status = 'normal'
      this.runTest.run = true;
      this.runTest.percent = 20;
      const params = {};
      this.request.param.forEach((e) => {
        params[e.code] = e.value === undefined ? '' : e.value;
      });
      let requestJson = {
        "id": this.generalRule.id,
        "status": 1,
        "code": this.generalRule.code,
        "workspaceCode": this.generalRule.workspaceCode,
        "param": params
      };
      this.runTest.percent = 40;
      runTest(requestJson).then(res => {
        if (res.data.data) {
          this.runTest.value = res.data.data.value + "";
          this.runTest.valueType = res.data.data.valueType;

          this.runTest.percent = 100;
          setTimeout(() => {
            this.runTest.run = false;
            this.runTest.percent = 0;
            this.runTest.resultView = true;
          }, 1000);
        } else {
          this.runTest.percent = 100;
          this.runTest.status = 'exception'
        }
      })
    },
    getRuleConfig() {
      viewGeneralRule({
        "id": this.generalRule.id,
        "status": 1
      }).then(res => {
        let da = res.data.data;
        this.generalRule = da;
        let param = {};
        if (da.parameters != null && da.parameters.length !== 0) {
          da.parameters.forEach((e) => {
            param[e.code] = '略';
          });
        }
        this.request.requestJson = JSON.stringify({
          "code": da.code,
          "workspaceCode": da.workspaceCode,
          "accessKeyId": '略',
          "accessKeySecret": '略',
          "param": param
        }, null, 6);
        this.request.param = da.parameters;
      })
    },
    previous() {
      this.$emit("choicePage", {pageIndex: 2, id: this.generalRule.id})
    },
    publish() {
      let id = this.generalRule.id;
      let _this = this;
      this.$confirm({
        title: '发布规则',
        content: '你确定发布吗，将会导致已发布规则变更！',
        onOk() {
          return new Promise((resolve) => {
            generalRulePublish({
              id: id
            }).then(res => {
              if (res.data.data) {
                _this.$message.success("规则发布成功");
                resolve();
              }
            })
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {
        },
      });
    },
    getViewValue(v) {
      // 如果是固定值
      if (v.type === 2) {
        return v.value;
      }
      // 如果是固定值变量的 变量值
      if (v.variableValue !== null) {
        return v.variableValue;
      }
      if (v.valueName !== null) {
        return v.valueName;
      }
      return v.value;
    },
  },
  computed: {
    ...mapState('setting', ['isMobile'])
  },
}
</script>

<style lang="less">
.runTest {
  .ant-popover-inner-content {
    padding: 0 0;
  }
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
