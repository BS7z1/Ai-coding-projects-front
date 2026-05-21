<template>
    <cb-form
        v-if="tableForm!=null && tableForm.length>0"
        :inline="true"
        ref="form"
        :model="advancedParamModels"
        :rules="rules"
        class="demo-form-inline"
        :label-width="labelWidth"
        :label-position="labelPosition"
    >
      <cb-row v-for="(formItems, index) in formObj" :key="index">
        <cb-col :span="24/colNum" v-for="(formItem, index) in formItems" :key="index">
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_CHECKBOX"
          >
            <cb-checkbox-group v-model="advancedParamModels[formItem.dataName]" @change="change(formItem, $event)">
              <template v-for="(checkbox) in formItem.columnTypeClass.list">
                <cb-checkbox
                  v-for="(option, index) in formItem.columnTypeClass.options"
                  :key="checkbox.label"
                  :label="checkbox.value"
                  :checked="checkbox.isChecked"
                >
                {{ checkbox.label }}
                </cb-checkbox>
              </template>
            </cb-checkbox-group>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_RADIO"
          >
            <cb-radio-group v-model="advancedParamModels[formItem.dataName]" @change="change(formItem, $event)">
              <template v-for="(radio) in formItem.columnTypeClass.list">
                <cb-radio
                  :key="radio.label"
                  :label="radio.value"
                  :checked="radio.isChecked"
                >
                </cb-radio>
              </template>
            </cb-radio-group>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_DATE"
          >
            <cb-date-picker 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             type="date"
             value-format="yyyy-MM-dd"
             format="yyyy-MM-dd"
             placeholder="选择日期"
            ></cb-date-picker>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_SELECT"
          >
            <cb-select 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             filterable
             clearable
             placeholder="请选择"
            >
              <template v-for="option in formItem.columnTypeClass.list">
                <cb-option
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                  :selected="option.isChecked"
                ></cb-option>
              </template>
            </cb-select>
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_TEXT"
          >
            <cb-input v-model="advancedParamModels[formItem.dataName]" @change="change(formItem, $event)" clearable placeholder="请输入"></cb-input>
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_TIME"
          >
            <cb-time-picker 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             value-format="HH:mm:ss"
             format="HH:mm:ss"
             placeholder="选择时间"
            ></cb-time-picker> 
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_DATE_TIME"
          >
            <cb-date-picker
             type="datetime"
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             value-format="yyyy-MM-dd HH:mm:ss"
             format="yyyy-MM-dd HH:mm:ss"
             placeholder="选择日期时间"
            ></cb-date-picker> 
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_YEAR_MONTH"
          >
            <cb-date-picker
             type="month"
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             value-format="yyyy-MM-dd"
             format="yyyy-MM"
             placeholder="选择年月"
            ></cb-date-picker> 
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.Type_ReadOnly"
          >
            <cb-input v-model="advancedParamModels[formItem.dataName]" @change="change(formItem, $event)" clearable placeholder="请输入内容"></cb-input>
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.Type_ReadOnly_DATE"
          >
            <cb-date-picker 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             type="date"
             value-format="yyyy-MM-dd"
             format="yyyy-MM-dd"
             placeholder="选择日期"
            ></cb-date-picker>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_CASCADE"
          >
            <cb-cascader
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             filterable
             clearable
             placeholder="请选择"
             :options="formItem.columnTypeClass.list"
            ></cb-cascader>
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_YEAR"
          >
            <cb-date-picker 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             type="date"
             value-format="yyyy-MM-dd"
             format="yyyy"
             placeholder="选择年月"
            ></cb-date-picker>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_SWITCH"
          >
            <cb-switch
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             active-color="#D7000F"
             inactive-color="#D6D6D6"
             :active-text="formItem.columnTypeClass.active.text"
             :active-value="formItem.columnTypeClass.active.value"
             :inactive-text="formItem.columnTypeClass.inActive.text"
             :inactive-value="formItem.columnTypeClass.inActive.value"
            ></cb-switch>
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_BEGIN_TIME_RANGE"
          >
            <cb-date-picker 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             type="datetimerange"
             value-format="yyyy-MM-dd HH:mm:ss"
             format="yyyy-MM-dd HH:mm:ss"
             range-separator="至"
             start-placeholder="开始日期"
             end-placeholder="结束日期"
            ></cb-date-picker>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_DATE_RANGE"
          >
            <cb-date-picker 
             v-model="advancedParamModels[formItem.dataName]" 
             @change="change(formItem, $event)"
             type="daterange"
             value-format="yyyy-MM-dd"
             format="yyyy-MM-dd"
             range-separator="至"
             start-placeholder="开始日期"
             end-placeholder="结束日期"
            ></cb-date-picker>    
          </cb-form-item>
          <cb-form-item
           :key="getLastFiledName(formItem.dataName)"
           :label="formItem.showName"
           :prop="getLastFiledName(formItem.dataName)"
           v-else
          >
            <cb-input v-model="advancedParamModels[formItem.dataName]" @change="change(formItem, $event)" clearable placeholder="请输入内容"></cb-input>
          </cb-form-item>
        </cb-col>
      </cb-row>
      <template v-if="operators!==undefined && operators!==null && operators.data!==undefined && operators.data.length!=0">
        <cb-row
            v-for="(operatorArray, index) in operators.data"
            :key="'operatorArray'+ index"
            :span="24"
            type="flex"
            justify="space-around"
            class="row-bg"
            style=""margin-bottom: 2px;
        >
          <template v-if="index===0">
            <template v-if="operators.sousuo!==undefined && operators.sousuo!==null && operators.sousuo.disable">
            </template>
            <template v-else>
                <cb-col :span="2">
                    <template v-if="operators.sousuo!==undefined && operators.sousuo!==null && operators.sousuo.name!=undefined && operators.sousuo.name!=null">
                        <cb-button type="primary" @click="onSubmit()" size="medium">{{operators.sousuo.name}}</cb-button>
                    </template>
                    <template v-else>
                        <cb-button type="primary" @click="onSubmit()" size="medium">搜索</cb-button>
                    </template>
                </cb-col>
            </template>
            <template v-if="operators.qingkong!==undefined && operators.qingkong!==null && operators.qingkong.disable">
            </template>
            <template v-else>
                <cb-col :span="2">
                    <template v-if="operators.qingkong!==undefined && operators.qingkong!==null && operators.qingkong.name!=undefined && operators.qingkong.name!=null">
                        <cb-button type="primary" @click="resetForm('form')" size="medium">{{operators.qingkong.name}}</cb-button>
                    </template>
                    <template v-else>
                        <cb-button type="primary" @click="resetForm('form')" size="medium">清空</cb-button>
                    </template>
                </cb-col>
            </template>
          </template>
          <cb-col v-for="(operator, ind) in operatorArray" :key="index+','+ind" :span="operator.width===undefined?2:operator.width">
            <cb-button
             v-if="operator.operator!==undefined"
             size="medium"
             @click="handleOperator(operator.method, operator.param)"
            >{{ operator.operator }}</cb-button>
          </cb-col>
        </cb-row>
      </template>
      <template v-else>
        <cb-row type="flex" justify="center" :span="24">
            <cb-col :span="2">
                <cb-button type="primary" @click="onSubmit()" size="medium">搜索</cb-button>
            </cb-col>
            <cb-col :span="2">
                <cb-button @click="resetForm('form')" size="medium">清空</cb-button>
            </cb-col>
        </cb-row>
      </template>
    </cb-form>
