<template lang="pug">
#Home
  v-container
    v-row
      v-col(cols="4")
        eImgResize
      v-col(cols="4")
        eProductUpload
      v-col(cols="4")
        eI18n
</template>

<script>
import eImgResize from '@/tool/imgResize/e-imgResize'
import eProductUpload from '@/tool/productUpload/e-productUpload'
import eI18n from '@/tool/i18n/e-i18n'
export default {
  name: 'Home',
  components: {
    eImgResize,
    eProductUpload,
    eI18n,
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
