<template>
  <div class="cmain">
    
    <div class="upload">
      <div class="u-wrap">
        <input ref="originFileInput" type="file" name="file" class="u-file" @change="inputUploadChange" accept=".csv" size="1"/>
        <el-upload
          action=""
          class="upload-item"
          ref="upload"
          :limit='1'
          :auto-upload="true">
          <el-button class="upload-btn" slot="trigger" size="small" type="primary">选取csv文件<i class="el-icon-upload el-icon--right"></i></el-button>
          <div class="upload-tip" slot="tip">1.支持上传单个.csv文件(免费)</div>
          <div class="upload-tip" slot="tip">2.支持上传.zip文件，批量转csv文件（收费）。批量转<span @click="contractMe">点这里</span></div>
          <div class="upload-tip" slot="tip">3.为了服务器安全，一次性上传数据不要超过{{fileLimitSize_m}}m，大于{{fileLimitSize_m}}m可以<span @click="contractMe">点这里</span></div>
        </el-upload>
        <div class="u-fileName" v-if="upFile">
          <i class="el-icon-tickets"></i> <span>{{ upFile && upFile.name }}</span> <i class="el-icon-close clear-file"  @click="clearFile"></i>
        </div>
      </div>
    </div>
    <div class="tools">
      <el-button type="primary" :loading="loading" @click="startConvert">开始转换</el-button>
    </div>
    <meComponent :showMeComonent="showMeComonent" @closeMeComonent="closeMeComonent"></meComponent>  
  </div>
</template>
<script>
import meComponent from '@/components/me'
export default {
  layout:'baseLayout',
  components:{
    meComponent
  },
  data(){
    return {
      showMeComonent:false,
      upFile:'',
      loading:false,
      fileLimitSize_m:50, // 50m大小
      fileLimitSize_bit:52428800 // 50m大小
    }
  },
  created(){
    this.fileLimitSize_bit = this.fileLimitSize_m * 1048576
  },
  methods:{
    clearFile(){
      console.log('clearFile')
      this.upFile = null
      this.$refs.originFileInput.value = ''
    },
    inputUploadChange(event){
      // console.log('inputUploadChange event:',event)
      this.upFile = event.target.files[0]
      
    },
    async startConvert(){
      // 校验数据是否合法
      if(!this.upFile){
        this.$message.error('转换内容不能为空')
        return
      }
      if(this.upFile && this.upFile.size > this.fileLimitSize_bit){
        this.$message.error(`为了服务器安全，一次性上传数据，不要超过${this.fileLimitSize_m}M`)
        return
      }
      this.loading = true
      // 上传到服务器
      let params  = new FormData();
      params.append('file',this.upFile)
      let res = await this.$axios({
        method:'post',
        url:'/api/csvToJson',
        data:params,
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      })
      if(res.code === 0){
        this.$message.success('转换成功，稍后文件会自动下载')
        this.downFile(res.data.url,res.data.originFileName)
      }else{
        this.$message.error('转换失败，请联系管理员v：guo330504')
      }
      this.loading = false

    },
    downFile(url,fileName){
      const el = document.createElement('a');
      el.style.display = 'none';
      el.setAttribute('target', '_blank')
      el.setAttribute('download', 'fileName')
      
      el.href = url;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      console.log('url:',url)
      console.log('fileName:',fileName)
    },
    contractMe(){
      console.log('showMeComonent:',this.showMeComonent)
      this.showMeComonent = true
    },
    closeMeComonent(){
      this.showMeComonent = false
    },
  }
}
</script>

<style lang="less" scoped>
.cmain{
  width: 1200px;
  
  .ctitle{
    marin-top:30px;
    text-align: center;

    
  }
  .upload{
    display: flex;
    align-items: top;
    width: 820px;
    margin:auto;
    margin-top: 20px;
    justify-content: space-between;
    border:1px dashed #555;
    padding:20px;
    @cWidth:390px;
    @cHeight:100px;
    .u-wrap{
      width: inherit;
      min-height: @cHeight; 
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
          width: @cWidth;
          height: @cHeight;
          font-size: 28px;
          pointer-events: none;
          text-align: center;
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
    }
   
  }
  .tools{
    margin-top:40px;
    text-align: center;
  }
  .result{
    margin:auto;
    margin-top: 20px;
    width: 1200px;
  
    .r-title{
      display: flex;
      align-items: center;
      .r-t-t1{

      }
      .r-t-btn{
        margin-left:20px;
      }
    }
    .r-tip{
      margin-top: 20px;
      font-size: 12px;
      color: red;
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
