<template lang="pug">
#g-card(transition="scale-transition"
      origin="center center")
	v-card.mx-auto(max-width='344')
		v-img(src='https://picsum.photos/400?random', height='200px' )
		v-card-title.
			
			{{title}}
			
		v-card-subtitle.
			
			{{subtitle}}
			
		v-card-actions
			v-btn(color='orange lighten-2', text @click="linkTo").
				
				打开
				
			v-spacer
			v-btn(icon, @click='show = !show')
				v-icon {{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
		v-expand-transition
			div(v-show='show')
				v-divider
				v-card-text.
					
					{{expand}}
</template>

<script>
export default {
	name: 'g-card',
	components: {},
	props: {
		title: {
			type: String,
			default: 'Top western road trips',
		},
		subtitle: {
			type: String,
			default: '1,000 miles of wonder',
		},
		expand: {
			type: String,
			default: `I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.`,
		},
		link: {
			type: String,
			default: '/',
		},
	},
	data() {
		return {
			show: false,
			loaded: false,
		}
	},
	computed: {},
	methods: {
		linkTo() {
			this.$router.push(this.link)
		},
	},
}
</script>

<style lang="scss">
#g-card {
}
</style>
