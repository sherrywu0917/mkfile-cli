#!/usr/bin/env node
var program = require("commander")
var fs = require('fs')
var path = require('path')
var nunjucks = require('nunjucks')
var colors = require('colors')

program
    .version('1.0.7')
    .option('-n, --new <filename>', '创建文件')
    .option('-k, --key <keyname>', 'mk.json配置文件对应的key值')

program.on('--help', function () {
    console.log('  自定义的例子:')
    console.log('')
    console.log('    输出命令  mk -n test -k activityList')
    console.log('    输出命令  mk --new test')
    console.log('')
})

program.parse(process.argv);

var mkdirs = function(dirpath, callback) {
    fs.exists(dirpath, exists => {
        if(exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirpath), () => {
                fs.mkdir(dirpath, callback);
            });
        }
    });
}


var mkFile = function(filePath, name, tpl) {
    fs.stat(filePath, function(err, stat){
        if(stat&&stat.isFile()) {
            console.log(colors.yellow(filePath + '文件已存在！'));
        } else {
            fs.open(filePath, "w", function(e, fd) {
                if(e) throw e;
                if(tpl) {
                    fs.readFile(tpl, function(err, data) {
                        if(err) return console.error(err);
                        var tplContent = data.toString();
                        var compiledData = nunjucks.renderString(tplContent, { name: name });
                        fs.write(fd, compiledData, function(e){
                            if(e) throw e;
                            fs.closeSync(fd);
                        })
                    });
                }
                console.log(colors.green('create ' + filePath + ' success!'))
            });
        }
    });
}

if(program.new || program.n) {
    var name = program.new || program.n
    var listKey = program.key || 'fileList'
    fs.readFile('mk.json', function(err, data) {
        if(err)
            throw err;
        var jsonObj = JSON.parse(data);
        var fileList = jsonObj[listKey];
        if(fileList && fileList.length > 0) {
            for(var i=0,size=fileList.length; i<size; i++) {
                var fileItem = fileList[i];
                var dir = fileItem.dir;
                var suffix = fileItem.suffix;
                if(suffix.indexOf('.') > -1) {
                    var filePath = path.resolve(dir, name + suffix);
                }
                else {
                    var filePath = path.resolve(dir, name + '.' + suffix);
                }
                mkdirs(dir, (function(filePath, name, tpl) {
                    return function() {
                        mkFile(filePath, name, tpl)
                    }
                })(filePath, name, fileItem.tpl))
            }
        }
        else {
            console.log('---json文件没有配置---')
        }
    });
}
else {
    program.outputHelp();
}
