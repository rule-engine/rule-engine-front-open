<template>
  <div>
    <Config @choicePage="choicePage" :id="id" v-if="currentPage===2"></Config>
    <Publish @choicePage="choicePage" :id="id" v-if="currentPage===3"></Publish>
  </div>
</template>

<script>

import Config from '../config/Config'
import Publish from '../publish/Publish'


export default {
  name: "Router",
  components: {Config, Publish},
  data() {
    return {
      currentPage: null,
      id: undefined,
    }
  },
  mounted() {
    let query = this.$route.query
    let params = this.$route.params
    if (query.pageIndex) {
      this.currentPage = parseInt(query.pageIndex)
    }else{
      this.currentPage=2;
    }
    if (params.id) {
      try {
        this.id = parseInt(params.id);
      } catch (e) {
        console.debug(e)
      }
    }
    window.addEventListener('popstate', this.cancel, false)
  },
  watch: {
    // 修改路由参数
    currentPage(val) {
      this.$router.push({
        query: {pageIndex: val}
      })
    },
  },
  destroyed() {
    window.removeEventListener('popstate', this.cancel, false);
  },
  methods: {
    cancel(data) {
      const pageIndex = this.$route.query.pageIndex;
      if (pageIndex === undefined) {
        window.removeEventListener('popstate', this.cancel, false);
      }
      if (data && pageIndex && !isNaN(pageIndex)) {
        this.currentPage = parseInt(pageIndex)
      }
    },
    choicePage(params) {
      this.currentPage = params.pageIndex
      this.id = params.id
    }
  }
}
</script>

<style scoped>

</style>
