<template>
  <div class="loan-ledger-container">
    <!-- 查询条件区 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryForm" :inline="true" size="small">
        <el-form-item label="借据号">
          <el-input v-model="queryForm.loanId" placeholder="模糊查询" clearable />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="queryForm.companyName" placeholder="模糊查询" clearable />
        </el-form-item>
        <el-form-item label="台账状态">
          <el-select v-model="queryForm.status" placeholder="全部" clearable>
            <el-option :value="0" label="草稿" />
            <el-option :value="1" label="待复核" />
            <el-option :value="2" label="已通过" />
            <el-option :value="3" label="已拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item label="放款日期">
          <el-date-picker
            v-model="loanDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="绿色信贷">
          <el-select v-model="queryForm.isGreen" placeholder="全部" clearable>
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item label="涉农">
          <el-select v-model="queryForm.isAgriculture" placeholder="全部" clearable>
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 + 列表 -->
    <el-card shadow="never" class="table-card">
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button icon="el-icon-upload2" @click="handleBatchImport">批量导入</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="!selection.length">批量删除</el-button>
        <el-button icon="el-icon-download" @click="handleExport">导出</el-button>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%; margin-top: 12px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="loanId" label="借据号" min-width="140" show-overflow-tooltip />
        <el-table-column prop="companyName" label="公司名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="creditCode" label="信用代码" width="150" />
        <el-table-column prop="loanAmount" label="借据金额（元）" width="130">
          <template slot-scope="scope">
            {{ formatAmount(scope.row.loanAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="interestRate" label="利率" width="90">
          <template slot-scope="scope">
            {{ scope.row.interestRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="loanDate" label="放款日期" width="110" />
        <el-table-column prop="dueDate" label="到期日期" width="110" />
        <el-table-column label="绿色信贷" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isGreen ? 'success' : 'info'" size="small">
              {{ scope.row.isGreen ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="涉农" width="70">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isAgriculture ? 'success' : 'info'" size="small">
              {{ scope.row.isAgriculture ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="担保" width="70">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isGuarantee ? 'warning' : 'info'" size="small">
              {{ scope.row.isGuarantee ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="guaranteeOrg" label="担保机构" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.guaranteeOrg || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="台账状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.row.status === 0">
              <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="text" style="color: #f56c6c" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="text" @click="handleSubmit(scope.row)">提交复核</el-button>
            </template>
            <template v-else-if="scope.row.status === 1">
              <el-button type="text" @click="handleView(scope.row)">查看</el-button>
            </template>
            <template v-else-if="scope.row.status === 2">
              <el-button type="text" @click="handleView(scope.row)">查看</el-button>
            </template>
            <template v-else-if="scope.row.status === 3">
              <el-button type="text" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="text" @click="handleSubmit(scope.row)">提交复核</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          :current-page="pagination.pageNum"
          :page-sizes="[20, 50, 100]"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="680px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" size="small">
        <el-form-item label="借据号" prop="loanId">
          <el-input v-model="formData.loanId" maxlength="50" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="formData.companyName" maxlength="200" />
        </el-form-item>
        <el-form-item label="企业统一信用代码" prop="creditCode">
          <el-input v-model="formData.creditCode" maxlength="18" placeholder="18位字母数字" />
        </el-form-item>
        <el-form-item label="借据金额（元）" prop="loanAmount">
          <el-input-number v-model="formData.loanAmount" :precision="2" :max="9999999999.99" :min="0" style="width: 100%" controls-position="right" />
        </el-form-item>
        <el-form-item label="年利率（%）" prop="interestRate">
          <el-input-number v-model="formData.interestRate" :precision="4" :max="100" :min="0.0001" :step="0.01" style="width: 100%" controls-position="right" />
        </el-form-item>
        <el-form-item label="放款日期" prop="loanDate">
          <el-date-picker v-model="formData.loanDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="到期日期" prop="dueDate">
          <el-date-picker v-model="formData.dueDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="是否绿色信贷" prop="isGreen">
          <el-radio-group v-model="formData.isGreen">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否涉农" prop="isAgriculture">
          <el-radio-group v-model="formData.isAgriculture">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有担保" prop="isGuarantee">
          <el-radio-group v-model="formData.isGuarantee" @change="onGuaranteeChange">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.isGuarantee === 1" label="担保机构" prop="guaranteeOrg">
          <el-input v-model="formData.guaranteeOrg" maxlength="200" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog title="借据详情" :visible.sync="viewVisible" width="680px">
      <el-form :model="viewData" label-width="150px" size="small">
        <el-form-item label="借据号">{{ viewData.loanId }}</el-form-item>
        <el-form-item label="公司名称">{{ viewData.companyName }}</el-form-item>
        <el-form-item label="信用代码">{{ viewData.creditCode }}</el-form-item>
        <el-form-item label="借据金额（元）">{{ formatAmount(viewData.loanAmount) }}</el-form-item>
        <el-form-item label="年利率">{{ viewData.interestRate }}%</el-form-item>
        <el-form-item label="放款日期">{{ viewData.loanDate }}</el-form-item>
        <el-form-item label="到期日期">{{ viewData.dueDate }}</el-form-item>
        <el-form-item label="绿色信贷">{{ viewData.isGreen ? '是' : '否' }}</el-form-item>
        <el-form-item label="涉农">{{ viewData.isAgriculture ? '是' : '否' }}</el-form-item>
        <el-form-item label="担保">{{ viewData.isGuarantee ? '是' : '否' }}</el-form-item>
        <el-form-item v-if="viewData.isGuarantee" label="担保机构">{{ viewData.guaranteeOrg }}</el-form-item>
        <el-form-item label="台账状态">{{ getStatusText(viewData.status) }}</el-form-item>
        <el-form-item v-if="viewData.submitBy" label="提交人">{{ viewData.submitBy }}</el-form-item>
        <el-form-item v-if="viewData.submitTime" label="提交时间">{{ viewData.submitTime }}</el-form-item>
        <el-form-item v-if="viewData.reviewBy" label="复核人">{{ viewData.reviewBy }}</el-form-item>
        <el-form-item v-if="viewData.reviewTime" label="复核时间">{{ viewData.reviewTime }}</el-form-item>
        <el-form-item v-if="viewData.rejectReason" label="拒绝原因">{{ viewData.rejectReason }}</el-form-item>
        <el-form-item v-if="viewData.remark" label="备注">{{ viewData.remark }}</el-form-item>
        <el-form-item label="创建人">{{ viewData.createdBy }}</el-form-item>
        <el-form-item label="创建时间">{{ viewData.createdTime }}</el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="viewVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog title="批量导入借据" :visible.sync="importVisible" width="600px" :close-on-click-modal="false">
      <div>
        <el-alert
          title="请使用标准模板导入，单次最多导入 1000 条数据"
          type="info"
          :closable="false"
          style="margin-bottom: 16px"
        />
        <el-upload
          ref="uploadRef"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          accept=".xlsx,.xls"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">支持 .xlsx / .xls 格式</div>
        </el-upload>
      </div>
      <!-- 导入结果 -->
      <div v-if="importResult" style="margin-top: 16px">
        <el-alert
          :title="`导入完成：成功 ${importResult.successCount} 条，失败 ${importResult.failCount} 条（共 ${importResult.totalCount} 条）`"
          :type="importResult.failCount > 0 ? 'warning' : 'success'"
          :closable="false"
        />
        <el-table v-if="importResult.failDetails && importResult.failDetails.length" :data="importResult.failDetails" border size="small" style="margin-top: 12px">
          <el-table-column prop="row" label="行号" width="80" />
          <el-table-column prop="reason" label="失败原因" show-overflow-tooltip />
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="importVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleImportConfirm" :loading="importing">开始导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPage, addLoanLedger, updateLoanLedger, deleteLoanLedger,
  batchDeleteLoanLedger, submitForReview, batchImport, exportList, checkLoanId, getDetail
} from '@/api/loanLedger'

export default {
  name: 'LoanLedger',

  data() {
    const validateCreditCode = (rule, value, callback) => {
      if (value && !/^[A-Za-z0-9]{18}$/.test(value)) {
        callback(new Error('信用代码必须为 18 位字母数字组合'))
      } else {
        callback()
      }
    }
    const validateDueDate = (rule, value, callback) => {
      if (value && this.formData.loanDate && value <= this.formData.loanDate) {
        callback(new Error('到期日期不能早于放款日期'))
      } else {
        callback()
      }
    }
    const validateLoanId = (rule, value, callback) => {
      if (!this.isEdit && value) {
        checkLoanId(value, null).then(res => {
          if (res.data) {
            callback()
          } else {
            callback(new Error('借据号已存在'))
          }
        }).catch(() => callback())
      } else {
        callback()
      }
    }

    return {
      queryForm: {
        loanId: '', companyName: '', status: null,
        isGreen: null, isAgriculture: null
      },
      loanDateRange: null,
      tableData: [],
      selection: [],
      pagination: { pageNum: 1, pageSize: 20, total: 0 },

      dialogVisible: false,
      dialogTitle: '新增借据',
      isEdit: false,
      saving: false,
      formData: this.getEmptyForm(),
      formRules: {
        loanId: [
          { required: true, message: '请输入借据号', trigger: 'blur' },
          { validator: validateLoanId, trigger: 'blur' }
        ],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        creditCode: [
          { required: true, message: '请输入信用代码', trigger: 'blur' },
          { validator: validateCreditCode, trigger: 'blur' }
        ],
        loanAmount: [{ required: true, message: '请输入借据金额', trigger: 'blur' }],
        interestRate: [{ required: true, message: '请输入利率', trigger: 'blur' }],
        loanDate: [{ required: true, message: '请选择放款日期', trigger: 'change' }],
        dueDate: [
          { required: true, message: '请选择到期日期', trigger: 'change' },
          { validator: validateDueDate, trigger: 'change' }
        ],
        isGreen: [{ required: true, message: '请选择是否绿色信贷', trigger: 'change' }],
        isAgriculture: [{ required: true, message: '请选择是否涉农', trigger: 'change' }],
        isGuarantee: [{ required: true, message: '请选择是否有担保', trigger: 'change' }],
        guaranteeOrg: [{ required: true, message: '请填写担保机构', trigger: 'blur' }]
      },

      viewVisible: false,
      viewData: {},

      importVisible: false,
      importFile: null,
      importing: false,
      importResult: null
    }
  },

  methods: {
    // ============ 查询 ============
    handleQuery() {
      this.pagination.pageNum = 1
      this.fetchData()
    },
    handleReset() {
      this.queryForm = { loanId: '', companyName: '', status: null, isGreen: null, isAgriculture: null }
      this.loanDateRange = null
      this.pagination.pageNum = 1
      this.fetchData()
    },
    fetchData() {
      const params = { ...this.queryForm }
      if (this.loanDateRange && this.loanDateRange.length === 2) {
        params.loanDateStart = this.loanDateRange[0]
        params.loanDateEnd = this.loanDateRange[1]
      }
      queryPage(params, { pageNum: this.pagination.pageNum, pageSize: this.pagination.pageSize }, 'currentUser', 'applicant')
        .then(res => {
          this.tableData = res.data.records || []
          this.pagination.total = res.data.total || 0
        }).catch(() => {
          this.tableData = []
          this.pagination.total = 0
        })
    },
    handlePageChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.fetchData()
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      this.pagination.pageNum = 1
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.selection = val
    },

    // ============ 新增 ============
    handleAdd() {
      this.dialogTitle = '新增借据'
      this.isEdit = false
      this.formData = this.getEmptyForm()
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
    },

    // ============ 编辑 ============
    handleEdit(row) {
      this.dialogTitle = '修改借据'
      this.isEdit = true
      this.formData = { ...row }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())
    },

    // ============ 保存 ============
    handleSave() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        // 担保机构条件校验
        if (this.formData.isGuarantee === 1 && !this.formData.guaranteeOrg) {
          this.$message.warning('选择"有担保"时，担保机构不能为空')
          return
        }
        this.saving = true
        const apiCall = this.isEdit
          ? updateLoanLedger(this.formData, 'currentUser')
          : addLoanLedger(this.formData, 'currentUser')
        apiCall.then(() => {
          this.$message.success(this.isEdit ? '修改成功' : '新增成功')
          this.dialogVisible = false
          this.fetchData()
        }).finally(() => { this.saving = false })
      })
    },

    // ============ 删除 ============
    handleDelete(row) {
      this.$confirm('确定删除该借据记录吗？', '提示', { type: 'warning' }).then(() => {
        deleteLoanLedger(row.id, 'currentUser').then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    },
    handleBatchDelete() {
      if (!this.selection.length) {
        this.$message.warning('请选择要删除的记录')
        return
      }
      const canDelete = this.selection.every(item => item.status === 0)
      if (!canDelete) {
        this.$message.warning('仅草稿状态的记录可删除，请重新选择')
        return
      }
      this.$confirm(`确定删除选中的 ${this.selection.length} 条记录吗？`, '批量删除', { type: 'warning' }).then(() => {
        const ids = this.selection.map(item => item.id)
        batchDeleteLoanLedger(ids, 'currentUser').then(res => {
          this.$message.success(res.message || '批量删除完成')
          this.fetchData()
        })
      }).catch(() => {})
    },

    // ============ 提交复核 ============
    handleSubmit(row) {
      this.$confirm('确认提交复核吗？提交后将不可修改。', '提交复核', { type: 'warning' }).then(() => {
        submitForReview(row.id, 'currentUser').then(() => {
          this.$message.success('提交复核成功')
          this.fetchData()
        })
      }).catch(() => {})
    },

    // ============ 查看 ============
    handleView(row) {
      getDetail(row.id).then(res => {
        this.viewData = res.data
        this.viewVisible = true
      })
    },

    // ============ 批量导入 ============
    handleBatchImport() {
      this.importVisible = true
      this.importFile = null
      this.importResult = null
    },
    handleFileChange(file) {
      this.importFile = file.raw
    },
    handleImportConfirm() {
      if (!this.importFile) {
        this.$message.warning('请选择文件')
        return
      }
      // TODO: 实际场景中需使用 xlsx 库解析文件为 JSON 数组，此处仅为示例结构
      this.$message.info('批量导入功能需要集成 xlsx 库解析文件，当前示例为占位实现')
    },

    // ============ 导出 ============
    handleExport() {
      const params = { ...this.queryForm }
      if (this.loanDateRange && this.loanDateRange.length === 2) {
        params.loanDateStart = this.loanDateRange[0]
        params.loanDateEnd = this.loanDateRange[1]
      }
      exportList(params, 'currentUser', 'applicant').then(res => {
        // TODO: 将 res.data 导出为 Excel 文件
        this.$message.success('导出成功，共 ' + (res.data ? res.data.length : 0) + ' 条')
      })
    },

    // ============ 辅助 ============
    getEmptyForm() {
      return {
        id: null, loanId: '', companyName: '', creditCode: '',
        loanAmount: null, interestRate: null, loanDate: null, dueDate: null,
        isGreen: 0, isAgriculture: 0, isGuarantee: 0, guaranteeOrg: '', remark: ''
      }
    },
    onGuaranteeChange(val) {
      if (val !== 1) {
        this.formData.guaranteeOrg = ''
      }
    },
    handleDialogClose() {
      this.$refs.formRef && this.$refs.formRef.resetFields()
    },
    getStatusType(status) {
      const map = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }
      return map[status] || 'info'
    },
    getStatusText(status) {
      const map = { 0: '草稿', 1: '待复核', 2: '已通过', 3: '已拒绝' }
      return map[status] || '未知'
    },
    formatAmount(val) {
      if (val == null) return ''
      return Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  },

  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.loan-ledger-container {
  height: 100%;
}
.search-card {
  margin-bottom: 12px;
}
.table-card {
  min-height: 400px;
}
.toolbar {
  display: flex;
  gap: 8px;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
