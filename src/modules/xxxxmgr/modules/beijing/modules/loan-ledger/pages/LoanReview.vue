<template>
  <div class="loan-review-container">
    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="待审批" name="pending" />
      <el-tab-pane label="历史记录" name="history" />
    </el-tabs>

    <!-- 查询条件区 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryForm" :inline="true" size="small">
        <el-form-item label="借据号">
          <el-input v-model="queryForm.loanId" placeholder="模糊查询" clearable />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="queryForm.companyName" placeholder="模糊查询" clearable />
        </el-form-item>
        <el-form-item v-if="activeTab === 'pending'" label="提交人">
          <el-input v-model="queryForm.submitBy" placeholder="工号/姓名" clearable />
        </el-form-item>
        <el-form-item v-if="activeTab === 'pending'" label="提交时间">
          <el-date-picker
            v-model="submitTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item v-if="activeTab === 'history'" label="审批状态">
          <el-select v-model="queryForm.isApproved" placeholder="全部" clearable>
            <el-option :value="1" label="已通过" />
            <el-option :value="0" label="已拒绝" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 待审批列表 -->
    <el-card v-if="activeTab === 'pending'" shadow="never" class="table-card">
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-check" @click="handleBatchApprove" :disabled="!pendingSelection.length">批量通过</el-button>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%; margin-top: 12px"
        @selection-change="val => pendingSelection = val"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="loanId" label="借据号" min-width="140" show-overflow-tooltip />
        <el-table-column prop="companyName" label="公司名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="借据金额（元）" width="130">
          <template slot-scope="scope">
            {{ formatAmount(scope.row.loanAmount) }}
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
        <el-table-column prop="submitBy" label="提交人" width="120" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleReview(scope.row)">审批</el-button>
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

    <!-- 历史记录列表 -->
    <el-card v-if="activeTab === 'history'" shadow="never" class="table-card">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="loanId" label="借据号" min-width="140" show-overflow-tooltip />
        <el-table-column prop="companyName" label="公司名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="借据金额（元）" width="130">
          <template slot-scope="scope">
            {{ formatAmount(scope.row.loanAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="submitBy" label="提交人" width="120" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column prop="reviewBy" label="复核人" width="120" />
        <el-table-column prop="reviewTime" label="复核时间" width="160" />
        <el-table-column label="审批结论" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isApproved === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.isApproved === 1 ? '已通过' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rejectReason" label="拒绝原因" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.rejectReason || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleViewHistory(scope.row)">查看</el-button>
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

    <!-- 审批详情弹窗 -->
    <el-dialog
      :title="'审批详情 - ' + reviewData.loanId"
      :visible.sync="reviewVisible"
      width="680px"
      :close-on-click-modal="false"
    >
      <div class="review-detail">
        <el-form label-width="150px" size="small">
          <el-form-item label="借据号">{{ reviewData.loanId }}</el-form-item>
          <el-form-item label="公司名称">{{ reviewData.companyName }}</el-form-item>
          <el-form-item label="信用代码">{{ reviewData.creditCode }}</el-form-item>
          <el-form-item label="借据金额（元）">{{ formatAmount(reviewData.loanAmount) }}</el-form-item>
          <el-form-item label="年利率">{{ reviewData.interestRate }}%</el-form-item>
          <el-form-item label="放款日期">{{ reviewData.loanDate }}</el-form-item>
          <el-form-item label="到期日期">{{ reviewData.dueDate }}</el-form-item>
          <el-form-item label="绿色信贷">{{ reviewData.isGreen ? '是' : '否' }}</el-form-item>
          <el-form-item label="涉农">{{ reviewData.isAgriculture ? '是' : '否' }}</el-form-item>
          <el-form-item label="担保">{{ reviewData.isGuarantee ? '是' : '否' }}</el-form-item>
          <el-form-item v-if="reviewData.isGuarantee" label="担保机构">{{ reviewData.guaranteeOrg }}</el-form-item>
          <el-form-item label="提交人">{{ reviewData.submitBy }}</el-form-item>
          <el-form-item label="提交时间">{{ reviewData.submitTime }}</el-form-item>
          <el-form-item v-if="reviewData.remark" label="备注">{{ reviewData.remark }}</el-form-item>
          <el-form-item v-if="reviewData.rejectReason && reviewData.status === 3" label="上次拒绝原因">
            <span style="color: #f56c6c">{{ reviewData.rejectReason }}</span>
          </el-form-item>
        </el-form>

        <!-- 审批操作区 -->
        <el-divider content-position="left">审批操作</el-divider>
        <el-form ref="approvalFormRef" :model="approvalForm" :rules="approvalRules" label-width="100px" size="small">
          <el-form-item label="审批结论" prop="isApproved">
            <el-radio-group v-model="approvalForm.isApproved" @change="onApprovalChange">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="approvalForm.isApproved === 0" label="拒绝原因" prop="rejectReason">
            <el-input
              v-model="approvalForm.rejectReason"
              type="textarea"
              :rows="3"
              maxlength="500"
              show-word-limit
              placeholder="请填写拒绝原因（不少于5个字）"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApprovalConfirm" :loading="approving">确认提交</el-button>
      </div>
    </el-dialog>

    <!-- 历史详情查看弹窗 -->
    <el-dialog title="历史记录详情" :visible.sync="historyVisible" width="680px">
      <el-form :model="historyData" label-width="150px" size="small">
        <el-form-item label="借据号">{{ historyData.loanId }}</el-form-item>
        <el-form-item label="公司名称">{{ historyData.companyName }}</el-form-item>
        <el-form-item label="信用代码">{{ historyData.creditCode }}</el-form-item>
        <el-form-item label="借据金额（元）">{{ formatAmount(historyData.loanAmount) }}</el-form-item>
        <el-form-item label="年利率">{{ historyData.interestRate }}%</el-form-item>
        <el-form-item label="放款日期">{{ historyData.loanDate }}</el-form-item>
        <el-form-item label="到期日期">{{ historyData.dueDate }}</el-form-item>
        <el-form-item label="绿色信贷">{{ historyData.isGreen ? '是' : '否' }}</el-form-item>
        <el-form-item label="涉农">{{ historyData.isAgriculture ? '是' : '否' }}</el-form-item>
        <el-form-item label="担保">{{ historyData.isGuarantee ? '是' : '否' }}</el-form-item>
        <el-form-item v-if="historyData.isGuarantee" label="担保机构">{{ historyData.guaranteeOrg }}</el-form-item>
        <el-form-item label="提交人">{{ historyData.submitBy }}</el-form-item>
        <el-form-item label="提交时间">{{ historyData.submitTime }}</el-form-item>
        <el-form-item label="复核人">{{ historyData.reviewBy }}</el-form-item>
        <el-form-item label="复核时间">{{ historyData.reviewTime }}</el-form-item>
        <el-form-item label="审批结论">
          <el-tag :type="historyData.isApproved === 1 ? 'success' : 'danger'" size="small">
            {{ historyData.isApproved === 1 ? '已通过' : '已拒绝' }}
          </el-tag>
        </el-form-item>
        <el-form-item v-if="historyData.rejectReason" label="拒绝原因">{{ historyData.rejectReason }}</el-form-item>
        <el-form-item v-if="historyData.remark" label="备注">{{ historyData.remark }}</el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="historyVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryPage, approve, batchApprove, reject, getDetail } from '@/api/loanLedger'

export default {
  name: 'LoanReview',

  data() {
    return {
      activeTab: 'pending',
      queryForm: { loanId: '', companyName: '', submitBy: '', isApproved: null },
      submitTimeRange: null,

      tableData: [],
      pendingSelection: [],
      pagination: { pageNum: 1, pageSize: 20, total: 0 },

      reviewVisible: false,
      reviewData: {},
      approvalForm: { isApproved: null, rejectReason: '' },
      approvalRules: {
        isApproved: [{ required: true, message: '请选择审批结论', trigger: 'change' }],
        rejectReason: [
          { required: true, message: '请填写拒绝原因', trigger: 'blur' },
          { min: 5, message: '拒绝原因不能少于5个字', trigger: 'blur' }
        ]
      },
      approving: false,

      historyVisible: false,
      historyData: {}
    }
  },

  methods: {
    // ============ Tab 切换 ============
    handleTabClick() {
      this.queryForm = { loanId: '', companyName: '', submitBy: '', isApproved: null }
      this.submitTimeRange = null
      this.pagination.pageNum = 1
      this.pendingSelection = []
      this.fetchData()
    },

    // ============ 查询 ============
    handleQuery() {
      this.pagination.pageNum = 1
      this.fetchData()
    },
    handleReset() {
      this.queryForm = { loanId: '', companyName: '', submitBy: '', isApproved: null }
      this.submitTimeRange = null
      this.pagination.pageNum = 1
      this.fetchData()
    },
    fetchData() {
      const params = { ...this.queryForm }
      // 提交时间范围
      if (this.submitTimeRange && this.submitTimeRange.length === 2) {
        params.submitTimeStart = this.submitTimeRange[0]
        params.submitTimeEnd = this.submitTimeRange[1]
      }
      // 待审批 Tab 自动过滤 status=1
      if (this.activeTab === 'pending') {
        params.status = 1
      } else {
        params.status = null // 历史记录不传 status，后端查已审批
      }

      queryPage(params, { pageNum: this.pagination.pageNum, pageSize: this.pagination.pageSize }, 'currentUser', 'reviewer')
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

    // ============ 审批 ============
    handleReview(row) {
      getDetail(row.id).then(res => {
        this.reviewData = res.data
        this.approvalForm = { isApproved: null, rejectReason: '' }
        this.reviewVisible = true
        this.$nextTick(() => this.$refs.approvalFormRef && this.$refs.approvalFormRef.clearValidate())
      })
    },
    onApprovalChange(val) {
      if (val !== 0) {
        this.approvalForm.rejectReason = ''
      }
    },
    handleApprovalConfirm() {
      this.$refs.approvalFormRef.validate(valid => {
        if (!valid) return
        this.approving = true
        if (this.approvalForm.isApproved === 1) {
          approve(this.reviewData.id, 'currentUser').then(() => {
            this.$message.success('审批通过')
            this.reviewVisible = false
            this.fetchData()
          }).finally(() => { this.approving = false })
        } else {
          reject(this.reviewData.id, 'currentUser', this.approvalForm.rejectReason).then(() => {
            this.$message.success('审批已拒绝')
            this.reviewVisible = false
            this.fetchData()
          }).finally(() => { this.approving = false })
        }
      })
    },

    // ============ 批量通过 ============
    handleBatchApprove() {
      if (!this.pendingSelection.length) {
        this.$message.warning('请选择要审批的记录')
        return
      }
      this.$confirm(`确定批量通过选中的 ${this.pendingSelection.length} 条记录吗？`, '批量审批通过', { type: 'warning' }).then(() => {
        const ids = this.pendingSelection.map(item => item.id)
        batchApprove(ids, 'currentUser').then(() => {
          this.$message.success('批量审批通过完成')
          this.pendingSelection = []
          this.fetchData()
        })
      }).catch(() => {})
    },

    // ============ 历史查看 ============
    handleViewHistory(row) {
      getDetail(row.id).then(res => {
        this.historyData = res.data
        this.historyVisible = true
      })
    },

    // ============ 辅助 ============
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
.loan-review-container {
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
.review-detail {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
