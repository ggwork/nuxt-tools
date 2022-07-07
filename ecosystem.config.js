module.exports = {
  apps: [
    {
      name: 'nuxt-tools',
      exec_mode: 'cluster',
      instances: '1', // Or a number of instances
      script: 'cross-env baseUrl=http://stools.moyutime.cn/ --port 3003./node_modules/nuxt/bin/nuxt.js ',
      args: 'start',
      // watch: true, // watch: './',
      // // // 不用监听的文件
      // ignore_watch: [
      //   'node_modules',
      //   'logs'
      // ],
    }
  ]
}