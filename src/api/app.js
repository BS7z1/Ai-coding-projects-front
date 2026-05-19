import request from '@/utils/request'

export function loadAppInfo(){
    return request({
        url: '/api/appinfo',
        method: 'post'
    })
}

export function login(form){
    return request({
        url: '/api/login.do',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'post',
        params: form
    })
}

export function getSessionUser(){
    return request({
        url: '/api/sys/sessionUser',
        method: 'get'
    })
}

export function getSysMethodInfo(code){
    return request({
        url: '/api/sys/sysMethodInfo',
        method: 'get',
        params: code
    })
}

export function validCodeEquals(inputcode){
    let url = '/api/dwrCommonService/validCodeEquals'
    let params = { inputcode: inputcode }
    return sendDwrRequest(url, params)
}
export function validSysUserInfoOldPwd(oldpwd){
    let url = '/api/dwrSysProcessService/validSysUserInfoOldPwd'
    let params = { oldpwd: oldpwd }
    return sendDwrRequest(url, params)
}

export function validSysUserPassword(oldpwd, newpwd){
    let url = '/api/dwrSysProcessService/validSysUserPassword'
    let params = { oldpwd: oldpwd, newpwd: newpwd }
    return sendDwrRequest(url, params)
}

export function validSysUserInfoByUserNameEdit(username){
    let url = '/api/dwrSysProcessService/validSysUserInfoByUserNameEdit'
    let params = { username: username }
    return sendDwrRequest(url, params)
}

export function updateSysUserName(userpwd, username){
    let url = '/api/dwrSysProcessService/updateSysUserName'
    let params = { userpwd: userpwd, username: username }
    return sendDwrRequest(url, params)
}

export function logout(){
    return request({
        url: '/api/checkSession.do',
        method: 'get'
    })
}

export function sendDwrRequest(url, params){
    return request({
        url: url,
        method: 'post',
        params: params,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: [
            function (data) {
                let ret = ''
                for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }
        ],
    })
}

export function byUserIds(id){
    return request({
        url: '/api/dwrSysProcessService/getPermissionLists',
        method: 'post',
        params: id,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function UserMethods(id){
    return request({
        url: '/api/dwrSysProcessService/updateSysUserMethods',
        method: 'post',
        params: id,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function DepartByCode(id){
    return request({
        url: '/api/dwrSysProcessService/listDownDepartByCode',
        method: 'post',
        params: id,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function createPojoAndDao(form){
    return request({
        url: '/api/generateCode/createPojoAndDao',
        method: 'post',
        params: form,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function createDwrAndService(form){
    return request({
        url: '/api/generateCode/createDwrAndService',
        method: 'post',
        params: form,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function createPage(form){
    return request({
        url: '/api/generateCode/createPage',
        method: 'post',
        params: form,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function createCode(form){
    return request({
        url: '/api/generateCode/createCode',
        method: 'post',
        params: form,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export function getColumnTypeEnum(){
    let temp = {
        TYPE_CHECKBOX: 1,
        TYPE_RADIO: 2,
        TYPE_DATE: 3,
        TYPE_SELECT: 4,
        TYPE_TEXT: 5,
        TYPE_TIME: 6,
        TYPE_OTHER: 7,
        TYPE_DATE_TIME: 8,
        TYPE_YEAR_MONTH: 9,
        Type_ReadOnly: 10,
        Type_ReadOnly_DATE: 11,
        TYPE_FILE: 12,
        TYPE_CASCADE: 13,
        TYPE_YEAR: 14,
        TYPE_SWITCH: 15,
        TYPE_DATE_RANGE: 16,
        TYPE_DATE_TIME_RANGE: 17,
        TYPE_TIME_RANGE: 18,
        TYPE_DATE_MONTH_NO_UNDERLINE: 19,
        TYPE_TEXT_AREA: 20,
        TYPE_TEXTAREA: 21,
    }
    return temp
}

export function formExport(url, method, params){
    let hiddenForm = document.createElement('form')
    hiddenForm.type  = 'hidden'
    hiddenForm.method = method
    hiddenForm.action = url
    if((typeof params !== 'undefined') && (Object.keys(params).length > 0)){
        for (const key in params) {
            let input = document.createElement('input')
            input.name = key
            input.value = params[key]
            hiddenForm.appendChild(input)
        }
    }
    let rms = document.createElement('input')
    rms.name = 'rms'
    rms.value = '1'
    hiddenForm.appendChild(rms)
    document.body.appendChild(hiddenForm)
    hiddenForm.submit()
}

export function importFile (url, params){
    return request({
        url: url,
        method: 'post',
        params: params,
        headers:{'Content-Type': 'multipart/form-data'}
    })
}

export function getDesenseTypeEnum(){
    let temp = {
        TYPE_CERID: 1, // 证件号
        TYPE_NAME: 2, // 用户名或姓名
        TYPE_CARDNO: 3, // 银行卡号
        TYPE_MOBILE: 4, // 手机号
        TYPE_ADDRESS: 5, // 地址
        TYPE_DEFAULT: 6, // 默认地址
        TYPE_UNDESENSE: 0 // 不脱敏
    }
    return temp
}