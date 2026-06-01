<template>
  <div class="loan-ledger-container">
    <!-- 查询条件区 -->
    <cb-card shadow="never" class="search-card">
      <query-form
          :key="queryFormKey"
          :table-form="queryTableForm"
          :advanced-default-params="queryForm"
          :label-width="'100px'"
          :label-position="'right'"
          :col-num="3"
          :operators="queryOperators"
          @query="handleQuery"
      />
    </cb-card>

    <!-- 操作栏 + 列表 -->
    <cb-card shadow="never" class="table-card">
      <div class="toolbar">
        <cb-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</cb-button>
        <cb-button icon="el-icon-upload2" @click="handleBatchImport">批量导入</cb-button>
        <cb-button type="danger" icon="el-icon-delete" @click="handleBatchDelete" :disabled="!selection.length">批量删除</cb-button>
        <cb-button icon="el-icon-download" @click="handleExport">导出</cb-button>
      </div>

      <table-data
          :table-heads="tableHeads"
          :table-data="tableData"
          :hide-selection="false"
          :operators="tableOperators"
          :page-sizes="pageSizes"
          :pager="tablePager"
          :param="queryForm"
          @selections="handleSelectionChange"
          @currentChange="handleTableCurrentChange"
          @sizeChange="handleTableSizeChange"
          @showDetail="handleView"
          @editRow="handleTableEdit"
          @deleteRow="handleTableDelete"
          @submitRow="handleTableSubmit"
          @viewRow="handleTableView"
      />
    </cb-card>

    <!-- 新增/编辑弹窗 -->
    <edit-main
        :open="dialogVisible"
        :drawer-size="'680px'"
        :type="editType"
        :edit-para="formData"
        :table-form="editTableForm"
        :edit-save-uri="editSaveUri"
        :add-save-uri="addSaveUri"
        :para-name="'loanLedger'"
        :col-num="1"
        :label-width="'150px'"
        :label-position="'right'"
        @close="dialogVisible = false"
        @save="handleEditMainSave"
    />

    <!-- 查看详情弹窗 -->
    <detail
        :visible="viewVisible"
        :col-num="2"
        :uri="detailUri"
        :params="detailParams"
        :table-heads="detailTableHeads"
        :dialog-width="'680px'"
        :label-width="'120px'"
        :text-width="'160px'"
    />

    <!-- 批量导入弹窗 -->
    <cb-dialog title="批量导入借据" :visible.sync="importVisible" width="600px" :close-on-click-modal="false">
      <div>
        <cb-alert
          title="请使用标准模板导入，单次最多导入 1000 条数据"
          type="info"
          :closable="false"
          style="margin-bottom: 16px"
        />
        <cb-upload
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
        </cb-upload>
      </div>
      <!-- 导入结果 -->
      <div v-if="importResult" style="margin-top: 16px">
        <cb-alert
          :title="`导入完成：成功 ${importResult.successCount} 条，失败 ${importResult.failCount} 条（共 ${importResult.totalCount} 条）`"
          :type="importResult.failCount > 0 ? 'warning' : 'success'"
          :closable="false"
        />
        <cb-table v-if="importResult.failDetails && importResult.failDetails.length" :data="importResult.failDetails" border size="small" style="margin-top: 12px">
          <cb-table-column prop="row" label="行号" width="80" />
          <cb-table-column prop="reason" label="失败原因" show-overflow-tooltip />
        </cb-table>
      </div>
      <div slot="footer">
        <cb-button @click="importVisible = false">关闭</cb-button>
        <cb-button type="primary" @click="handleImportConfirm" :loading="importing">开始导入</cb-button>
      </div>
    </cb-dialog>
    <delete
        :visible="deleteVisible"
        :confirm-info="deleteConfirmInfo"
        :uri="deleteUri"
        :params="deleteParams"
        @refresh="handleDeleteRefresh"
    />
  </div>
</template>

<script>
import {
  queryPage, batchDeleteLoanLedger, submitForReview, exportList, checkLoanId
} from '@/api/loanLedger'

