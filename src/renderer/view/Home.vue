<template lang="pug">
#Home
	v-container
		v-row
			v-col(cols="4")
				eImgResize
			v-col(cols="4")
			
</template>

<script>
import eImgResize from '@/tool/imgResize/e-imgResize'
export default {
  name: 'Home',
  components: {
    eImgResize,
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
#Home {
}
</style>
