<template>
  <div class="main">
    <h2>React转Vue常用的一些工具</h2>
    <div class="title">
      <h4>名称驼峰转横杠</h4>
      <el-input
        v-model="styleText"
        :rows="4"
        type="textarea"
        placeholder="Please input"
      />
      <el-button class="mt20" type="primary" @click="convertStyle">转换</el-button>
      <div class="mt20">{{ styleTextResult }}</div>
    </div>
    <div class="title">
      <h4>px转rpx</h4>
      <el-input
        v-model="pxText"
        :rows="8"
        type="textarea"
        placeholder="Please input"
      />
      <el-button class="mt20" type="primary" @click="convertPx">转换</el-button>
      <el-input class="mt20" type="textarea" :rows="8" :value="pxTextResult" readonly></el-input>
    </div>

    
  </div>
</template>
<script>
  export default{
    name:'',
    data(){
      return {
        styleText:'',
        styleTextResult:'',
        pxText:'',
        pxTextResult:'',
      }
    },
    methods:{
      getKebabCase(str) {
        let temp = str.replace(/[A-Z]/g, function(i) {
            return '-' + i.toLowerCase();
        })
        if (temp.slice(0,1) === '-') {
            temp = temp.slice(1);   //如果首字母是大写，执行replace时会多一个_，需要去掉
        }
        return temp;
      },
      convertStyle(){
        this.styleTextResult = ''
        let tList = this.styleText.split(',')
        let tList2 = tList.map(element => {
          return this.getKebabCase(element.trim())
        });
        this.styleTextResult = (tList2.join(';\n')).replaceAll("'","").replaceAll("\"","")
        if(!this.styleTextResult.slice(0,-1) === ";"){
          this.styleTextResult = this.styleTextResult+";"
        }
        
      },
      convertPx(){
        this.pxTextResult = this.pxText.replaceAll(/(\d+)px/g,function(match,p1){
          return Number(p1)*2+'rpx'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.mt20{
  margin-top: 20px;
}
.main{
  width: 1000px;
  margin: auto;
}
.title{
  margin-top: 20px;
}
</style>