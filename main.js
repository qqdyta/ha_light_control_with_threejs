const { app, Tray, BrowserWindow , ipcMain, Menu, shell} = require('electron')
const fs = require('fs');
const os = require('os');
const path = require('path');
const ha = require('./hafounction')
const controller = require('./controller')
const {light_control} = require("./hafounction");
let main_windows  // 主窗口
let has_init = true

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
    tray.popUpContextMenu(trayContextMenu)
  })

})
let trayContextMenu = Menu.buildFromTemplate([
  {
    label: 'STU 全开',
    click: () => {
      light_control('Mid', 'on')
      light_control('TE', 'on')
      light_control('EE', 'on')
    }
  },{
    label: 'STU 全关',
    click: () => {
      light_control('Mid', 'off')
      light_control('TE', 'off')
      light_control('EE', 'off')
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'STU 电子&结构 全开',
    click: () => {
      light_control('EE', 'on')
    }
  },{
    label: '项目   全开',
    click: () => {
      light_control('Mid', 'on')
      // light_control('TE', 'on')
      // light_control('EE', 'on')
    }
  },{
    label: '测试 软件 全开',
    click: () => {
      // light_control('Mid', 'on')
      light_control('TE', 'on')
      // light_control('EE', 'on')
    }
  },
  {
    type: 'separator'
  },{
    label: '电子 结构 全关',
    click: () => {
      // light_control('Mid', 'off')
      // light_control('TE', 'off')
      light_control('EE', 'off')
    }
  },{
    label: '项目    全关',
    click: () => {
      light_control('Mid', 'off')
      // light_control('TE', 'off')
      // light_control('EE', 'off')
    }
  },{
    label: '测试 软件 全关',
    click: () => {
      // light_control('Mid', 'off')
      light_control('TE', 'off')
      // light_control('EE', 'off')
    }
  },
  {
    type: 'separator'
  }, {
    label: '退出',
    // icon: 'resources/ico/quit.png',
    role: 'quit',
    click: () => {
      console.log("退出")
      app.quit()
    }
  }
])

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
  const userDocumentsPath = process.env.HOME || process.env.USERPROFILE;
  const configFilePath = path.join(userDocumentsPath, 'Documents', 'config.json');
  let area = "9B"
// 调用函数并输出结果
  const fileContent = checkAndReadFile(configFilePath);
  if (fileContent === false) {
    console.log('config.json 文件不存在');
    has_init = false

  } else {
    console.log('config.json 文件内容:', fileContent);
    area = JSON.parse(fileContent).area
  }
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
        // icon: './static/svg/Lightbulb-alt.png',
        click: () => {
          // main_windows.webContents.send('prevMusic')
        }
      },
      {
        label: 'IAG 全关',
        // icon: '/static/svg/Lightbulb-off.png',
        click: () => {
          // main_windows.webContents.send('prevMusic')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        // icon: 'resources/ico/quit.png',
        role: 'quit',
        click: () => {
          console.log("退出")
          app.quit()
        }
      }
    ])
  }else{
    return  Menu.buildFromTemplate([
      {
        label: '前台 全开',
        // icon: './static/svg/Lightbulb-alt.png',
        click: () => {
          light_control('Mid', 'on')
          light_control('TE', 'on')
          light_control('EE', 'on')
        }
      },
      {
        label: '前台 全关',
        // icon: './static/svg/Lightbulb-off.png',
        click: () => {
          light_control('Mid', 'off')
          light_control('TE', 'off')
          light_control('EE', 'off')

        }
      }, {
        type: 'separator'
      }, {
        label: '休息区 全开',
        // icon: './static/svg/Lightbulb-alt.png',
        click: () => {
          // main_windows.webContents.send('prevMusic')
        }
      },
      {
        label: 'IAG 全关',
        // icon: '/static/svg/Lightbulb-off.png',
        click: () => {
          // main_windows.webContents.send('prevMusic')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        // icon: 'resources/ico/quit.png',
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



function set_area(area){
  let file_name = 'config.json'
  let filePath = path.join(os.homedir(), 'Documents', file_name);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
    console.log(`Created new file at ${filePath}`);
  }
  let data = {'area': area}
  fs.writeFileSync(filePath, JSON.stringify(data))
  main_windows.webContents.send('set_area_result', true)
}


function checkAndReadFile(filePath) {
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    try {
      // 同步读取文件内容
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('读取文件时出错:', error);
      return false;
    }
  } else {
    return false;
  }
}
