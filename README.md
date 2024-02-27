## 介绍

软件打开以后是A区与B区的模型，通过预设的区域展示相应办公室的照明状态， 同时在window的任务栏中会创建一个任务图标作为后台存留。主界面通过鼠标左键拖拽与点击相应区域的桌面来控制相应区域的灯光照明，点击右上角的红色后台按钮软件将会退到后台运行，此时右键点击任务栏图标可以看到集成的区域一键开关。

软件通过调用局域网内的Home Assistant REST API 对办公空间的照明进行控制。位于hafounction.js中的light_control函数中对id的判断是一个全非的结果，我将所有的id的最后一个字母重写了一遍以防止你在测试的时候影响到9楼的灯光，==> **请绝对不要上班时间尝试着控制一下9楼的灯光，突然亮灭的灯光会影响同事们的工作！** <== 虽然不是我干的，但是9楼的同事还是会打我的。

### 安装
首先请安装node.js，然后在项目根目录下运行
```npm install ```
以安装项目所需的依赖。
然后在项目根目录下运行
```shell npm start ```
以启动项目。
如果想要编译成exe文件，可以在项目根目录下运行
```shell npm run package-win ```
进行打包。 electron包的安装可能报错，网络问题而已。想办法解决。


### 功能列表

- 实时渲染的展现办公环境的模型交互界面
- 可以设置使用者的所处区域以实现更精细的控制
- 可定义的任务栏一键控制功能列表
- 低性能开销，适合长期后台驻留
- 实现窗帘的自动开合

## 目前的进度

目前已经完成了9楼B区STU部分的功能，下一阶段将会开始进行IAG区域的控制与集成。



## 目前已知的问题

1. **启动以后没有对灯光的实际状态进行同步，而是默认的都是打开的状态。可能会导致软件中灯光的状态与实际的状态不一致，可能会导致你第一次点击相应区域的时候是无效的**
2. **缺少A区的gltf模型， 开发者短期内没有时间再画一个A区了，需要有Blender或者其他3D软件技能的小伙伴加入**

