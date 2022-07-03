<template>
  <!-- json相关的转换 -->
  <div class="json">
    <div class="upload">
      <div class="u-wrap">
        <el-upload
          class="upload-item"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          accept=".json"
          @click.native="fileClick"
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload"
          :limit='1'
          :auto-upload="false">
          <el-button class="upload-btn" slot="trigger" size="small" type="primary">选取json文件<i class="el-icon-upload el-icon--right"></i></el-button>
          <div class="upload-tip" slot="tip">1.只能上传.json文件，超过1M，<span @click="contractMe">点这里</span></div>
          <div class="upload-tip" slot="tip">2.支持转换成csv或者xlsx(Excel)</div>
          <div class="upload-tip" slot="tip">3.当文件和文本框同时有内容是，以文件为主</div>
        </el-upload>
      </div>
      <div class="u-wrap-mid">或</div>
      <div class="u-wrap">
        <el-input class="u-textarea" type="textarea" v-model="jsonCont" placeholder="粘贴json" ></el-input>
      </div>
    </div>
    <div class="tools">
      <el-button type="primary" :loading="loading" @click="startConvert">开始转换</el-button>
    </div>
    <div class="result">
      
      <div class="r-title">
        <div class="r-t-t1">转换结果如下：</div>
        <div class="r-t-btn">
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
      fileList:[],
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
      showMeComonent:false
    }
  },
  methods:{
    contractMe(){
      this.showMeComonent = true
    },
    closeMeComonent(){

      this.showMeComonent = false
    },
    
    fileClick(event){
      // console.log('fileClick:',event)
      this.$refs.upload.clearFiles()
    },
    beforeUpload(file){
      console.log('file:',file)
      if(file.size > this.fileLimitSize){
        this.showMeComonent = true
        this.fileList = []
        return false
      }
    },
    uploadExceed(file,fileList){
      // console.log('uploadExceed file:',file)
      // console.log('uploadExceed fileList:',fileList)
      this.$message.warning('一次只能上传一个json文件。请先清除上一个文件。')
    },

  
    uploadSuccess(response, file, fileList){
      console.log('response:',response)
      console.log('file:',file)
      console.log('fileList:',fileList)
    },
    uploadError(err, file, fileList){
      this.$message.error('上传失败：',JSON.stringify(err))
      console.log('err')
    },
    startConvert(){
      console.log('开始转换')
      if(this.fileList.length === 0 && this.jsonCont === ''){
        this.$message.error('转换内容不能为空')
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
      .upload-item{
     
        .upload-btn{
          width: @width;
          height: @height;
          font-size: 28px;
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
      .u-textarea{
        width: @width;
        min-height: @height;
        /deep/ .el-textarea__inner{
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


