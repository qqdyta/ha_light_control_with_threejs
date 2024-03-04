const { app, Tray, BrowserWindow , ipcMain, Menu, shell} = require('electron')
const fs = require('fs');
const os = require('os');
const path = require('path');


let main_windows


// 指定要检查的文件名
const fileName = 'data.json';
// 获取当前路径下的完整文件路径
const dataPath = path.join(__dirname, fileName);
const defaultContent  = JSON.stringify({'Area': '9B'}); // 默认内容


// 读取文件内容的函数
function readFileContent(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('readFileError:', err);
        } else {
            return data
        }
    });
}


ipcMain.handle('setArea', (event, arg) => {
    console.log('the arg is ', arg)
    let area_data = {'Area': arg}
    console.log('the funcing data is ', area_data)
    console.log('the data path is ', dataPath)
    fs.writeFileSync(dataPath, JSON.stringify(area_data))
    return true
})


exports.init = function(windows){

    fs.access(dataPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`${fileName} 不存在，正在创建...`);
            // 如果文件不存在，创建文件
            fs.writeFile(dataPath, '', (err) => {
                if (err) {
                    console.error(`创建 ${dataPath} 时出错:`, err);
                } else {
                    console.log(`${dataPath} 已成功创建`);
                }
            });
        } else {
            console.log(`${dataPath} 已存在`);
        }
    });


    main_windows = windows
}


