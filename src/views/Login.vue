<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- Logo 区域 -->
      <div class="login-header">
        <div class="login-logo">
          <i class="el-icon-bank-card"></i>
        </div>
        <h2 class="login-title">业务管理系统</h2>
        <p class="login-subtitle">Business Management System</p>
      </div>

      <!-- 表单区域 -->
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter.native="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            size="medium"
            clearable
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            size="medium"
            show-password
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="width: 100%;"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 提示文字 -->
      <p class="login-hint">默认账号：admin / user1 / reviewer1，密码均为 123456</p>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/app'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.loading = true
        login({ username: this.form.username, password: this.form.password })
          .then(res => {
            // 登录成功：将用户名存入 localStorage 供 Layout 显示
            const data = res.data || {}
            localStorage.setItem('loginUser', JSON.stringify({
              username: data.username || this.form.username,
              realName: data.realName || this.form.username
            }))
            this.$message.success('登录成功')
            // 跳转到登录前页面，或默认首页
            const redirect = this.$route.query.redirect || '/'
            this.$router.push(redirect)
          })
          .catch(() => {
            // 错误已由 request.js 拦截器弹出，这里只需重置 loading
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 40px 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.login-logo i {
  font-size: 32px;
  color: #fff;
}

.login-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: #1a237e;
  letter-spacing: 1px;
}

.login-subtitle {
  margin: 0;
  font-size: 13px;
  color: #90a4ae;
  letter-spacing: 0.5px;
}

.login-form {
  margin-top: 8px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-hint {
  text-align: center;
  font-size: 12px;
  color: #bdbdbd;
  margin: 4px 0 0;
}
</style>
