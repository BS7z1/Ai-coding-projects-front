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
        <!-- 业务管理 -->
        <el-submenu index="business">
          <template slot="title">
            <i class="el-icon-s-management"></i>
            <span>业务管理</span>
          </template>
          
          <!-- 北京 -->
          <el-menu-item index="/business/beijing">
            <i class="el-icon-location"></i>
            <span slot="title">北京</span>
          </el-menu-item>
          
          <!-- 代码生成 -->
          <el-menu-item index="/business/codegen">
            <i class="el-icon-document-copy"></i>
            <span slot="title">代码生成</span>
          </el-menu-item>
        </el-submenu>

        <!-- 信贷借据管理 -->
        <el-submenu index="loan">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>信贷借据管理</span>
          </template>
          <el-menu-item index="/business/loan-ledger">
            <i class="el-icon-s-grid"></i>
            <span slot="title">借据台账管理</span>
          </el-menu-item>
          <el-menu-item index="/business/loan-review">
            <i class="el-icon-s-check"></i>
            <span slot="title">借据复核审批</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <!-- 右侧内容区 -->
    <el-container>
      <el-header style="background-color: #fff; border-bottom: 1px solid #e6e6e6; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 16px;">{{ currentTitle }}</span>
        <el-dropdown>
          <span style="cursor: pointer;">
            管理员 <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>退出登录</el-dropdown-item>
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
export default {
  name: 'Layout',
  data() {
    return {
      currentTitle: '业务管理'
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
        '/business/beijing': '北京',
        '/business/codegen': '代码生成',
        '/business/loan-ledger': '借据台账管理',
        '/business/loan-review': '借据复核审批'
      }
      this.currentTitle = titleMap[path] || '业务管理'
    }
  },
  created() {
    this.updateTitle(this.$route.path)
  }
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
