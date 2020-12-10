const fs = require('fs')
const path = require('path')

function readFiles(dirPath, fileFunc, dirFunc) {
	let files = fs.readdirSync(dirPath)
	files.forEach((filename, i) => {
		let filedir = path.join(dirPath, filename)
		let stats = fs.statSync(filedir)
		const isFile = stats.isFile()
		const isDir = stats.isDirectory()
		if (isFile) {
			fileFunc && fileFunc(filedir, filename)
		}
		if (isDir) {
			readFiles(filedir, fileFunc, dirFunc)
			dirFunc && dirFunc(filedir, filename)
		}
	})
}

module.exports = {
	readFiles,
}