</template>
<script>
import {getColumnTypeEnum} from '@api/app.js'
export default{
    name: 'query-form',
    props: [
        'tableForm',
        'labelWidth',
        'labelPosition',
        'colNum',
        'operators',
        'advancedDefaultParams',
        'reloadDataNames'
    ],
    data(){
        return {
            advancedParamModels: {},
            columnTypeEnum: getColumnTypeEnum(),
            rules: {},
            formObj: []
        }
    },
    created: function(){
        if(this.advancedDefaultParams!=null){
            let json = JSON.stringify(this.advancedDefaultParams)
            let copy = JSON.parse(json)
            let len = this.tableForm.length
            for(let i=0;i<len;i++){
                let dataName = this.tableForm[i].dataName
                this.$set(this.advancedParamModels, dataName, copy[dataName])
            }
            for(let ind in this.tableForm){
                if(this.tableForm[ind].queryRule){
                    this.rules[this.tableForm[ind].dataName] = this.tableForm[ind].queryRule
                }
            }
            let forms = []
            let form = []
            let i = 0
            for(let ind in this.tableForm){
                if(!this.tableForm[ind].showAdcanced){continue}
                i+=1
                form.push(this.tableForm[ind])
                if(this.colNum === i){
                    forms.push(form)
                    form = []
                    i = 0
                }
            }
            if(form !== []){
                forms.push(form)
            }
            this.formObj = forms
        }
    },
    watch: {
        reloadDataNames(){
            if(this.reloadDataNames!==undefined && this.reloadDataNames.length>0){
                for(let i=0; i<this.reloadDataNames.length; i++){
                    let dataName = this.reloadDataNames[i]
                    if(this,this.advancedParamModels[dataName] instanceof Array){
                        this.advancedParamModels[dataName] = []
                    }else{
                        this.advancedParamModels[dataName] = ''
                    }
                }  
            }
        }
    },
    methods:{
        getLastFiledName(valueStr){
            let theStr = valueStr
            let valueStrs = theStr.split('.')
            if(valueStrs.length>1){
                theStr = valueStrs[valueStrs.length-1]
            }
            return theStr
        },
        change(formItem, event){
            this.$emit('change', {formItem:formItem, event:event})
        },
        onSubmit(){
            this.$refs['form'].validate((valid)=>{
                if(valid){
                    this.$emit('query', this.getEmitForm())
                }else{
                    return false
                }
            })
        },
        getEmitForm(){
            let len = this.tableForm.length
            let tempFormModel = {}
            for(let i=0; i<len; i++){
                let temp = this.tableForm[i]
                let tempArr = temp.dataName.split('-')
                let tempArrLen = tempArr.length
                if(tempArrLen>1){
                    let tempObj = tempFormModel
                    for(let i=0; i<tempArrLen; i++){
                        if(tempObj[tempArr[i]]===undefined){
                            if(i < tempArrLen-1){
                                tempObj[tempArr[j]] = {}
                            }else{
                                tempObj[tempArr[j]] = this.advancedParamModels[temp.dataName]
                            }
                        }
                        tempObj = tempObj[tempArr[i]]
                    }
                }else{
                    tempFormModel[temp.dataName] = this.advancedParamModels[temp.dataName]
                }
            }
            return tempFormModel
        },
        resetForm(form){
            this.$refs[form].resetFields()
        },
        handleOperator(method, param=''){
            this.$refs['form'].validate((valid)=>{
                if(valid){
                    this.$emit(method, {data:this.getEmitForm(), param:param})
                }else{
                    return false
                }
            })
        },
        getRealObj(obj, name){
            let nameArr = name.split('.')
            let len = nameArr.length
            let tempObj = obj
            for(let i=0; i<len; i++){
                tempObj = tempObj[nameArr[i]]
            }
            return tempObj
        }
    }
}
</script>
<style>
</style>