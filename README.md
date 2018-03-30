# mkfile-cli
A tool to help you quickly create file in project

### install
npm i mkfile-cli

### config
添加mk.json在项目的根目录，配置mk.json，dir为生成目标文件的路径，js为文件后缀名，tpl是文件模板路径。模板内容可以自定义，使用的模板语法是[nunjucks](https://mozilla.github.io/nunjucks/)。
``` json
{
    "fileList" : [
        {"dir": "test/js", "suffix": "js", "tpl": "tpl/js.tpl"},
        {"dir": "test/css", "suffix": "css", "tpl": "tpl/css.tpl"}
    ],
    "activityList" : [
        {"dir": "activity/js", "suffix": "js", "tpl": "tpl/js.tpl"}
    ]
}
```
### use
``` bash
mk --new [filename] --key [keyname]
mk -n [filename] -k [keyname]
```
keyname对应mk.json中的key值，若不传，则默认为`fileList`。
- 运行`mk --new hellomk`会根据模板创建文件test/js/hellomk.js和test/css/hellomk.css，若无tpl参数，则创建空文件;
- 运行`mk --new hellomk --key activityList`会根据模板创建文件activity/js/hellomk.js
