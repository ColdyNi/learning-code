<template>
   <div class="layout">
    <el-container>
      <el-header class="header">
        <div class="logo">AdminBlog</div>
        <div class="user-info">
            <span>欢迎回来！</span>

            <el-dropdown>
                <span class="el-dropdown-link">
                 {{ userInfo.nickName }}
                 <span class="iconfont icon-down"></span>    
               </span>
                
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div class="avatar">
                <img :src="userInfo.avatar">
            </div>

        </div>
      </el-header>
      <el-container  class="container">
        <el-aside class="aside">
            <div>
                <el-button class="post-btn">发布</el-button>
            </div>

            <div class="menu">
                <ul>
                <li v-for="(menu,index) in menuList">
                    <span class="menu-total" @click="openClose(index)">
                        <span :class="['iconfont',menu.icon]"></span>
                        <span class="menu-title" >{{ menu.title }}</span>
                        <span :class="['iconfont','open-close',menu.open?'icon-up':'icon-down']"></span>
                    </span>
                 
                  <ul class="sub-menu" v-if="menu.open">
                    <li v-for="subMenu in menu.children">
                       <router-link :to="subMenu.path" 
                                    :class="['sub-menu-item',activePath==subMenu.path?
                                    'active':'']"
                                    >{{ subMenu.title }}</router-link>
                    </li>
                 </ul>
                </li>  
            </ul>
            </div>
        </el-aside>
        <el-main class="main">
            <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, watch} from "vue"
import VueCookies from 'vue-cookies'
import {useRoute,useRouter} from 'vue-router'

const router=useRouter()
const route=useRoute()
const {proxy}=getCurrentInstance()
const menuList=ref([
    {
        title:"博客",
        icon:"icon-blog",
        open:true,
        children:[
            {
                title:"博客管理",
                path:"/blog/list",
            },
            {
                title:"分类管理",
                path:"/blog/category"
            }
        ]
    },
    {
        title:"专题",
        icon:"icon-specil",
        open:true,
        children:[{
        title:"专题管理",
        path:"/special/category",
        }
        ]
    },
    {
        title:"设置",
        icon:"icon-setting",
        open:true,
        children:[
            {
                title:"个人信息设置",
                path:"/setting/my"
            },
            {
                title:"博客成员",
                path:"/setting/user"
            },
            {
                title:"系统设置",
                path:"/setting/sysSetting",
                roleType:1
            }
        ]
    },
    {
        title:"回收站",
        icon:"icon-delete",
        open:true,
        children:[
            {
                title:"回收站",
                path:"/recovery/list"
            }
        ]
    }
]);

// 二级导航（拉上、拉下）
const openClose=(index)=>{
    const open=menuList.value[index].open
    menuList.value[index].open=!open
}

// 导航栏最右边登录信息
const userInfo=ref({})

const init=()=>{
    userInfo.value=VueCookies.get("userInfo")
    userInfo.value.avatar=proxy.globalInfo.imageUrl+userInfo.value.avatar
}
init()

const activePath=ref(null)
watch(route,(newVal,oldVal)=>{
    activePath.value=newVal.path
},{immediate:true,deep:true})

</script>

<style lang="scss">
.layout{
    .header{
        background-color: #2d3436;
        display:flex;
        align-items: center;
        justify-content: space-between;
        .logo{
            color:white;
            font-size: 26px;
        }
        .user-info{
            color:white;
            display: flex;
            align-items: center;
            .el-dropdown-link {
                cursor: pointer;
                color: white;
            }
            .avatar{
                margin-left: px;
                width:50px;
                img{
                    border-radius: 25px;
                    width:100%;
                }
            }
        }
        
    }
    .container{
        background-color: #dfe6e9;
        height: calc(100vh - 60px);
        .aside{
            background-color:#b2bec3 ;
            width: 250px;
            padding:10px 5px 0 5px;
            .post-btn{
                background: #16a085;
                // background: #c0392b;红色按钮
                color:white;
                width:100%;
                height: 40px;
            }
            .menu{
                ul,li{
                    padding: 0;
                    margin: 0;
                    list-style: none;
                } 
                .menu-total{
                    border-radius: 3px;
                    margin: 5px 0 5px 0;
                    line-height: 40px;
                    cursor: pointer;
                    display: flex;
                    .iconfont{
                        color:#2d3436
                    }
                    .iconfont:hover{
                        color: white;
                    }
                    .menu-title{
                    flex:1;
                    margin-left: 8px;
                    }
                    .open-close{
                    width:20px 
                    } 
                }
                .menu-total:hover{
                        background-color: #dfe6e9;
                    }
                .sub-menu{
                    padding-left: 24px;
                    font-size: 14px;
                    .sub-menu-item{
                        display: block;
                        padding: 0 0 0 10px;
                        border-radius: 3px;
                        line-height: 30px;
                        cursor: pointer;
                        text-decoration: none;
                        color:#2d3436;
                    }
                    .sub-menu-item:hover{
                        background-color: #dfe6e9;
                    }
                    .active{
                        background-color: #dfe6e9;
                    }
                } 
            }
        }
        .main{
            position: relative;
            // background: #fff;
            padding:20px 10px 10px 10px;        }
    }
}
</style>       