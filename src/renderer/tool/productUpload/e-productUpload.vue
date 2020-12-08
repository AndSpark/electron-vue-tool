<template lang="pug">
#e-productUpload
  gCard(:title="title" :subtitle="subtitle" :expand="expand" :link="link")
</template>

<script>
import gCard from '@/components/g-card'
export default {
  name: 'e-productUpload',
  components: {
    gCard,
  },
  props: {},
  data() {
    return {
      title: '产品上传工具',
      subtitle: '根据产品图片批量上传数据库',
      expand: '正在制作中',
      link: 'productUpload',
    }
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
#e-productUpload {
}
</style>
