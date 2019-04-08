export default ({ app: { router }, store }) => {

  // if (process.env.NODE_ENV !== 'production') return

  router.afterEach((to, from) => {
    /* 告诉增加一个PV */
    try {
      window._hmt = window._hmt || []
      window._hmt.push(['_trackPageview', to.fullPath])
    } catch (e) {}
  })
}