var fs = require("fs");
const process = require('process')

const src = process.cwd() + '/bin'
const name = process.argv[2]
fs.readdir(src, function (err, files) {
  files.forEach(function (filename) {
    var oldName = src + '/' + filename;
    var newName = src + '/' + name + '.js';
    fs.rename(oldName, newName, function (err) {
      if (!err) {
        console.log('bin 替换成功');
      }
    })
  });
});


const files = []

function ScanDir(path) {
  let that = this
  if (fs.statSync(path).isFile()) {
    return files.push(path)
  }
  try {
    fs.readdirSync(path).forEach(function (file) {
      ScanDir.call(that, path + '/' + file)
    })
  } catch (e) {
    console.error(e);
  }
}

ScanDir(process.cwd() + '/lib/cmd')
files.forEach((file) => {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) throw err;
    const result = data.replace(/project-cli/g, name);
    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) throw err;
      console.log(file+'文件已保存');
    });
  });
})