export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '墨鱼工具库',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '在线Json转Excel,在线Json转Csv' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script:[
      {src:'https://js-1300661199.cos.ap-beijing.myqcloud.com/jsonlint.js'},
      {src:'baidu.js'},
      {src:'main.js'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'static/normalize.css',
    'static/main.css',
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  env: {
    baseUrl: process.env.baseUrl,
  },
  // 以下配置不起作用
  // router:{
  //   mode: 'hash',
  //   extendRoutes(routes,resolve){
  //     routes.push({
  //       path:'/',
  //       redirect:{name:'json'}
  //     })
  //   }
  // }
}
