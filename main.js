const { app, Tray, BrowserWindow , ipcMain, Menu, shell} = require('electron')
const fs = require('fs');
const os = require('os');
const path = require('path');
const ha = require('./hafounction')
const controller = require('./controller')
const {light_control} = require("./hafounction");
let main_windows  // 主窗口
let has_init = true


const documentsPath = path.join(process.env.HOME, 'Documents'); // 用户的Documents文件夹路径
const dataPath = path.join(documentsPath, 'data'); // data文件夹路径
const filePath = path.join(dataPath, 'config.json'); // data.txt文件路径



// 创建主窗口
function createMainWindows(){
  main_windows = new BrowserWindow({
    width: 1280,
    height: 700,
    //titleBarStyle: 'hidden',

    frame:true,
    // icon: "./static/light.ico",
    webPreferences: {
        nodeIntegration: true,
        //preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false,
        devTools: true,
    }
  })


  main_windows.setMenuBarVisibility(false)
  main_windows.loadFile('index.html')
  controller.init(main_windows)
  // 监听窗口的关闭事件
  main_windows.on('close', (event) => {

    // 最小化窗口到任务栏
    main_windows.hide();
  });
  // main_windows.webContents.openDevTools()
}

ipcMain.on('off', (event, arg) => {
  main_windows.hide();
})

const appPath = app.getAppPath()
const srcPath = path.join(appPath, 'src')
const iconPath = path.join(srcPath, 'light.ico')
app.whenReady().then(() => {
  const tray = new Tray(iconPath)

  // 设置hover字符
  tray.setToolTip("灯光控制")
  createMainWindows();
    tray.on('click', () => {
        main_windows.show()
    })


  // 设置右键菜单
  tray.on('right-click', () => {
    tray.popUpContextMenu(trayInit())
  })

})
ipcMain.on('clicked', (event, arg) => {
  console.log('the data is ', arg)
  let id = arg.split('-')[0]
  let state = arg.split('-')[1]
    ha.light_control(id, state)
})

