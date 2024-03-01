const {ipcRenderer} = require('electron')


document.getElementById('fuckingoff').addEventListener('click', function (){
    ipcRenderer.send('off')

})

document.getElementById('setting').addEventListener('click', ()=>{
    document.getElementById('seAreaBtn').value="提交"
    document.getElementById('seAreaBtn').classList.remove('btn-success')
    document.getElementById('seAreaBtn').classList.add('btn-primary')
})


async function setArea(){
    console.log('in the setArea Function')
    let area = document.getElementById('Area_select').value
    const response = await ipcRenderer.invoke('setArea', area)
    console.log('the response is ', response)
    document.getElementById('seAreaBtn').value="设置成功"
    document.getElementById('seAreaBtn').classList.remove('btn-primary')
    document.getElementById('seAreaBtn').classList.add('btn-success')
}
