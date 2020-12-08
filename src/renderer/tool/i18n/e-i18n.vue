<template lang="pug">
#e-i18n
  gCard(:title="title" :subtitle="subtitle" :expand="expand" :link="link")
</template>

<script>
import gCard from '@/components/g-card'
export default {
  name: 'e-i18n',
  components: {
    gCard,
  },
  props: {},
  data() {
    return {
      title: '网页-数据库翻译',
      subtitle: '将中文页面与数据库翻译为英文',
      expand: '正在制作中',
      link: 'i18n',
    }
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
#e-i18n {
}
</style>
