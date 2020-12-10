<template lang="pug">
#g-imgResize(transition="scale-transition"
      origin="center center")
  v-card
    v-row.mx-0
      v-col.pa-5(:cols="8" )
        v-row.pb-4
          v-btn(@click="openFiles") 打开文件
          v-spacer
          v-btn(@click="optimize" v-if="!allDone && !isSharping" color="#2196F3" outlined elevation="1"
rounded) 开始处理
          v-progress-circular(color="green" indeterminate v-if="isSharping")
          v-btn.mx-4(color="#C8E6C9" rounded v-if="allDone" @click="handleImgSave")
            span(style='color:#444') 保存并覆盖
          v-btn(color="#EF9A9A" rounded v-if="allDone" @click="handleImgBack") 
            span(style='color:#444') 撤回
          v-snackbar(v-model="isImgSave" centered timeout="3000") 图片保存成功！
          v-snackbar(v-model="isAllPicked" centered timeout="3000") 目前不支持单选操作！
        v-row.pb-16
          v-col(v-for="(img,i) in showImgList" :key="img.name" :cols="4" )
            v-card
              v-img(:src="img.path"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px")
                v-card-title(v-text="img.name")
              v-card-actions
                v-chip(:color="img.color") {{img.info.size | fileSize}}
                v-chip.mx-1(:color="img.color") {{img.info.width + '*' + img.info.height}}
                v-spacer
                v-btn(icon @click="closeImg(i)")
                  v-icon mdi-close
      v-col(:cols="4")
        v-sheet(elevation="0")
          v-card(elevation="4")
            v-card-title
              v-icon.pr-4(style='flex:0') mdi-scissors-cutting
              span.text-subtitle-1 裁剪尺寸
              v-spacer
              v-switch.my-0.py-0.mb-n4(v-model="tailorStatus")
            v-divider
            v-card-text
              v-text-field(v-model="width" label="宽度(px)" clearable @input="widthInput")
              v-text-field(v-model="height" label="高度(px)" clearable @input="heightInput")
              v-checkbox(v-model="keep" label="保持长宽比")
          v-card.mt-6(elevation="4" )
            v-card-title
              v-icon.pr-4(style='flex:0') mdi-image
              span.text-subtitle-1 压缩图片(只生成JPG格式)
              v-spacer
              v-switch.my-0.py-0.mb-n4(v-model="compressStatus")
            v-divider
            v-card-text
              v-slider(v-model="compress" :max="100" :min="0" label="压缩比" class="align-center vslider")
                template(v-slot:append)
                  v-text-field(v-model="compress" type="number" class="mt-0 pt-0" style="width: 60px;")
              v-checkbox(v-model="isPngCompress" label="PNG格式压缩(生成JPG格式)")
</template>

<script>
const { remote } = require('electron')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
export default {
  name: 'g-imgResize',
  components: {},
  props: {},
  data() {
    return {
      imgList: [],
      showImgList: [],
      sharpImgList: [],
      rate: 1,
      rateOnce: false,
      width: 600,
      height: 600,
      keep: true,
      compress: 80,
      tailorStatus: true,
      compressStatus: true,
      isSharping: false,
      isImgSave: false,
      isPngCompress: false,
      allDone: false,
      isAllPicked: false,
    }
  },
  computed: {},
  watch: {
    keep(v) {
      if (v) {
        this.rate = (this.width / this.height).toFixed(3)
      }
    },
  },
  filters: {
    fileSize(v) {
      let k = 1024
      if (v < k) {
        return v + 'Byte'
      }
      if (v > k && v < k * k) {
        return (v / k).toFixed(2) + 'kb'
      }
      if (v > k * k) {
        return (v / (k * k)).toFixed(2) + 'mb'
      }
    },
  },
  methods: {
    openFiles() {
      let files = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
      })
      this.sharpImgList = []
      this.showImgList = []
      this.imgList = []
      files.forEach((file) => {
        let { base } = path.parse(file)
        sharp(file).toBuffer((err, data, info) => {
          this.imgList.push({
            name: base,
            path: file,
            info,
            data,
          })
          this.showImgList.push({
            name: base,
            path: file,
            info,
            color: '',
          })
          if (!this.rateOnce) {
            this.rateInit()
            this.rateOnce = true
          }
        })
      })
    },
    optimize() {
      if (!this.imgList.length) {
        return
      }
      this.isSharping = true
      this.imgList.forEach((img, i) => {
        let { ext, name } = path.parse(img.path)
        if (this.tailorStatus && this.compressStatus) {
          if (ext.match(/jpe?g/) || this.isPngCompress) {
            if (img.path.includes('png')) {
              img.path = img.path.replace('png', 'jpg')
            }
            sharp(img.data)
              .resize({
                width: Number(this.width),
                height: Number(this.height),
                fit: 'contain',
                background: '#ffffff',
              })
              .jpeg({
                quality: Number((this.compress / 2).toFixed(0)),
                chromaSubsampling: '4:4:4',
              })
              .toBuffer((err, data, info) => {
                this.sharpImgList.push({
                  name: name + '.jpg',
                  path: img.path,
                  info,
                  data,
                })
                this.$set(this.showImgList, i, {
                  name: name + '.jpg',
                  path: img.path,
                  info,
                  color: '#C8E6C9',
                })
                if (this.sharpImgList.length === this.imgList.length) {
                  this.allDone = true
                  this.isSharping = false
                }
              })
          } else {
            sharp(img.data)
              .resize({
                width: Number(this.width),
                height: Number(this.height),
                fit: 'contain',
                backround: { r: 0, g: 0, b: 0, alpha: 0 },
              })
              .toBuffer((err, data, info) => {
                this.sharpImgList.push({
                  name: img.name,
                  path: img.path,
                  info,
                  data,
                })
                this.$set(this.showImgList, i, {
                  name: img.name,
                  path: img.path,
                  info,
                  color: '#C8E6C9',
                })
                if (this.sharpImgList.length === this.imgList.length) {
                  this.allDone = true
                  this.isSharping = false
                }
              })
          }
        } else {
          this.isAllPicked = true
          this.isSharping = false
          setTimeout(() => {
            this.isAllPicked = false
          }, 3000)
        }
      })
    },
    handleImgSave() {
      let count = this.sharpImgList.length
      this.sharpImgList.forEach((img, i) => {
        fs.writeFileSync(img.path, img.data, (err) => {
          if (err) console.log(err)
        })
        count--
        if (count == 0) {
          this.isImgSave = true
          this.resetData()
        }
      })
    },
    handleImgBack() {
      this.showImgList = this.showImgList.map((img, i) => {
        return {
          name: img.name,
          path: img.path,
          info: this.imgList[i].info,
          color: '',
        }
      })
      this.sharpImgList = []
      this.allDone = false
    },
    resetData() {
      this.imgList = []
      this.showImgList = []
      this.sharpImgList = []
      this.rate = 1
      this.rateOnce = false
      this.isSharping = false
      this.allDone = false
      setTimeout(() => {
        this.isImgSave = false
      }, 3000)
    },
    rateInit() {
      let width = this.imgList[0].info.width
      let height = this.imgList[0].info.height
      this.rate = (width / height).toFixed(3)
    },
    closeImg(i) {
      if (this.imgList[i]) {
        this.imgList.splice(i, 1)
      }
      if (this.sharpImgList) {
        this.sharpImgList.splice(i, 1)
      }
      this.showImgList.splice(i, 1)
    },
    infoImg(i) {},
    widthInput() {
      if (this.keep) {
        this.height = (this.width / this.rate).toFixed(0)
      }
    },
    heightInput() {
      if (this.keep) {
        this.width = (this.height * this.rate).toFixed(0)
      }
    },
  },
}
</script>

<style lang="scss">
#g-imgResize {
  .vslider {
    input {
      text-indent: 0.8rem;
    }
  }
}
</style>
