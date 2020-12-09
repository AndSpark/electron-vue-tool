<template lang="pug">
#g-productUpload
  v-container
    v-row
      v-btn 打开文件夹
    v-sheet.my-5.mx-n5
      v-treeview(
        v-model="tree"
        :open="initiallyOpen"
        :items="items"
        activatable
        item-key="name"
        open-on-click
        transition
        @update:active="show"
      )
        template(v-slot:prepend="{item,open}")
          v-icon(v-if="!item.file").
            {{open ? 'mdi-folder-open' : 'mdi-folder'}}
          v-icon(v-else).
            {{files[item.file]}}
</template>

<script>
export default {
  name: 'g-productUpload',
  components: {},
  props: {},
  data() {
    return {
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
    }
  },
  computed: {},
  methods: {
    show(arr) {
      console.log(arr)
    },
  },
}
</script>

<style lang="scss">
#g-productUpload {
}
</style>
