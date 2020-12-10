<template lang="pug">
#g-productUpload
  v-container
    v-row
      v-btn(@click="readDir") 打开文件夹
    v-sheet.my-5.mx-n5
      v-treeview(
        v-model="tree"
        :open="initiallyOpen"
        :items="itemss"
        activatable
        item-key="name"
        open-on-click
        transition
      )
        template(v-slot:prepend="{item,open}")
          v-icon(v-if="!item.file").
            {{open ? 'mdi-folder-open' : 'mdi-folder'}}
          v-icon(v-else).
            {{files[item.file]}}
</template>

<script>
import path from 'path'
import sqlite from '@/tool/productUpload/lib/sqlite'
import { readFiles } from '@/tool/productUpload/lib/utils/file'
import { remote } from 'electron'
import { parse } from 'querystring'
export default {
  name: 'g-productUpload',
  components: {},
  props: {},
  data() {
    return {
      info: {
        sitename: '',
        sitePath: '',
        siteImgPath: '',
        siteDBPath: '',
        categoryList: [],
        pcode: '',
        fileName: '',
      },
      initiallyOpen: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      items: [
        {
          name: '.git',
        },
        {
          name: 'node_modules',
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [
                {
                  name: 'logo.png',
                  file: 'png',
                },
              ],
            },
            {
              name: 'favicon.ico',
              file: 'png',
            },
            {
              name: 'index.html',
              file: 'html',
            },
          ],
        },
        {
          name: '.gitignore',
          file: 'txt',
        },
        {
          name: 'babel.config.js',
          file: 'js',
        },
        {
          name: 'vue.config.js',
          file: 'js',
        },
        {
          name: 'yarn.lock',
          file: 'txt',
        },
      ],
      itemss: [],
    }
  },
  computed: {},
  methods: {
    readDir() {
      let [dirPath] = remote.dialog.showOpenDialogSync(
        remote.getCurrentWindow(),
        {
          properties: ['openDirectory'],
        }
      )
      let dirs = []
      let files = []
      readFiles(
        dirPath,
        (file) => {
          files.push(file)
        },
        (dir) => {
          dirs.push(dir)
        }
      )
      dirs
        .filter((v) => {
          let { name, dir } = path.parse(v)
          if (dir === dirPath) {
            this.itemss.push({
              name,
              path: dir + '\\' + name,
            })
            return false
          }
          return true
        })
        .forEach((v) => {
          let { name, dir } = path.parse(v)
          let dir1 = this.itemss.find((v) => {
            return v.path === dir
          })
          console.log(dir1)
          if (dir1) {
            dir1.children = []
            dir1.children.push({ name, path: dir + name })
          }
        })
      console.log(this.itemss)
    },
  },
}
</script>

<style lang="scss">
#g-productUpload {
}
</style>
