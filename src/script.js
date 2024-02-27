const {ipcRenderer} = require('electron')


document.getElementById('fuckingoff').addEventListener('click', function (){
    ipcRenderer.send('off')

})




