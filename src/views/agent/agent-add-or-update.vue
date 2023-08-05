<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '130px' : '130px'">
      <el-form-item label="代理账号：" prop="uname">
        <el-input v-model="dataForm.uname" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="pwd">
        <el-input v-model="dataForm.pwd" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="任务奖金：" prop="unitPrice">
        <el-input v-model="dataForm.unitPrice" placeholder="任务单价"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        agentCode: '',
        uname: '',
        unitPrice: '',
        balance: '',
        totalWithdrawal: '',
        teamCount: '',
        teamTotalTask: '',
        teamTotalWithdrawal: '',
        status: '',
        pwd: '123456',
        withdrawalPwd: '',
        name: '',
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        birthday: '',
        createDate: '',
        updateDate: '',
        creator: '',
        remark: '',
        firstIp: '',
        version: '',
      }
    }
  },
  computed: {
    dataRule () {
      return {
        uname: [{ required: true, message: '请输入代理账号', trigger: 'change' }],
        unitPrice: [{ required: true, message: '请输入任务单价', trigger: 'change' }]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/agent/agent/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataForm.pwd = ''
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (!this.dataForm.pwd) delete this.dataForm.pwd
        this.$http[!this.dataForm.id ? 'post' : 'put']('/agent/agent/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