import QueryForm from '@/components/common-v1/QueryForm'
import TableData from '@/components/common-v1/TableData'
import EditMain from '@/components/common-v1/EditMain'
import Detail from '@/components/common-v1/Detail'
import Delete from '@/components/common-v1/Delete'
import { getColumnTypeEnum } from '@/api/app'

export default {
  name: 'LoanLedger',

  components: {
    QueryForm,
    TableData,
    EditMain,
    Detail,
    Delete
  },

  data() {
    const columnType = getColumnTypeEnum()

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
      columnType,

      queryFormKey: 0,

      queryForm: {
        loanId: '',
        companyName: '',
        status: null,
        loanDateRange: null,
        isGreen: null,
        isAgriculture: null
      },

      queryTableForm: [
        {
          dataName: 'loanId',
          showName: '借据号',
          showAdcanced: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          }
        },
        {
          dataName: 'companyName',
          showName: '公司名称',
          showAdcanced: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          }
        },
        {
          dataName: 'status',
          showName: '台账状态',
          showAdcanced: true,
          columnTypeClass: {
            columnType: columnType.TYPE_SELECT,
            list: [
              { label: '草稿', value: 0 },
              { label: '待复核', value: 1 },
              { label: '已通过', value: 2 },
              { label: '已拒绝', value: 3 }
            ]
          }
        },
        {
          dataName: 'loanDateRange',
          showName: '放款日期',
          showAdcanced: true,
          columnTypeClass: {
            columnType: columnType.TYPE_DATE_RANGE
          }
        },
        {
          dataName: 'isGreen',
          showName: '绿色信贷',
          showAdcanced: true,
          columnTypeClass: {
            columnType: columnType.TYPE_SELECT,
            list: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          }
        },
        {
          dataName: 'isAgriculture',
          showName: '涉农',
          showAdcanced: true,
          columnTypeClass: {
            columnType: columnType.TYPE_SELECT,
            list: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          }
        }
      ],

      queryOperators: {
        data: []
      },

      tableHeads: [
        {
          dataName: 'loanId',
          showName: '借据号',
          width: 140,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'companyName',
          showName: '公司名称',
          width: 160,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'creditCode',
          showName: '信用代码',
          width: 150,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'loanAmountText',
          showName: '借据金额（元）',
          width: 140,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'interestRateText',
          showName: '利率',
          width: 90,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'loanDate',
          showName: '放款日期',
          width: 120,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'dueDate',
          showName: '到期日期',
          width: 120,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'isGreenText',
          showName: '绿色信贷',
          width: 100,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'isAgricultureText',
          showName: '涉农',
          width: 80,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'isGuaranteeText',
          showName: '担保',
          width: 80,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'guaranteeOrgText',
          showName: '担保机构',
          width: 140,
          columnTypeClass: { desenseType: 0 }
        },
        {
          dataName: 'statusText',
          showName: '台账状态',
          width: 100,
          columnTypeClass: { desenseType: 0 }
        }
      ],

      tableOperators: {
        width: 220,
        data: [
          [
            { operator: '查看', method: 'viewRow', status: 'canView' },
            { operator: '修改', method: 'editRow', status: 'canEdit' },
            { operator: '删除', method: 'deleteRow', status: 'canDelete' },
            { operator: '提交复核', method: 'submitRow', status: 'canSubmit' }
          ]
        ]
      },
      // TableData 分页大小配置
      pageSizes: [20, 50, 100],

      tableData: [],
      selection: [],
      pagination: { pageNum: 1, pageSize: 20, total: 0 },

      dialogVisible: false,
      dialogTitle: '新增借据',
      isEdit: false,
      saving: false,
      formData: this.getEmptyForm(),

      // EditMain 使用。新增/编辑类型
      editType: '新增',

      // EditMain 使用。假设后端已提供 DWR 风格新增/修改 URI
      //TODO 具体地址要修改
      addSaveUri: '/api/dwr/loan-ledger/add',
      editSaveUri: '/api/dwr/loan-ledger/update',

      // Edit.vue / 编辑公共组件使用的字段配置
      editTableForm: [
        {
          dataName: 'loanId',
          showName: '借据号',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          },
          rule: [
            { required: true, message: '请输入借据号', trigger: 'blur' },
            { validator: validateLoanId, trigger: 'blur' }
          ]
        },
        {
          dataName: 'companyName',
          showName: '公司名称',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          },
          rule: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ]
        },
        {
          dataName: 'creditCode',
          showName: '企业统一信用代码',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          },
          rule: [
            { required: true, message: '请输入信用代码', trigger: 'blur' },
            { validator: validateCreditCode, trigger: 'blur' }
          ]
        },
        {
          dataName: 'loanAmount',
          showName: '借据金额（元）',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          },
          rule: [
            { required: true, message: '请输入借据金额', trigger: 'blur' }
          ]
        },
        {
          dataName: 'interestRate',
          showName: '年利率（%）',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          },
          rule: [
            { required: true, message: '请输入利率', trigger: 'blur' }
          ]
        },
        {
          dataName: 'loanDate',
          showName: '放款日期',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_DATE
          },
          rule: [
            { required: true, message: '请选择放款日期', trigger: 'change' }
          ]
        },
        {
          dataName: 'dueDate',
          showName: '到期日期',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_DATE
          },
          rule: [
            { required: true, message: '请选择到期日期', trigger: 'change' },
            { validator: validateDueDate, trigger: 'change' }
          ]
        },
        {
          dataName: 'isGreen',
          showName: '是否绿色信贷',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_RADIO,
            list: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          },
          rule: [
            { required: true, message: '请选择是否绿色信贷', trigger: 'change' }
          ]
        },
        {
          dataName: 'isAgriculture',
          showName: '是否涉农',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_RADIO,
            list: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          },
          rule: [
            { required: true, message: '请选择是否涉农', trigger: 'change' }
          ]
        },
        {
          dataName: 'isGuarantee',
          showName: '是否有担保',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_RADIO,
            list: [
              { label: '是', value: 1 },
              { label: '否', value: 0 }
            ]
          },
          rule: [
            { required: true, message: '请选择是否有担保', trigger: 'change' }
          ]
        },
        {
          dataName: 'guaranteeOrg',
          showName: '担保机构',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXT
          }
        },
        {
          dataName: 'remark',
          showName: '备注',
          showAdd: true,
          showEdit: true,
          columnTypeClass: {
            columnType: columnType.TYPE_TEXTAREA
          }
        }
      ],

      // Detail.vue 使用。假设后端已提供 DWR 风格详情 URI
      viewVisible: false,
      //TODO 具体地址要修改
      detailUri: '/api/dwr/loan-ledger/detail',
      detailParams: {},
      detailTableHeads: [
        { dataName: 'loanId', showName: '借据号' },
        { dataName: 'companyName', showName: '公司名称' },
        { dataName: 'creditCode', showName: '信用代码' },
        { dataName: 'loanAmount', showName: '借据金额（元）' },
        { dataName: 'interestRate', showName: '年利率' },
        { dataName: 'loanDate', showName: '放款日期' },
        { dataName: 'dueDate', showName: '到期日期' },
        { dataName: 'isGreenText', showName: '绿色信贷' },
        { dataName: 'isAgricultureText', showName: '涉农' },
        { dataName: 'isGuaranteeText', showName: '担保' },
        { dataName: 'guaranteeOrgText', showName: '担保机构' },
        { dataName: 'statusText', showName: '台账状态' },
        { dataName: 'submitBy', showName: '提交人' },
        { dataName: 'submitTime', showName: '提交时间' },
        { dataName: 'reviewBy', showName: '复核人' },
        { dataName: 'reviewTime', showName: '复核时间' },
        { dataName: 'rejectReason', showName: '拒绝原因' },
        { dataName: 'remark', showName: '备注' },
        { dataName: 'createdBy', showName: '创建人' },
        { dataName: 'createdTime', showName: '创建时间' }
      ],

      // Delete.vue 使用。假设后端已提供 DWR 风格删除 URI
      deleteVisible: false,
      deleteConfirmInfo: '',
      //TODO 具体地址要修改
      deleteUri: '/api/dwr/loan-ledger/delete',
      deleteParams: {},

      importVisible: false,
      importFile: null,
      importing: false,
      importResult: null
    }
  },

  computed: {
    tablePager() {
      return {
        currentPage: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        totalRows: this.pagination.total
      }
    }
  },

  methods: {
    handleTableCurrentChange({ currentPage, pageSize }) {
      this.pagination.pageNum = currentPage
      this.pagination.pageSize = pageSize
      this.fetchData()
    },

    handleTableSizeChange({ pageSize }) {
      this.pagination.pageSize = pageSize
      this.pagination.pageNum = 1
      this.fetchData()
    },

    handleTableEdit({ data }) {
      this.handleEdit(data)
    },

    handleTableDelete({ data }) {
      this.handleDelete(data)
    },

    handleTableSubmit({ data }) {
      this.handleSubmit(data)
    },

    handleTableView({ data }) {
      this.handleView(data)
    },

    normalizeTableRow(row) {
      return {
        ...row,
        loanAmountText: this.formatAmount(row.loanAmount),
        interestRateText: row.interestRate == null ? '' : row.interestRate + '%',
        isGreenText: row.isGreen ? '是' : '否',
        isAgricultureText: row.isAgriculture ? '是' : '否',
        isGuaranteeText: row.isGuarantee ? '是' : '否',
        guaranteeOrgText: row.guaranteeOrg || '-',
        statusText: this.getStatusText(row.status),
        canView: row.status !== 0,
        canEdit: row.status === 0 || row.status === 3,
        canDelete: row.status === 0,
        canSubmit: row.status === 0 || row.status === 3
      }
    },

    // ============ 查询 ============
    handleQuery(params) {
      this.queryForm = {
        ...this.queryForm,
        ...params
      }
      this.pagination.pageNum = 1
      this.fetchData()
    },
    handleReset() {
      this.queryForm = {
        loanId: '',
        companyName: '',
        status: null,
        loanDateRange: null,
        isGreen: null,
        isAgriculture: null
      }
      this.queryFormKey += 1
      this.pagination.pageNum = 1
      this.fetchData()
    },
    fetchData() {
      const params = { ...this.queryForm }

      if (params.loanDateRange && params.loanDateRange.length === 2) {
        params.loanDateStart = params.loanDateRange[0]
        params.loanDateEnd = params.loanDateRange[1]
      }

      delete params.loanDateRange

      queryPage(
          params,
          {
            pageNum: this.pagination.pageNum,
            pageSize: this.pagination.pageSize
          },
          'currentUser',
          'applicant'
      ).then(res => {
        this.tableData = (res.data.records || []).map(this.normalizeTableRow)
        this.pagination.total = res.data.total || 0
      }).catch(() => {
        this.tableData = []
        this.pagination.total = 0
      })
    },

    handleSelectionChange(val) {
      this.selection = val
    },

    // ============ 新增 ============
    handleAdd() {
      this.editType = '新增'
      this.dialogTitle = '新增借据'
      this.isEdit = false
      this.formData = this.getEmptyForm()
      this.dialogVisible = true
    },

    // ============ 编辑 ============
    handleEdit(row) {
      this.editType = '编辑'
      this.dialogTitle = '修改借据'
      this.isEdit = true
      this.formData = { ...row }
      this.dialogVisible = true
    },

    // ============ 删除 ============
    handleDelete(row) {
      this.deleteConfirmInfo = row.loanId || row.companyName || row.id
      this.deleteParams = {
        id: row.id,
        operator: 'currentUser'
      }
      this.deleteVisible = !this.deleteVisible
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
      this.detailParams = {
        id: row.id
      }
      this.viewVisible = !this.viewVisible
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
      if (params.loanDateRange && params.loanDateRange.length === 2) {
        params.loanDateStart = params.loanDateRange[0]
        params.loanDateEnd = params.loanDateRange[1]
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
    getStatusText(status) {
      const map = { 0: '草稿', 1: '待复核', 2: '已通过', 3: '已拒绝' }
      return map[status] || '未知'
    },
    formatAmount(val) {
      if (val == null) return ''
      return Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },

    handleDeleteRefresh() {
      this.fetchData()
    },
    handleEditMainSave() {
      this.dialogVisible = false
      this.fetchData()
    },
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