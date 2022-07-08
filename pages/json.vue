<template>
  <!-- json相关的转换 -->
  <div class="json">
    <div class="upload">
      <div class="u-wrap">
        <input ref="originFileInput" type="file" name="file" class="u-file" @change="inputUploadChange" accept=".json" />
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
    <div class="result"  v-if="tableData.length > 0 || jsonValidateStr">
      
      <div class="r-title">
        <div class="r-t-t1">转换结果如下：</div>
        
        <div class="r-t-btn" v-if="!jsonValidateStr">
          <el-button type="primary" size="small" :loading="csvLoading"  @click="downCsvFile()">下载csv<i class="el-icon-download el-icon--right"></i></el-button>
          <el-button type="primary" size="small" :loading="excelLoading"  @click="downExcelFile()">下载xlsx<i class="el-icon-download el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="r-tip" v-if="tableData.length > 0">
        当数据超过1000行的时候,为了提升性能，1000行后的数据将不再显示。需要查看的话，可以下载CSV或者EXCEL，推荐EXCEL。
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
import * as XLSX from 'xlsx/xlsx.mjs'
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
      loadingHandler:null,
      resJsonArr:null,
      csvLoading:false,
      excelLoading:false,
      downloadTimeHandler:''
      
      // csvUrl:'',
      // excelUrl:''
    }
  },
  created(){
    // console.log('process.env.baseUrl:',process.env.baseUrl)
    let fileLimitSize = this.$route.query.fileLimitSize
    if(fileLimitSize && Number(fileLimitSize)){
      this.fileLimitSize  = fileLimitSize
    }
  },
  computed:{
    today(){
      let date = new Date()
      return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
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
    downFile(url,fileName){
      const el = document.createElement('a');
      el.style.display = 'none';
      el.setAttribute('target', '_blank')
      
      el.href = url;
      el.download = fileName
      document.body.appendChild(el);
      el.click();
      
      document.body.removeChild(el);
      // this.excelLoading = false
      console.log('this.downloadTimeHandler:',this.downloadTimeHandler)
      if(this.downloadTimeHandler){
        
        window.clearTimeout(this.downloadTimeHandler)
      }
      this.downloadTimeHandler = setTimeout(()=>{
        this.excelLoading = false
        this.csvLoading = false  
      },2000)
    },
    randomStr(){
      let str = Math.random().toString(36).slice(2, 10)
      return str
    },
    getFileUrlByContent(textArray,fileName,mimeType){
      let file = new File(textArray, fileName, {type: mimeType})
      return URL.createObjectURL(file)
    },
    async downCsvFile(){
      if(!this.resJsonArr){
        this.$message.error('json不能为空，请先转换，再下载')
        return
      }
      this.csvLoading = true
      // 将jsonArray数据转成csv数据
      let cont = this.resJsonArr.map(iArr=>{
        return iArr.join(',')
      })
      cont = '\uFEFF'+cont.join('\n')
      let fileName = this.today + '-' + this.randomStr()+'.csv'
      let url = this.getFileUrlByContent([cont],fileName,'text/csv')
      this.downFile(url,fileName)

      // let res = await this.$axios({
      //   method:'post',
      //   url:'/api/uploadFileToOss',
      //   data:{
      //     fileName,
      //     cont
      //   }
      // })
      // if(res.code === 0){
      //   this.downFile(res.data)
      // }else {
      //   this.$message.error(`请求失败,${res.msg}`)
      // }
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    sheet2blobUrl(sheet, sheetName) {
      sheetName = sheetName || 'sheet1';
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      let url = URL.createObjectURL(blob)
      return url;
    },
    async downExcelFile(){
      if(!this.resJsonArr){
        this.$message.error('json为空，请先转换，再下载')
        return
      }
      this.excelLoading = true
      // console.log('this.excelLoading:',this.excelLoading)
      let originFileName = this.upFile && this.upFile.name
      let lastIndex = originFileName && originFileName.lastIndexOf('.')
      let fileName = (originFileName && originFileName.slice(0,lastIndex) || this.today + '-' + this.randomStr() )+'.xlsx' 
      var sheet = XLSX.utils.aoa_to_sheet(this.resJsonArr);
      let url = this.sheet2blobUrl(sheet)
      this.downFile(url,fileName)
    },
    closeMeComonent(){
      this.showMeComonent = false
    },
    clearFile(){
      console.log('clearFile')
      this.upFile = null
      this.$refs.originFileInput.value = ''
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
    // async uploadFileToServer(){
    //   let params  = new FormData();
    //   params.append('file',this.upFile)
    //   let res = await this.$axios({
    //     method:'post',
    //     url:'/api/uploadJsonFile',
    //     data:params,
    //     headers:{
    //       'Content-Type': 'multipart/form-data',
    //     }
    //   })
    //   return res
    // },
    // async uploadJsonContToServer(){
    //   let res = this.$axios({
    //     method:'post',
    //     url:'/api/uploadJsonContToServer',
    //     data:{jsonCont:this.jsonCont},
    //   })
    //   return res  
    // },
    // async dealRes(res){
    //   if(res.code === -2){
    //     this.jsonValidateStr = res.msg
    //   }else if(res.code === -1){
    //     this.$message.error(`${res.code}:${res.msg}`)
    //   }else if(res.code === 0){
    //     // 返回正确
    //     this.tableData = this.changeResDataToTableData(res.data.arr)
    //     this.csvUrl = res.data.csvUrl
    //     this.excelUrl = res.data.excelUrl
    //   }
    // },
    closeLoading(){
      this.loadingHandler && this.loadingHandler.close()
      this.loading = false
    },
    async validateAndConvertInputJsonData(jsonCont){
      try {
        // 装成字符串，便于parse解析
        if(Object.prototype.toString.call(jsonCont) === '[object Object]'){
          jsonCont = JSON.stringify(jsonCont)
        }
        let result = jsonlint.parse(jsonCont);
        if (result) {
          // 通过校验后，开始上传文件
          this.closeLoading()
          let resJsonArr = await startConvertJsonToArray(jsonCont)
          this.resJsonArr = resJsonArr
          // console.log('resJsonArr:',resJsonArr)
          let sliceResJsonArr = resJsonArr.slice(0,1000)
          this.tableData = this.changeResDataToTableData(sliceResJsonArr)
        }
      } catch(e) {
        this.jsonValidateStr = e.toString()
        console.log('jsonValidateStr:',this.jsonValidateStr)
        this.closeLoading()
      }
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
      
      this.loading = true
      this.jsonValidateStr = ''
      
      // 如果文本框存在内容，则直接判断文本框中的json是否合法。如果文本框有内容且合法，则以文本框内容为主，忽略json文件
      if(this.jsonCont.length > 0){
        this.validateAndConvertInputJsonData(this.jsonCont)
        
      }else {
       
        let reader = new FileReader()
        reader.readAsText(this.upFile, "UTF-8")
        reader.onload = async (evt)=>{
          let jsonCont = evt.target.result
          this.validateAndConvertInputJsonData(jsonCont)
        }
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


