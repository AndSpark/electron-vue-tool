<template lang="pug">
#v-header
	v-navigation-drawer(v-model="drawer" app)
	v-card.overflow-hidden
	v-app-bar( color='#fcb69f', dark, shrink-on-scroll, src='https://picsum.photos/1920/1080?random', app ref='appBar')
		template(v-slot:img='{ props }')
			v-img(v-bind="props" gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)")
		v-app-bar-nav-icon(@click="drawer = !drawer" v-if="$route.path === '/'")
		v-btn(icon v-if="$route.path !== '/'" @click="backHome")
			v-icon mdi-keyboard-backspace
		v-toolbar-title.text-h5 {{$route.name}}
		v-spacer
		v-btn(icon )
			v-icon mdi-magnify
		v-btn(icon @click="minimizeWindow")
			div(style="height:3px;width:16px;backgroundColor:#fff")
		v-btn(icon @click="closeWindow")
			v-icon mdi-close
	slot
</template>

<script>
const { remote } = require('electron')
export default {
  name: 'v-header',
  data: () => ({ drawer: null }),
  watch: {
    drawer(v) {
      if (v) {
        this.$refs.appBar.$el.style.webkitAppRegion = 'no-drag'
      } else {
        this.$refs.appBar.$el.style.webkitAppRegion = 'drag'
      }
    },
  },
  methods: {
    minimizeWindow() {
      remote.getCurrentWindow().minimize()
    },
    closeWindow() {
      remote.getCurrentWindow().close()
    },
    backHome() {
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss">
#v-header {
  .v-app-bar {
    -webkit-app-region: drag;
    .v-btn {
      -webkit-app-region: no-drag;
    }
  }
}
</style>
