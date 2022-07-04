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
          <div class="upload-tip" slot="tip">1.只能上传.json文件，超过1M，<span @click="contractMe">点这里</span></div>
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
    <div class="result">
      
      <div class="r-title">
        <div class="r-t-t1">转换结果如下：</div>
        <div class="r-error" v-if="jsonValidateStr">
          {{ jsonValidateStr }}
        </div>
        <div class="r-t-btn" v-else>
          <el-button type="primary" size="small">下载csv<i class="el-icon-download el-icon--right"></i></el-button>
          <el-button type="primary" size="small">下载xlsx<i class="el-icon-download el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="r-cont">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
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
      fileLimitSize:1048576, // 1m
      upFile:null,
      jsonCont:'',
      loading:false,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      showMeComonent:false,
      jsonValidateStr:''
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
      console.log('inputUploadChange event:',event)
      window.event = event
      this.upFile = event.target.files[0]
      
    },
    async uploadFileToServer(){
      let params  = new FormData();
      params .append('file',this.upFile)
      let res = await this.$axios.post('http://localhost:7003/api/uploadJsonFile',params,{
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })
      return res
    },
    async startConvert(){
      console.log('startConvert:')
      // 校验数据是否合法
      if(!this.upFile && this.jsonCont === ''){
        this.$message.error('转换内容不能为空')
        return
      }
      if(this.upFile.size > this.fileLimitSize || this.jsonCont.length > this.fileLimitSize){
        this.showMeComonent = true
        return
      }
      // 如果文本框存在内容，则直接判断文本框中的json是否合法。否则在服务器端判断
      if(this.jsonCont.length > 0){
        try {
            let result = jsonlint.parse(this.jsonCont);
            if (result) {
              // json合格
              console.log('json合格')
              // 通过校验后，开始上传文件
              let res = await this.uploadFileToServer()
              console.log('res:',res)

            }
          } catch(e) {
            this.jsonValidateStr = e.toString()
            console.log('jsonValidateStr:',this.jsonValidateStr)
          }
      }else {
        let res = await this.uploadFileToServer()
        console.log('res:',res)
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
    .r-cont{
      margin: 20px 0px;
    }
  }
  
}
</style>


