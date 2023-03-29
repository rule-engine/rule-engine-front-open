<template>
  <div class="header-work-space">
    <a-dropdown class="lang header-item">
      <div class="hover">
        <a-icon :type="loading?'loading':'desktop'"/>
        {{ currentWorkspace.name }}
      </div>
      <a-menu slot="overlay">
        <a-menu-item
            @keydown.enter.stop="onClickSearch($event)" @select.stop="onClickSearch($event)" :key="'search'"
            :title="'搜索'">
          <a-input-search :loading="searchLoading" v-model="query.query.name" :allowClear="true"
                          @click.native="onClickSearch($event)"
                          @change.self="changeSearch($event)"
                          placeholder="请输入空间名称"
                          style="width: 180px"
                          @search="submitSearch"
          />
        </a-menu-item>
        <a-menu-item @click="changeWorkSpace" v-for=" workSpace in workSpaceList" :key="workSpace.id">{{
            workSpace.name
          }}
        </a-menu-item>
        <a-empty v-if="workSpaceList.length===0" description="没有找到工作空间" :imageStyle="{height:'30px',width:'50px'}"/>
      </a-menu>

    </a-dropdown>
  </div>
</template>

<script>
import {change, currentWorkspace, list} from '@/services/workspace'

export default {
  name: 'HeaderWorkSpace',
  data() {
    return {
      loading: true,
      searchLoading: false,
      workSpaceList: [],
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
      }
      , currentWorkspace: {
        id: -1,
        name: '加载中...',
        code: undefined
      }
    }
  }, computed: {},
  created() {
    let _this = this
    currentWorkspace().then(res => {
      _this.currentWorkspace = res.data.data
      _this.$store.commit("workspace/setWorkSpace", _this.currentWorkspace)
    }).finally(() => _this.loading = false)
    this.loadList()
  },
  methods: {
    loadList() {
      var _this = this
      list(this.query).then(res => {
        let resp = res.data.data
        if (resp) {
          _this.workSpaceList = resp.rows
          _this.query.page.total = resp.page.total
        } else {
          _this.workSpaceList = []
          _this.query.page.total = 0
        }
      }).finally(() => {
        _this.loading = false
        _this.searchLoading = false
      })
    },
    changeWorkSpace(space) {
      this.loading = true
      var _this = this
      let target = this.workSpaceList.find(e => e.id === space.key)

      change({id: target.id}).then(res => {
        if (res.data.code === 200) {
          _this.$router.go(0)
        }
      }).finally(() => {
        _this.loading = false
        _this.$router.go(0)
      })

    },
    onClickSearch(e) {
      if (e.domEvent) {
        e.domEvent.stopPropagation()
      } else {
        e.stopPropagation();
      }

    }, changPage(pageNumber) {
      console.log('Page: ', pageNumber);
    },
    submitSearch() {
      this.searchLoading = true
      this.loadList()
    }
    , changeSearch() {
      if (!this.query.query.name) this.submitSearch()
    }
  }
}
</script>

<style lang="less">
.header-work-space {
  .hover {
    cursor: pointer;
  }

}
</style>
