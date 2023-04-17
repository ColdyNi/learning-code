<template>
  <div>
    <!-- 顶端搜索 -->
    <div class="top-panel">
      <el-form :model="searchFormData"
               label-width="50px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="标题" 
                          prop="titleFuzzy">
              <el-input  placeholder="请输入名称" 
                        v-model="searchFormData.titleFuzzy">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" 
                          prop="status">
                <el-select v-model="searchFormData.status"
                           clearable
                           placeholder="请选择状态"
                           :style="{width:'100%'}"> 
                    <el-option :value="0" label="草稿"></el-option>
                    <el-option :value="1" label="已发布"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分类" 
                          prop="status">
                <el-select v-model="searchFormData.categoryId	"
                           clearable
                           placeholder="请选择分类"
                           :style="{width:'100%'}"> 
                     <el-option :value="item.categoryId" 
                                :label="item.categoryName"
                                v-for="item in categoryList">
                    </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :style="{'padding-left':'10px'}">
            <el-button type="danger" @click="loadDataList">搜索</el-button>
            <el-button type="danger" @click="showEdit('add')">新增博客</el-button>
          </el-col>
        </el-row>  
       </el-form>
    </div>
    <!-- 页面主体 -->
    <Table :columns="columns"
           :showPagination="true"
           :dataSource="tableData"
           :fetch="loadDataList"
           :options="tableOptions">
           <!-- 封面 -->
       <template #cover="{index,row}">
            <Cover :cover="row.cover"></Cover>
       </template>   
       <!-- 文章信息 -->
       <template #blogInfo="{index,row}">
            <div>标题：{{ row.title }}</div>
            <div>分类：{{ row.categoryName }}</div>
            <div>作者：{{ row.nickName }}</div>
       </template>   
       <!-- 类型 -->
       <template #typeName="{index,row}">
            <div>类型：{{ row.type==0?'原创':'转载'}}</div>
            <div v-if="row.type==1">转载地址：{{ row.reprintUrl}}</div>
       </template>   
       <!-- 状态 -->
       <template #statusName="{index,row}">
        <span v-if="row.status==1"
              :style="{color:'green'}">{{ row.statusName }}</span>
        <span v-else
              :style="{color:'red'}">{{ row.statusName }}</span>
       </template>  
       <!-- 时间 -->
       <template #time="{index,row}">
           <div>创建时间：{{ row.createTime }}</div>
           <div>更新时间：{{ row.lastUpdateTime }}</div>
       </template>  
       <template #opration="{index,row}">
           <div class="opration">
              <a href="javascript:void(0)" class="a-link" @click="showEdit('update',row)">修改</a>
              <el-divider direction="vertical"></el-divider>
              <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
              <el-divider direction="vertical"></el-divider>
              <a href="javascript:void(0)" class="a-link" @click="changeSort(index,'up')">预览</a>
            </div>       
       </template>
    </Table>
    <Window :show="windowConfig.show"
            :buttons="windowConfig.buttons" 
            @close="closeWindow"></Window>
  </div>
</template>

<script setup>
import { reactive,getCurrentInstance,ref } from "vue";

const {proxy} =getCurrentInstance();

const api={
  "loadCategory":"/category/loadAllCategory4Blog",
  "loadDataList":"/blog/loadBlog",
}
//搜索
const searchFormData=reactive({})
const categoryList=ref([])

const loadCategoryList=async ()=>{
   let result=await proxy.Request({
    url:api.loadCategory
   })
   categoryList.value=result.data;
  }
  loadCategoryList();

// 列表
const columns=[
  {
    label:"封面",
    prop:"cover",
    width:100,
    scopedSlots:"cover"
  },
  {
    label:"文章信息",
    prop:"blogInfo",
    width:180,
    scopedSlots:"blogInfo"
  },
  {
    label:"编辑器",
    prop:"editorTypeName",
    width:120
  },
  {
    label:"类型",
    prop:"typeName",
    width:180,
    scopedSlots:"typeName"
  },
  {
    label:"评论",
    prop:"allowCommentTypeName",
    width:130,
  },
  {
    label:"状态",
    prop:"statusName",
    width:130,
    scopedSlots:"statusName"
  },
  {
    label:"时间",
    prop:"time",
    width:250,
    scopedSlots:"time"
  },
  {
    label:"操作",
    prop:"opration",
    width:150,
    scopedSlots:"opration"
  }
]
const tableData=reactive({})
const tableOptions={
  extHeight:40
}
const loadDataList=async ()=>{
  let params={
    pageNo:tableData.pageNo,
    pageSize:tableData.pageSize
  }
  Object.assign(params,searchFormData)

    let result=await proxy.Request({
      url:api.loadDataList,
      params
    })
    if(!result){
      return
    }
    Object.assign(tableData,result.data)
    // tableData.value=result.data(ref使用)
}
// 富文本编辑器
// 新增、修改
const windowConfig=reactive({
  show:false,
   title:"标题",
   buttons:[
    {
     type:"danger",
     text:"确定",
     click:(e)=>{
       console.log(xx);
      }
    },
  ]
})

const closeWindow=()=>{
  windowConfig.show=false;
  loadDataList()
}

const showEdit=(type,data)=>{
  windowConfig.show=true;
}
</script>

<style lang="scss">

</style>