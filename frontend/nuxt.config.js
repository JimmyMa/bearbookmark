module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '小熊书签',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '小熊书签，个人书签，知识库' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css'
      },
      {
        rel: 'stylesheet',
        href: '/css/main.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
      }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    optimization: {
      minimize: false
    }
  },

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'tag',
        path: '/tag/:tagName',
        component: resolve(__dirname, 'pages/index.vue')
      }),

      routes.push({
        name: 'myBookmark',
        path: '/my',
        component: resolve(__dirname, 'pages/index.vue')
      }),

      routes.push({
        name: 'myTag',
        path: '/my/tag/:tagName',
        component: resolve(__dirname, 'pages/index.vue')
      })

      console.log(routes)

    }
  },

  plugins: [{
    src: '~plugins/vue-scrollmagic.js',
    ssr: false
  }],

  modules: ['@nuxtjs/axios', '@nuxtjs/auth'],

  axios: {
    baseURL: 'https://bearbm.54coder.com.cn/api'
    // baseURL: 'http://127.0.0.1:3333/api'
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'data.token' },
          user: { url: 'me', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    }
  }
}