// 主窗口关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
function trayInit(){
  let area = '9B'
// 调用函数并输出结果
  const fileContent = checkAndReadFile(filePath);
  if (fileContent === false) {
    console.log('config.json Not exits');
    has_init = false
  } else {
    console.log('config.json data is:', fileContent);
    area = JSON.parse(fileContent).Area
  }

  console.log('the area is ', area)

  if(area == '9B'){
    return  Menu.buildFromTemplate([
      {
        label: 'STU 全开',
        // icon: './static/svg/Lightbulb-alt.png',
        click: () => {
          light_control('Mid', 'on')
          light_control('TE', 'on')
          light_control('EE', 'on')
        }
      },
      {
        label: 'STU 全关',
        // icon: './static/svg/Lightbulb-off.png',
        click: () => {
          light_control('Mid', 'off')
          light_control('TE', 'off')
          light_control('EE', 'off')

        }
      }, {
        type: 'separator'
      }, {
        label: 'IAG 全开',
        click: () => {

        }
      },
      {
        label: 'IAG 全关',
        click: () => {
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else if(area == '9A'){
    return  Menu.buildFromTemplate([
      {
        label: '前台 全开',
        click: () => {
          light_control('Front', 'on')
        }
      },
      {
        label: '前台 全关',
        click: () => {
          light_control('Front', 'off')
        }
      }, {
        type: 'separator'
      }, {
        label: '休息区 全开',
        click: () => {
          light_control('REST', 'on')
        }
      },{
        label: '休息区 全关',
        click: () => {
          light_control('REST', 'off')
        }
      },
      {
        type: 'separator'
      },{
        label: 'COM HR 开',
        click: () => {
          light_control('COM', 'on')
        }
      },
      {
        label: 'COM HR 关',
        click: () => {
          light_control('COM', 'off')
        }
      }, {
        type: 'separator'
      },{
        label: 'SCM OPG 开',
        click: () => {
          light_control('SCM', 'on')
        }
      },
      {
        label: 'SCM OPG 关',
        click: () => {
          light_control('SCM', 'off')
        }
      }, {
        type: 'separator'
      },
      {
        label: '退出',

        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else if(area == '9BIAG'){
    return  Menu.buildFromTemplate([
      {
        label: 'IAG东  开',
        click: () => {
          light_control('IAGE', 'on')
        }
      },
      {
        label: 'IAG东  关',
        click: () => {
          light_control('IAGE', 'off')
        }
      }, {
        type: 'separator'
      }, {
        label: 'IAG西 开',
        click: () => {
          light_control('IAGW', 'on')
        }
      },{
        label: 'IAG西 开',
        click: () => {
          light_control('IAGW', 'off')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else if(area == '9BSTU'){
    return  Menu.buildFromTemplate([
      {
        label: 'STU 硬件 结构 开',
        click: () => {
          light_control('EE', 'on')
        }
      },{
        label: 'STU 项目  开',
        click: () => {
          light_control('PM', 'on')
        }
      },{
        label: 'STU 测试 软件 开',
        click: () => {
          light_control('TE', 'on')
        }
      }, {
        type: 'separator'
      },{
        label: 'STU 硬件 结构 关',
        click: () => {
          light_control('EE', 'off')
        }
      },{
        label: 'STU 项目  关',
        click: () => {
          light_control('PM', 'off')
        }
      },{
        label: 'STU 测试 软件 关',
        click: () => {
          light_control('TE', 'off')
        }
      },{
        type: 'separator'
      },
      {
        label: '退出',

        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else if(area == '9AHR'){
    return  Menu.buildFromTemplate([
      {
        label: 'HR COM 开',
        click: () => {
          light_control('HR', 'on')
        }
      },
      {
        label: 'HR COM 关',
        click: () => {
          light_control('HR', 'off')
        }
      }, {
        type: 'separator'
      }, {
        label: 'OPG 开',
        click: () => {
          light_control('OPG', 'on')
        }
      },{
        label: 'OPG 关',
        click: () => {
          light_control('OPG', 'off')
        }
      },
      {
        type: 'separator'
      },{
        label: 'A区 全开',
        click: () => {
          light_control('9A', 'on')
        }
      },
      {
        label: 'A区 全关',
        click: () => {
          light_control('9B', 'off')
        }
      },{
        type: 'separator'
      },{
        label: '休息区 全开',
        click: () => {
          light_control('REST', 'on')
        }
      },{
        label: '休息区 全关',
        click: () => {
          light_control('REST', 'off')
        }
      },{
        type: 'separator'
      },{
        label: '退出',

        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else if(area == '9ASMG'){
    return  Menu.buildFromTemplate([
      {
        label: 'SMG 开',
        click: () => {
          light_control('SMG', 'on')
        }
      },
      {
        label: 'SMG 关',
        click: () => {
          light_control('SMG', 'off')
        }
      }, {
        type: 'separator'
      }, {
        label: '销售 开',
        click: () => {
          light_control('SELL', 'on')
        }
      },{
        label: '销售 关',
        click: () => {
          light_control('SELL', 'off')
        }
      },
      {
        type: 'separator'
      },{
        type: 'separator'
      },{
        label: '退出',
        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else if(area == '9AFront'){
    return  Menu.buildFromTemplate([
      {
        label: '前台 全开',
        click: () => {
          light_control('Front', 'on')
        }
      },
      {
        label: '前台 全关',
        click: () => {
          light_control('Front', 'off')
        }
      },{
        type: 'separator'
      },{
        label: '休息区 全开',
        click: () => {
          light_control('REST', 'on')
        }
      },{
        label: '休息区 全关',
        click: () => {
          light_control('REST', 'off')
        }
      },{
        type: 'separator'
      },{
        label: 'COM HR 开',
        click: () => {
          light_control('COM', 'on')
        }
      },{
        label: 'COM HR 关',
        click: () => {
          light_control('COM', 'off')
        }
      },{
        type: 'separator'
      },{
        label: 'SCM OPG 开',
        click: () => {
          light_control('SCM', 'on')
        }
      },{
        label: 'SCM OPG 关',
        click: () => {
          light_control('SCM', 'off')
        }
      },{
        type: 'separator'
      },{
        label: '退出',

        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
  ])
  }
}
ipcMain.on('set_area', (event, arg) => {
  console.log('the area is ', arg)
})

function checkAndReadFile(filePath) {
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    try {
      // 同步读取文件内容
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('readFile fail:', error);
      return false;
    }
  } else {
    console.log('FileNotExist:', filePath);
    return false;
  }
}
