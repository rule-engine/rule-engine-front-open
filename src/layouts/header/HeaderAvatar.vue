<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar"/>
      <span class="name">{{ user.username }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="personal">
        <a-icon type="user"/>
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting"/>
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider/>
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff"/>
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {logout, getUserInfo} from '@/services/user'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('user', ['user']),
    ...mapMutations('user', ['setUser', 'setPermissions', 'setRoles']),
  },
  created() {
    getUserInfo().then(this.afterGetUserInfo)
  },
  methods: {
    logout() {
      logout(this)
    },
    personal() {
      this.$router.push("/settings/personal")
    },
    afterGetUserInfo(res) {
      if (res.data.code === 200) {
        const {data} = res.data
        this.$store.commit('user/setUser', data)
      }
    }
  }
}
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;

  .avatar, .name {
    align-self: center;
  }

  .avatar {
    margin-right: 8px;
  }

  .name {
    font-weight: 500;
  }
}

.avatar-menu {
  width: 150px;
}

</style>
