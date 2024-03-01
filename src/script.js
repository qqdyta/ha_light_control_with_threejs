const {ipcRenderer} = require('electron')


document.getElementById('fuckingoff').addEventListener('click', function (){
    ipcRenderer.send('off')

})




async function setArea(){
    let area = document.getElementById('Area_select').value
    const response = await ipcRenderer.invoke('setArea', area)
    console.log('the response is ', response)
}
