// json 转 二维数组
async function startConvertJsonToArray (jsonData){
  // excel表头
  let contList = []   // contList是一个二维数组，第一个元素是标题，以后的元素是数据，[['name','age','address'],['姓名','年龄','地址']]
  let jsonKeys = {}
  let excelTitleObjs = {}
  let hasIncludesKeys = {}

  // 将json对象，转成json数组,这样子[{},{}]
  function convertJsonToArrayJson(jsonData){
    // console.log('Object.prototype.toString.call(jsonData):',Object.prototype.toString.call(jsonData))
    if(Object.prototype.toString.call(jsonData) === '[object Object]'){
      jsonData = [jsonData]
    }
    // 是数组，且子元素为对象。
    if(Array.isArray(jsonData) ){
      let everyObj = jsonData.every(item=>{
        return Object.prototype.toString.call(item) === '[object Object]'
      })
      if(everyObj){
        return jsonData
      }else {
        null
      }
    }
    return null
  }
  function deleteDuplicateKeys(){
    /* 
    jsonKeys: {
      '0': [],
      '1': [
        { excelTitle: 'name', jsonKey: 'name' },
        { excelTitle: 'code', jsonKey: 'code' },
        { excelTitle: 'name', jsonKey: 'name' },
        { excelTitle: 'code', jsonKey: 'code' } 
      ],
      '2': [
        { excelTitle: 'children_name', jsonKey: 'name' },
        { excelTitle: 'children_code', jsonKey: 'code' },
        { excelTitle: 'children_name2', jsonKey: 'name2' },
        { excelTitle: 'children_code', jsonKey: 'code' },
        { excelTitle: 'children_name3', jsonKey: 'name3' },
        { excelTitle: 'children_code', jsonKey: 'code' },
        { excelTitle: 'children_list', jsonKey: 'list' },
        { excelTitle: 'children_name', jsonKey: 'name' },
        { excelTitle: 'children_code', jsonKey: 'code' },
        { excelTitle: 'children_name', jsonKey: 'name' },
        { excelTitle: 'children_code', jsonKey: 'code' },
        { excelTitle: 'children_name', jsonKey: 'name' },
        { excelTitle: 'children_code', jsonKey: 'code' }
      ],
      '3': [
        { excelTitle: 'children_children_name', jsonKey: 'name' },
        { excelTitle: 'children_children_code', jsonKey: 'code' }
      ]
    }
    */
    let tempObj = {}
    // jsonKeys 就是个二维数组
    let keys = Object.keys(jsonKeys)
    keys.forEach(key=>{
      let keysArr = []
      tempObj[key] = jsonKeys[key].filter(item=>{
        if(keysArr.includes(item.excelTitle)){
          return false
        }else {
          keysArr.push(item.excelTitle)
          return true
        }
      })
    })
    return tempObj
  }

  function addKeysToJsonKey(level,nameKey,key){
    hasIncludesKeys[level] = hasIncludesKeys[level] || []
    if(!hasIncludesKeys[level].includes(nameKey)){
      let data = {
        excelTitle:nameKey,
        jsonKey:key
      }
      jsonKeys[level].push(data)
      hasIncludesKeys[level].push(nameKey)
    }
  }
  // 获取json对象所有的key
  function getKeys(jsonData,level,parentKey){
    // console.log('parentKey:',parentKey)
    // 创建key数组
    jsonKeys[level] = jsonKeys[level] || []
    // level 为json的层级,因为jsonData是特殊处理的，统一格式为[{},{}],第一层肯定是数组,所以第一层的key是没有意义的。jsonKeys: { '0': [], '1': [ 'name', 'code' ], '2': [ 'name', 'code' ] }
    let keys = Object.keys(jsonData)
    
    keys.forEach(key=>{
      let jsonValue = jsonData[key]
      // 第0层的key不要
      let nameKey = parentKey ? parentKey + '_' + key : level  === 0 ? '' : key 
      // 判断节点的值类型
      if(Object.prototype.toString.call(jsonValue) ==='[object Object]'){
        // 子对象是个对象
        let subLevel = level + 1
        getKeys(jsonValue,subLevel, nameKey)
      }else if(Array.isArray(jsonValue)){
        let subLevel = level + 1
        if(jsonValue.length > 0){
          // 如果数组的所有子元素都是对象，则继续往下递归，否则退出
          let isEveryObj = jsonValue.every(item=>{
            // if(Object.prototype.toString.call(item) !== '[object Object]'){
            //   console.log('item:',item)
            // }
            return Object.prototype.toString.call(item) === '[object Object]'
          })
          if(isEveryObj){
            jsonValue.forEach(item=>{
              getKeys(item,subLevel,nameKey)
            })
          }else {
            // console.log('json0',level,nameKey,key)
            addKeysToJsonKey(level,nameKey,key)
          }
        }else {
          // 2022-07-01决定不再处理空数据
          // console.log('json1',level,nameKey,key)
          // addKeysToJsonKey(level,nameKey,key)
        }
      }else{
        // 字面量都走这里
        // console.log('json2',level,nameKey,key)
        addKeysToJsonKey(level,nameKey,key)
      }
    })
    
  }

  function getValuesByExcelTitle(level,data){
    // level为json的当前层级，data为当前层级数据
    // console.log('excelTitleObjs:',excelTitleObjs)
    // console.log('getValuesByExcelTitle level:',level,data)
    let keys = excelTitleObjs[level].map(item=>{
      return item.jsonKey
    })
    
    let strList = keys.map(key=>{
      let temp = data[key]
      if(Array.isArray(temp)){
        // 如果是数组，不能直接使用String，转String会以,分割，这样会影响csv格式
        return temp.join('、')
      }else{
        return (temp && String(temp)) || ''
      }
      
    })
    return strList
  }

  // 获取arr1比arr2多的元素
  function diffArray1(arr1,arr2){
    let tempArr = arr1.concat(arr2)
    return tempArr.filter(item=>{
      return !arr2.includes(item)
    })
  }
  // excelTitleObjs为去重数据
  function  traverseJsonToArray(jsonData,level,rowTextList){
    let tempRow = getValuesByExcelTitle(level,jsonData)
    rowTextList =  rowTextList.concat(tempRow)
    let keys = Object.keys(jsonData)
    let excelKeys = excelTitleObjs[level].map(item=>{
      return item.jsonKey
    })
    // keys 比excelKeys 多了值为数组或者对象的 key
    let diffKeys = diffArray1(keys,excelKeys)
    // console.log('diffKeys:',diffKeys)
    if(diffKeys.length > 0){
      diffKeys.forEach(key=>{
        let jsonValue = jsonData[key]
        let subLevel = level + 1
        // console.log('subLevel:',subLevel,key)
        // 如果本层还有数组或者对象，则继续递归
        if(Array.isArray(jsonValue)){
          if(jsonValue.length > 0){
            jsonValue.forEach(item=>{
              traverseJsonToArray(item,subLevel,rowTextList)
            })
          }else {
            // 空数组，说明循环到此结束
            contList.push(rowTextList)
          }
          
        }else {
          traverseJsonToArray(jsonValue,subLevel,rowTextList)
        }
      })
    }else {
      // 递归结束
      contList.push(rowTextList)
      // console.log('rowTextList:',JSON.stringify(rowTextList))
    }
  }

  // 获取excel表头
  function getExcelTitle(){
    let titlesList = []
    let keys = Object.keys(excelTitleObjs)
    keys.forEach(key=>{
      let jsonKeys = excelTitleObjs[key].map(item=>{
        return item.excelTitle
      })
      titlesList = titlesList.concat(jsonKeys)
    })
    return titlesList
  }

  // function initVeriable(){
  //   contList = []   // contList是一个二维数组，第一个元素是标题，以后的元素是数据，[['name','age','address'],['姓名','年龄','地址']]
  //   jsonKeys = {}
  //   excelTitleObjs = {}
  //   hasIncludesKeys = {}
  // }


  // json是没有顺序的，获取数据的时候必须根据key来获取
  // 使用json的key作为excel的标题
  async function convertJsonToArray(jsonData){
    // console.time('convertJsonToArray')
    if(typeof jsonData === 'string'){
      jsonData = JSON.parse(jsonData)
    }
    // 把json对象{}转换成数组对象[{}]，便于循环处理。
    jsonData = convertJsonToArrayJson(jsonData)  
    if(jsonData){
      // 经过处理，得到正确格式json数据
      // 获取excel的表头
      getKeys(jsonData,0)
      // 删除重复excel标题，其实这一步没必要，之前的程序已经去过重了
      excelTitleObjs = deleteDuplicateKeys()
      // console.log('jsonKeys:',jsonKeys)
      let titlesList = getExcelTitle()
      // console.log('titlesList:',titlesList)
      contList.push(titlesList)
      traverseJsonToArray(jsonData,0,[]) 
      
      // 数组数据转成excel
      // console.timeEnd('convertJsonToArray')
      return contList
      // console.log('contList:',contList)
    }else{
      console.log('json格式不对,请检查')
      return 'json格式不对,请检查'
    }
  }
  return await convertJsonToArray(jsonData)
}



// 判断浏览器版本
function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if(isIE) {
   var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
   reIE.test(userAgent);
   var fIEVersion = parseFloat(RegExp["$1"]);
   if(fIEVersion == 7) {
       return 7;
   } else if(fIEVersion == 8) {
       return 8;
   } else if(fIEVersion == 9) {
       return 9;
   } else if(fIEVersion == 10) {
       return 10;
   } else {
       return 6;//IE版本<=7
   }
  } else if(isEdge) {
   return 'edge';//edge
  } else if(isIE11) {
   return 11; //IE11
  }else{
   return -1;//不是ie浏览器
  }
}

// 如果是IE11以下的浏览器，则提醒用户切换浏览器
(function(){
  // 如果是ie浏览器，则让用户切换成其他浏览器
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  console.log('isIE:',isIE)
  if(isIE){
    alert('本网站不支持ie11以下的ie浏览器访问。请使用Chrome, Firefox, Safari, Opera, Edge, IE11等浏览器访问。')
  }
})()