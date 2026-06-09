<template>
  <el-container style="height: 100vh;">
    <!-- 左侧导航栏 -->
    <el-aside width="220px" style="background-color: #304156;">
      <div class="logo" style="height: 60px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: bold;">
        业务管理系统
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <!-- 北京 -->
        <el-submenu index="/beijing">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>北京</span>
          </template>

          <!-- 信贷借据管理 -->
          <el-submenu index="/beijing/loan">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>信贷借据管理</span>
            </template>
            <el-menu-item index="/beijing/loan-ledger">
              <i class="el-icon-s-grid"></i>
              <span slot="title">借据台账管理</span>
            </el-menu-item>
            <el-menu-item index="/beijing/loan-review">
              <i class="el-icon-s-check"></i>
              <span slot="title">借据复核审批</span>
            </el-menu-item>
          </el-submenu>

          <!-- 初始模板 -->
          <el-submenu index="/beijing/template">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>初始模板</span>
            </template>
            <el-menu-item index="/beijing/template/templateSinglePk">
              <i class="el-icon-s-grid"></i>
              <span slot="title">单主键模板</span>
            </el-menu-item>
            <el-menu-item index="/beijing/template/templateCompPk">
              <i class="el-icon-s-grid"></i>
              <span slot="title">联合主键模板</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>

        <!-- 代码生成 -->
        <el-menu-item index="/business/codegen">
          <i class="el-icon-document-copy"></i>
          <span slot="title">代码生成</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 右侧内容区 -->
    <el-container>
      <el-header style="background-color: #fff; border-bottom: 1px solid #e6e6e6; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 16px;">{{ currentTitle }}</span>
        <el-dropdown @command="handleCommand">
          <span style="cursor: pointer;">
            <i class="el-icon-user-solid" style="margin-right: 4px;"></i>
            {{ displayName }} <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      
      <el-main style="background-color: #f0f2f5; padding: 20px;">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { logout } from '@/api/app'

export default {
  name: 'Layout',
  data() {
    return {
      currentTitle: '业务管理',
      displayName: '用户'
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  watch: {
    '$route'(to) {
      this.updateTitle(to.path)
    }
  },
  methods: {
    updateTitle(path) {
      const titleMap = {
        '/beijing/loan-ledger': '借据台账管理',
        '/beijing/loan-review': '借据复核审批',
        '/beijing/template/templateSinglePk': '单主键模板',
        '/beijing/template/templateCompPk': '联合主键模板',
        '/business/codegen': '代码生成'
      }
      this.currentTitle = titleMap[path] || '业务管理系统'
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      }
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用后端注销接口（不阻塞，失败也继续清理本地状态）
        logout().catch(() => {})
        // 清除本地登录状态
        localStorage.removeItem('loginUser')
        this.$message.success('已退出登录')
        this.$router.push('/login')
      }).catch(() => {})
    },
    loadUserInfo() {
      const loginUser = localStorage.getItem('loginUser')
      if (loginUser) {
        try {
          const user = JSON.parse(loginUser)
          this.displayName = user.realName || user.username || '用户'
        } catch (e) {
          this.displayName = '用户'
        }
      }
    }
  },
  created() {
    this.updateTitle(this.$route.path)
    this.loadUserInfo()
  }
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
