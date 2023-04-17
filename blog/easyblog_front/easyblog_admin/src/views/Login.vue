<template>
  <div class="login-body">
    <div class="login-box">
      <div class="login-title">用户登录</div>
       <el-form :model="formData" 
                :rules="rules"
                ref="formDataRef">
          <el-form-item prop="account">
            <el-input  placeholder="请输入账号" v-model="formData.account">
              <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input  type="password" 
                       placeholder="请输入密码" 
                       v-model="formData.password">
              <template #prefix>
               <span class="iconfont icon-password"></span>
            </template>
            </el-input>
          </el-form-item>
          <div class="check-code-box">
            <el-form-item prop="checkCode">
             <el-input  placeholder="请输入验证码" v-model="formData.checkCode" class="check-code-input" @keyup.enter="login"/>
              <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode">
            </el-form-item>
          </div>
          
          <el-form-item class="rememberMe"> 
            <el-checkbox  v-model="formData.rememberMe" :label="1" >记住我</el-checkbox>
          </el-form-item>
          <el-form-item label="" class="login">
            <el-button :style="{align:'center'}" style="width:100%" @click="login">登录</el-button>
          </el-form-item>
       </el-form>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, reactive, ref} from "vue"
import md5 from 'js-md5'
import VueCookies from 'vue-cookies'
import { useRouter } from "vue-router";

const {proxy} = getCurrentInstance()
const router=useRouter()

  //  表单校验
  const api={
    checkCode:"api/checkCode",
    login:"login"
  }

  const formDataRef=ref()
  const checkCodeUrl=ref(api.checkCode);

  //  点击验证码更新
  const changeCheckCode=()=>{
    checkCodeUrl.value=api.checkCode+"?"+new Date().getTime()
   }

  const formData=reactive({})

  //  表单校验
  const rules={
    account:[{
      required:true,
      message:"请输入用户名",
    }],
    password:[{
      required:true,
      message:"请输入密码",
    }],
    checkCode:[{
      required:true,
      message:"请输入验证码",
    }]
  }

const init=()=>{
   const loginInfo=VueCookies.get("loginInfo")
   if(!loginInfo){
    return
   }
   Object.assign(formData,loginInfo)

}
init()

  const login=()=>{
    formDataRef.value.validate(async(valid)=>{
      if(!valid){
         return 
      }
      let cookieLoginInfo=VueCookies.get("loginInfo")
      let cookiePassword=cookieLoginInfo==null?null:cookieLoginInfo.password
      if(formData.password!==cookiePassword){
        formData.password=md5(formData.password)
      }

      let params={
        account:formData.account,
        password:formData.password,
        checkCode:formData.checkCode
      }
      let result =await proxy.Request({
        url:api.login,
        params:params,
        errorCallback:()=>{
          changeCheckCode()
        }
      })
      if(!result){
        return
      }

      proxy.Message.success("登录成功")

      setTimeout(()=>{
        router.push("/")
      },1000)
      const loginInfo={
        account:params.account,
        password:params.password,
        rememberMe:formData.rememberMe
      }

      VueCookies.set("userInfo",result.data,0)//永不过期
      if(formData.rememberMe==1){
        VueCookies.set("loginInfo",loginInfo,"7d")//保存7天
      }
    })
  }
</script>

<style lang="scss">
.login-body{
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url(../assets/login-bg.jpg);
  position: relative;
}
.login-box{
  position: absolute;
  margin-top: 14%;
  opacity: 0.8;
  width: 30%;
  // float:none;
  margin-left:35%;
  padding: 20px;
  background: rgb(255,255,255,0.8);
  border-radius: 5px;
  box-shadow: 2px 2px 10px #ddd;
  .login-title{
    font-size: 18px;
    text-align: center;
    margin-bottom: 10px;
  }
  .check-code-box{
    // display: flex;
    .check-code-input{
      width:50%;
      // flex:30%;
    }
    .check-code{
      // margin:10px；
      margin-left: 20px;
    }
  }
}
</style>