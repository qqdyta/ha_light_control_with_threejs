const { app, Tray, BrowserWindow , ipcMain, Menu, shell} = require('electron')
const fs = require('fs');
const os = require('os');
const path = require('path');


let main_windows

// 定义文件夹路径
const documentsPath = path.join(process.env.HOME, 'Documents'); // 用户的Documents文件夹路径
const dataPath = path.join(documentsPath, 'data'); // data文件夹路径
const filePath = path.join(dataPath, 'config.json'); // data.txt文件路径
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
    fs.writeFileSync(filePath, JSON.stringify(area_data))
    return true
})


exports.init = function(windows){
// 检查并创建data文件夹
    fs.access(dataPath, fs.constants.F_OK, (err) => {
        if (err) {
            // data文件夹不存在，创建data文件夹
            fs.mkdir(dataPath, { recursive: true }, (err) => {
                if (err) {
                    console.error('CreateDataFolderFail:', err);
                } else {
                    fs.writeFile(filePath, defaultContent, (err) => {
                        if (err) {
                            console.error('WriteError:', err);
                        } else {
                            console.log('CreateFile');
                            readFileContent(filePath);
                        }
                    });
                }
            });
        } else {
            fs.access(filePath, fs.constants.F_OK, (err) => {

                if (err) {
                    // 文件不存在，创建文件并写入默认内容
                    console.log('FileNotExist,CreateFileAndWriteDefaultContent');
                    fs.writeFile(filePath, defaultContent, (err) => {
                        if (err) {
                            console.error('Create File Fail:', err);
                        } else {
                            console.log('Create File');
                            readFileContent(filePath);
                        }
                    });
                } else {
                    // 文件存在，读取文件内容
                    console.log('File Exit,ReadFileContent');
                    readFileContent(filePath);
                }
            });
        }
    });
    main_windows = windows
}


