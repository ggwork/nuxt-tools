<template>
  <!-- json相关的转换 -->
  <div class="json">
    <div class="upload">
      <div class="u-wrap">
        <input type="file" name="file" class="u-file" @change="inputUploadChange" accept=".json" />
        <el-upload
          action=""
          class="upload-item"
          ref="upload"
          accept=".json"
          :limit='1'
          :auto-upload="true">
          <el-button class="upload-btn" slot="trigger" size="small" type="primary">选取json文件<i class="el-icon-upload el-icon--right"></i></el-button>
          <div class="upload-tip" slot="tip">1.只能上传.json文件，超过500k，<span @click="contractMe">点这里</span></div>
          <div class="upload-tip" slot="tip">2.支持转换成csv或者xlsx(Excel)</div>
          <div class="upload-tip" slot="tip">3.当文件和文本框同时存在时，以文本框的内容为主</div>
        </el-upload>
        <div class="u-fileName" v-if="upFile">
          <i class="el-icon-tickets"></i> <span>{{ upFile && upFile.name }}</span> <i class="el-icon-close clear-file"  @click="clearFile"></i>
        </div>
        
      </div>
      <div class="u-wrap-mid">或</div>
      <div class="u-wrap">
        <el-input class="u-textarea" type="textarea" v-model="jsonCont" placeholder="粘贴json"  @input="inputChange"></el-input>
      </div>
    </div>
    <div class="tools">
      <el-button type="primary" :loading="loading" @click="startConvert">开始转换</el-button>
    </div>
    <div class="result"  v-if="tableData.length > 0 || jsonValidateStr ">
      
      <div class="r-title">
        <div class="r-t-t1">转换结果如下：</div>
        
        <div class="r-t-btn" v-if="!jsonValidateStr">
          <el-button type="primary" size="small">下载csv<i class="el-icon-download el-icon--right"></i></el-button>
          <el-button type="primary" size="small">下载xlsx<i class="el-icon-download el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="r-error" v-if="jsonValidateStr">
          {{ jsonValidateStr }}
        </div>
      <div class="r-cont" v-else>
        <el-table 
          :data="tableData"
          border
          max-height="400"
          >
          <el-table-column 
            v-for="title in tableTitleList"
            :prop="title"
            :label="title"
            :key = "title"
            min-width="120"
            >
          </el-table-column>
        </el-table>
      </div>
    </div>  
    <meComponent :showMeComonent="showMeComonent" @closeMeComonent="closeMeComonent"></meComponent>  
  </div>
