<template>
  <a-card class="result-error" :bordered="false">
    <result style="margin-bottom: 16px; margin-top: 48px" :is-success="false" :title="title" :description="description">
      <template slot="action">
        <a-button type="primary" @click="$router.go(-2)">返回</a-button>
      </template>
      <div>
        <div style="fontSize: 16px; fontWeight: 500; marginBottom: 16px;color: #f33535">
          {{ this.message }}
        </div>
        <div style="margin-bottom: 16px">
          <a-icon class="error-icon" type="close-circle-o"/>
          该条数据可能已经被删除
          <a style="margin-left: 16px" @click="$router.go(-2)">返回上一级查看
            <a-icon type="right"/>
          </a>
        </div>
        <div>
          <a-icon class="error-icon" type="close-circle-o"/>
          返回主页重试
          <a style="margin-left: 16px" @click="$router.push('/')">返回主页
            <a-icon type="right"/>
          </a>
        </div>
      </div>
    </result>
  </a-card>
</template>

<script>
import Result from '@/components/result/Result'

export default {
  name: 'Error',
  components: {Result},
  data() {
    return {
      message: '找不到该条数据',
      title: '操作失败',
      description: '请核对并修改以下信息后，再重试。'
    }
  }, mounted() {
    let errMsg = this.$route.params.message
    this.message = errMsg ? errMsg : this.message
  }
}
</script>

<style scoped lang="less">
.result-error {
  .error-icon {
    color: @red-6;
    margin-right: 8px
  }
}
</style>
