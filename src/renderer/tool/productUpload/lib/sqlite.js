const fs = require('fs')
const path = require('path')
let info, sqliteDB
const moment = require('moment')
const SqliteDB = require('./utils/sqliteDB').SqliteDB
const { readFiles } = require('./utils/file')
const translate = require('./utils/fanyi')

class Sqlite {
  constructor(clientInfo) {
    info = clientInfo
    sqliteDB = new SqliteDB(info.siteDBPath)
    this.productList = []
    this.ay_content_sortArr = []
    this.ay_contentArr = []
    this.cateIndex = 0
  }

  async addProduct() {
    await this.setSort()
    await this.setContent()
    this.save()
  }
  async translateTable() {
    await this.sortTranslate()
    await this.contentTranslate()
    this.save()
  }

  async setSort() {
    let [startId, startScode] = await this.getStartId('ay_content_sort', [
      'id',
      'scode',
    ])
    readFiles(info.siteImgPath, null, (dirPath, fileName) => {
      this.pushAy_content_sortItem(
        startId++,
        'cn',
        info.pcode,
        startScode++,
        info.categoryList ? info.categoryList[this.cateIndex++] : fileName,
        255
      )
    })
    this.addSortSql(this.ay_content_sortArr)
  }

  async setContent() {
    const today = moment().format('YYYYMMDD')
    const now = moment().format('YYYYMMDDHHmm')

    fs.mkdirSync(path.join(info.sitePath, today))

    readFiles(info.siteImgPath, (filePath) => {
      this.productList.push(filePath)
    })

    let [startId] = await this.getStartId('ay_content', ['id'])

    this.productList.forEach((filePath, i) => {
      let { name, dir, ext } = path.parse(filePath)
      this.ay_content_sortArr.forEach((sort) => {
        if (dir.includes(sort[5])) {
          // 创建图片文件
          let imgBuffer = fs.readFileSync(filePath)
          let imgName = now + i + ext
          let imgPath = path.join(info.sitePath, today, imgName)
          fs.writeFileSync(imgPath, imgBuffer)

          this.pushAy_contentItem(
            startId++,
            'cn',
            sort[4], // scode,
            info.fileName ? name : sort[5],
            `/sites/${info.sitename}/static/upload/image/${today}/${imgName}`,
            `/sites/${info.sitename}/static/upload/image/${today}/${imgName}`,
            '',
            255
          )
        }
      })
    })

    this.addContentSql(this.ay_contentArr)
  }

  async sortTranslate() {
    let table = 'ay_content_sort'
    let ay_cotent_sortTable = await this.getTableListSql(table)
    let ids = ay_cotent_sortTable.map((v) => v.id)
    let l = Math.max(...ids)
    this.ay_content_sortLength = l
    let words = ay_cotent_sortTable.reduce((pre, cur) => {
      return pre + '\n' + cur.name
    }, '')

    let transArr = await translate(words)

    let tableContent = ay_cotent_sortTable.map((item, i) => {
      item.id = item.id * 1 + l
      item.scode = String(item.scode * 1 + l)
      item.acode = 'en'
      if (item.pcode && item.pcode != 0) {
        item.pcode = String(item.pcode * 1 + l)
      }
      item.name = transArr[i]
      return Object.values(item)
    })

    this.addSortSql(tableContent)
  }

  async contentTranslate() {
    let table = 'ay_content'
    let ay_contentTable = await this.getTableListSql(table)
    let ids = ay_contentTable.map((v) => v.id)
    let l = Math.max(...ids)
    let words = ay_contentTable.reduce((pre, cur) => {
      return pre + '\n' + cur.title
    }, '')
    console.log(words)
    let transArr = await translate(words)
    console.log(transArr)
    let tableContent = ay_contentTable.map((item, i) => {
      item.id = item.id * 1 + l
      item.scode = String(item.scode * 1 + this.ay_content_sortLength)
      item.acode = 'en'
      if (item.pcode && item.pcode != 0) {
        item.pcode = String(item.pcode * 1 + l)
      }
      item.title = transArr[i]
      return Object.values(item)
    })

    this.addContentSql(tableContent)
  }

  async getStartId(table, types) {
    let ids = await Promise.all(
      types.map((v) => {
        return this.getLastIdSql(table, v)
      })
    )
    return types.map((v, i) => {
      return ++ids[i]
    })
  }

  pushAy_content_sortItem(id, acode, pcode, scode, name, sorting) {
    this.ay_content_sortArr.push([
      id,
      acode,
      3,
      pcode,
      scode,
      name,
      'product.html',
      'proshow.html',
      1,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      sorting,
      'admin',
      'admin',
      moment().format('YYYY-MM-DD HH:mm:ss'),
      moment().format('YYYY-MM-DD HH:mm:ss'),
    ])
  }

  pushAy_contentItem(id, acode, scode, title, ico, pics, content, sorting) {
    this.ay_contentArr.push([
      id,
      acode,
      scode,
      '',
      title,
      '#333333',
      '',
      '',
      'admin',
      '本站',
      '',
      moment().format('YYYY-MM-DD HH:mm:ss'),
      ico,
      pics,
      content,
      '',
      '',
      '',
      '',
      sorting,
      '1',
      '0',
      '0',
      '0',
      0,
      0,
      0,
      'admin',
      'admin',
      moment().format('YYYY-MM-DD HH:mm:ss'),
      moment().format('YYYY-MM-DD HH:mm:ss'),
    ])
  }

  getTableListSql(table) {
    return new Promise((resolve, reject) => {
      sqliteDB.queryData(`select * from ${table} where acode = 'cn'`, (arr) => {
        resolve(arr)
      })
    })
  }

  getLastIdSql(table, id) {
    let querySql = `select ${id} from ${table} order by cast(${id} as float) desc limit 1`
    return new Promise((resolve, reject) => {
      sqliteDB.queryData(querySql, function (arr) {
        resolve(arr[0][id])
      })
    })
  }

  addSortSql(contentArr) {
    let insertExtSql =
      'insert into ay_content_sort(id,acode,mcode,pcode,scode,name,listtpl,contenttpl,status,outlink,subname,ico,pic,title,keywords,description,filename,sorting,create_user,update_user,create_time,update_time) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    sqliteDB.insertData(insertExtSql, contentArr)
  }

  addContentSql(contentArr) {
    let insertExtSql =
      'insert into ay_content(id,acode,scode,subscode,title,titlecolor,subtitle,filename,author,source,outlink,date,ico,pics,content,tags,enclosure,keywords,description,sorting,status,istop,isrecommend,isheadline,visits,likes,oppose,create_user,update_user,create_time,update_time) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

    sqliteDB.insertData(insertExtSql, contentArr)
  }

  addExtSql(contentArr) {
    var insertExtSql =
      'insert into ay_content_ext(extid,contentid,ext_Origin,ext_Name,ext_Certification,ext_Model,ext_Quantity,ext_Price,ext_Details,ext_Time,ext_Payment,ext_Ability) values(?,?,?,?,?,?,?,?,?,?,?,?)'

    sqliteDB.insertData(insertExtSql, contentArr)
  }

  save() {
    sqliteDB.close()
  }
}

module.exports = Sqlite
