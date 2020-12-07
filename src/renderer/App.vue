<template lang="pug">
v-app
	vHeader
		template
			v-main
				v-sheet#scrolling-techniques-2.overflow-y-auto
					router-view 
	.border-cover
</template>

<script>
import vHeader from '@/components/v-header'
export default {
  name: 'electron-vue',
  components: {
    vHeader,
  },
}
</script>

<style lang="scss">
#app {
  .v-app-bar {
    -webkit-app-region: drag;
    .v-btn {
      -webkit-app-region: no-drag;
    }
  }
  .border-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border: 1px solid $gray;
    z-index: 999;
    pointer-events: none;
  }
}

/* CSS */
</style>