</template>
<script>
import meComponent from '@/components/me'
export default {
  name:'json',
  layout:'baseLayout',
  components:{
    meComponent
  },
  data(){
    return {
      fileLimitSize:512000, // 500k
      upFile:null,
      jsonCont:'',
      loading:false,
      tableData: [],
      showMeComonent:false,
      jsonValidateStr:``,
      tableTitleList:[],
      loadingHandler:null
    }
  },
  created(){
    // console.log('this.$route:',this.$route)
    let fileLimitSize = this.$route.query.fileLimitSize
    if(fileLimitSize && Number(fileLimitSize)){
      this.fileLimitSize  = fileLimitSize
    }
  },
  methods:{
    changeResDataToTableData(res){
      let titleArr = res.shift()
      this.tableTitleList = titleArr
      return res.map(itemArr=>{
        let temp = {}
        itemArr.forEach((value,index)=>{
          temp[titleArr[index]] = value
        })
        return temp
      })
    },
    contractMe(){
      console.log('showMeComonent:',this.showMeComonent)
      this.showMeComonent = true
    },
    closeMeComonent(){
      this.showMeComonent = false
    },
    clearFile(){
      console.log('clearFile')
      this.upFile = null
    },
      
    inputChange(){
      if(this.jsonCont.length > this.fileLimitSize){
        this.showMeComonent = true
        this.jsonCont = ''
        
      }
    },
    inputUploadChange(event){
      // console.log('inputUploadChange event:',event)
      this.upFile = event.target.files[0]
      
    },
    async uploadFileToServer(){
      let params  = new FormData();
      params.append('file',this.upFile)
      let res = await this.$axios({
        method:'post',
        url:'/api/uploadJsonFile',
        data:params,
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      })
      return res
      
    },
    async uploadJsonContToServer(){
      let res = this.$axios({
        method:'post',
        url:'/api/uploadJsonContToServer',
        data:{jsonCont:this.jsonCont},
      })
      return res  
    },
    async dealRes(res){
      if(res.code === -2){
        this.jsonValidateStr = res.msg
      }else if(res.code === -1){
        this.$message.error(`${res.code}:${res.msg}`)
      }else if(res.code === 0){
        // 返回正确
        this.tableData = this.changeResDataToTableData(res.data.arr)
      }
    },
    closeLoading(){
      this.loadingHandler && this.loadingHandler.close()
    },
    async startConvert(){
      // 校验数据是否合法
      if(!this.upFile && this.jsonCont === ''){
        this.$message.error('转换内容不能为空')
        return
      }
      if(this.upFile && this.upFile.size > this.fileLimitSize){
        this.showMeComonent = true
        return
      }else if(this.jsonCont && this.jsonCont.length > this.fileLimitSize){
        this.showMeComonent = true
        return
      }
      // 清空之前转换的内容
      this.tableData = []
      // 显示loading
      this.loadingHandler = this.$loading({
        lock: true,
        text: '努力请求中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 如果文本框存在内容，则直接判断文本框中的json是否合法。如果文本框有内容且合法，则以文本框内容为主，忽略json文件
      if(this.jsonCont.length > 0){
        try {
            let result = jsonlint.parse(this.jsonCont);
            if (result) {
              // 通过校验后，开始上传文件

              let res = await this.uploadJsonContToServer()
              // console.log('res1:',res)
              this.dealRes(res)
              this.closeLoading()

            }
          } catch(e) {
            this.jsonValidateStr = e.toString()
            console.log('jsonValidateStr:',this.jsonValidateStr)
          }
      }else {
        let res = await this.uploadFileToServer()
        this.dealRes(res)
        this.closeLoading()
        // console.log('res2:',res)
        // if(res.code === -2){
        //   this.jsonValidateStr = res.msg
        // }
        
      }
      
      
      

    }
  }
}
</script>
<style lang="less" scoped>
.json{
  .upload{
    display: flex;
    align-items: top;
    width: 820px;
    margin:auto;
    margin-top: 20px;
    justify-content: space-between;
    @width:390px;
    @height:100px;
    border:1px dashed #555;
    padding:20px;
    .u-wrap{
      width: @width;
      min-height: @height; 
      flex-shrink: 0;
      position: relative;
      .u-file{
        position: absolute;
        top:0;
        left: 0;
        width: 390px;
        height: 100px;
        opacity: 0;
      }
      .upload-item{
        
        .upload-btn{
          width: @width;
          height: @height;
          font-size: 28px;
          pointer-events: none;
        }
        .upload-tip{
          margin-top:12px;
          span{
            color: blue;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .u-fileName{
        color:#606266;
        margin-top: 10px;
        .clear-file{
          cursor: pointer;
          margin-left: 10px;
        }
        span{
          margin-left: 3px;
        }
        &:hover{
          color:#409eff;
        }
      }
      .u-textarea{
        width: @width;
        min-height: @height;
        :deep(.el-textarea__inner){
          width: @width;
          height: @height;
        }
      }
      .u-error{
        color: red;
        margin-top:20px;
      }
    }
    .u-wrap-mid{
      height: @height;
      line-height: @height;
      
    }
  }
  .tools{
    margin-top:40px;
    text-align: center;
  }
  .result{
    margin-top: 20px;
    .r-title{
      display: flex;
      align-items: center;
      .r-t-t1{

      }
      .r-t-btn{
        margin-left:20px;
      }
    }
    .r-error{
      color:red;
      margin-top:20px;
    }
    .r-cont{
      margin: 20px 0px;
    }
  }
  
}
</style>


