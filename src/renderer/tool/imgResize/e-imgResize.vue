<template lang="pug">
#e-imgResize
  gCard(:title="title" :subtitle="subtitle" :expand="expand" :link="link")
</template>

<script>
import gCard from '@/components/g-card'
export default {
	name: 'e-imgResize',
	components: {
		gCard,
	},
	props: {},
	data() {
		return {
			title: '图片处理工具',
			subtitle: '快速批量裁剪、压缩',
			expand: '正在制作中',
			link: 'imgresize',
		}
	},
	computed: {},
	methods: {},
}
</script>

<style lang="scss">
#e-imgResize {
}
</style>
