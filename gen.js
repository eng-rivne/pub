const path = require('path')
const fs = require('fs')
const { genThumb } = require('./imgThumb')
var root = path.resolve(__dirname, './')

var dist = path.resolve(root, '../docs/muzeyni-hostyny-28-travnya-2017-u-rivnomu/photos/mh28_2017_rv')
var distItemsBaseURL = './' // './photos/mh28_2017_rv/'
const photosUrl = 'photos/mh28_2017_rv/'
const thumbUrl = 'thumb/mh28_2017_rv/'
const filePath = dist // Your file path

// var _indexHtml = path.resolve(root, dist, 'index.html')
var _indexTpl = path.resolve(root, '../src/index.tpl.html')
var _indexHtml = path.resolve(root, '../docs/muzeyni-hostyny-28-travnya-2017-u-rivnomu/index.html')
var t = {
    "src": "",
    "description": "",
    "albumID": "0",
    "kind": "album",
    "t_url": [
    ],
    "t_width": [
        "440",
        "440",
        "440",
        "440",
        "440"
    ],
    "t_height": [
        "360",
        "360",
        "360",
        "360",
        "360"
    ],
    "dc": "#5e7d7f",
    "mtime": 1588543460,
    "ctime": 1588543460,
    "sort": "architecture",
    "dcGIF": "R0lGODdhAwADAOMAAGS8vvD29GdoYqeutlxSSV5ZU7zFyhAWFAIIBgAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAwADAAAEBxAEMUgxB0UAOw=="
}

var walkSync = function (filePath, dirList, filelist) {
    const files = fs.readdirSync(filePath)
    dirList = dirList || []
    filelist = filelist || []

    files.forEach(function (file) {
        if (fs.statSync(path.join(filePath, file)).isDirectory()) {
            var _arr = filePath.split(dist)
            if (_arr.length > 1) {
                // var _d = path.join(www, _arr[1], file)
                // cmd('MKDIR', [_d])
                // dirList.push(_d)
                var _d = path.join(_arr[1], file)
                dirList.push(_d)
            }

            var _res = walkSync(path.join(filePath, file), dirList, filelist)
            filelist = _res.filelist
            dirList = _res.dirList
        } else {
            var _file = path.join(filePath, file)
            /* if (_file !== _indexHtml && !/Response--api-[a-z.]*\.json/ig.test(_file) &&
             !/config\.dev\.json/ig.test(_file)
             )*/
            {
                var _arr2 = _file.split(dist)
                if (_arr2.length > 1) {
                    // var f = path.join(www, _arr2[1])
                    var f = path.join('./', _arr2[1])
                    //  cmd('COPY', ['/Y', _file, f])
                    filelist.push(f.replace(/\\/g, '/'))
                }
                // filelist.push(path.join(filePath, file))
            }
        }
    })

    // Ignore hidden files
    filelist = filelist.filter(item => !(/(^|\/)\.[^/.]/g).test(item))

    return { filelist, dirList }
}
var res = walkSync(filePath)
var listThImgs = []
res.filelist.reduce((_r, _v) => {

    return genThumb(_v.split('/').slice(-1)[0]).then(_r => {
        listThImgs.push(_r)
    })
}

    , Promise.resolve()).then(_r => {
        // console.log(listThImgs);
        return listThImgs
    })
    .then(_res => {

        // console.log(listThImgs);
        // fs.writeFileSync('data_provider.json', JSON.stringify(dataProvider));
        const ln = `
`

        var _htmlItems = ln + listThImgs.reduce((_r, _v) => {
            var _d=_v[0]
            _r += ('         <a href = "{{url}}"   data-ngThumb = "{{thumb-url}}" > {{n}} </a>' + ln)
                .replace(/{{ ?n ?}}/g, _d.in.split('/').slice(-1)[0])
                .replace(/{{ ?url ?}}/g, photosUrl + _d.in.split(photosUrl).pop()).replace(/{{ ?thumb-url ?}}/g, thumbUrl + _d.out.split(thumbUrl).pop())

            return _r
        }, '')

        fs.writeFileSync(_indexHtml, fs.readFileSync(_indexTpl).toString()
            .replace(/{{ ?items ?}}/g, _htmlItems)
            .replace(/{{ ?itemsBaseURL ?}}/g, distItemsBaseURL)

            // .replace(/((.*)({{ ?items ?}})(.*))/,'$2'+_htmlItems+'$4')
        );
    })
//console.log(dataProvider)

// https://api.loc/temp/gallery