import { MessageBox } from 'element-ui';
export default function({ $axios, redirect }) {

  $axios.defaults.baseURL = process.env.baseUrl

  // console.log('$axios.defaults.baseURL:',$axios.defaults.baseURL)
 
  $axios.onResponse(res => {
    return res.data
  })
 
  $axios.onError(error => {
    console.log('onError error:',error)
    MessageBox.alert(`<p style="color:red">麻烦截图联系管理员，微信:guo330504</p><p>${JSON.stringify(error)}</p>`,'报错了',{
      dangerouslyUseHTMLString: true
    }).then(()=>{
      window.location.href = '/'
    })
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect("/400");
    }
  });
}