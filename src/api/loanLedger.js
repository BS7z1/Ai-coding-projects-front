import request from '@/utils/request'

const BASE_URL = '/api/loan-ledger'

/**
 * 分页查询借据列表
 * @param {Object} queryParams 查询条件
 * @param {Object} page 分页参数 { pageNum, pageSize }
 * @param {String} userId 当前用户工号
 * @param {String} roleType 角色类型 applicant/reviewer
 */
export function queryPage(queryParams, page, userId, roleType) {
  return request({
    url: BASE_URL + '/queryPage',
    method: 'post',
    data: {
      queryParams,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      userId,
      roleType
    }
  })
}

/**
 * 新增借据
 */
export function addLoanLedger(data, userId) {
  return request({
    url: BASE_URL + '/add',
    method: 'post',
    data: {
      dataList: [data],
      userId
    }
  })
}

/**
 * 修改借据
 */
export function updateLoanLedger(data, userId) {
  return request({
    url: BASE_URL + '/update',
    method: 'post',
    data: {
      dataList: [data],
      userId
    }
  })
}

/**
 * 删除借据
 */
export function deleteLoanLedger(id, userId) {
  return request({
    url: BASE_URL + '/delete',
    method: 'post',
    data: {
      ids: [id],
      userId
    }
  })
}

/**
 * 批量删除借据
 */
export function batchDeleteLoanLedger(ids, userId) {
  return request({
    url: BASE_URL + '/batchDelete',
    method: 'post',
    data: {
      ids,
      userId
    }
  })
}

/**
 * 提交复核
 */
export function submitForReview(id, userId) {
  return request({
    url: BASE_URL + '/submit',
    method: 'post',
    data: {
      ids: [id],
      userId
    }
  })
}

/**
 * 批量导入
 */
export function batchImport(dataList, userId) {
  return request({
    url: BASE_URL + '/batchImport',
    method: 'post',
    data: {
      dataList,
      userId
    }
  })
}

/**
 * 导出列表
 */
export function exportList(queryParams, userId, roleType) {
  return request({
    url: BASE_URL + '/export',
    method: 'post',
    data: {
      queryParams,
      userId,
      roleType
    }
  })
}

/**
 * 审批通过
 */
export function approve(id, userId) {
  return request({
    url: BASE_URL + '/approve',
    method: 'post',
    data: {
      ids: [id],
      userId
    }
  })
}

/**
 * 批量审批通过
 */
export function batchApprove(ids, userId) {
  return request({
    url: BASE_URL + '/batchApprove',
    method: 'post',
    data: {
      ids,
      userId
    }
  })
}

/**
 * 审批拒绝
 */
export function reject(id, userId, rejectReason) {
  return request({
    url: BASE_URL + '/reject',
    method: 'post',
    data: {
      ids: [id],
      userId,
      rejectReason
    }
  })
}

/**
 * 校验借据号唯一性
 */
export function checkLoanId(loanId, excludeId) {
  return request({
    url: BASE_URL + '/checkLoanId',
    method: 'post',
    data: {
      dataList: [{ loanId, id: excludeId }]
    }
  })
}

/**
 * 查询借据详情
 */
export function getDetail(id) {
  return request({
    url: BASE_URL + '/detail',
    method: 'post',
    data: {
      ids: [id]
    }
  })
}
