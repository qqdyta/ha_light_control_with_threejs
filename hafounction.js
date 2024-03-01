const http = require('http');


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhNjBkYzkzMjViOTE0ZDFmOTEwN2ZhM2EzNDM4ZWUwMyIsImlhdCI6MTcwNDMzMTY2OCwiZXhwIjoyMDE5NjkxNjY4fQ.YH1jnG7FLiP0yW1kvrLVncmJ0qase8axFnirTYm316o'


function light_on(id){
    return new Promise((resolve, reject) => {
        const url = 'http://192.168.12.253:8123/api/services/switch/turn_on'
        const data = {
            entity_id: id + 'e'
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 告诉服务器我们发送的是JSON数据
                'Authorization': `Bearer ${token}` // 假设您的token需要以Bearer方式添加到头部
            },
            body: JSON.stringify(data) // 将JavaScript对象转换为JSON字符串
        })
            .then(response => {
                if (!response.ok) {
                    reject(response)
                }
                return response.json(); // 解析响应为JSON，如果服务器返回的是JSON的话
            })
            .then(jsonData => {
                // 处理响应数据
               resolve(jsonData)
            })
            .catch(error => {
                // 处理请求过程中的错误
                reject(error)
            });
    })
}


function light_off(id){
    return new Promise((resolve, reject) => {
        const url = 'http://192.168.12.253:8123/api/services/switch/turn_off'
        const data = {
            entity_id: id
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 告诉服务器我们发送的是JSON数据
                'Authorization': `Bearer ${token}` // 假设您的token需要以Bearer方式添加到头部
            },
            body: JSON.stringify(data) // 将JavaScript对象转换为JSON字符串
        })
            .then(response => {
                if (!response.ok) {
                    reject(response)
                }
                return response.json(); // 解析响应为JSON，如果服务器返回的是JSON的话
            })
            .then(jsonData => {
                // 处理响应数据
                resolve(jsonData)
            })
            .catch(error => {
                // 处理请求过程中的错误
                reject(error)
            });
    })
}

// 请慎重修改id，
exports.light_control = function light_control(id, state) {
    return new Promise((resolve, reject) => {
        if(id == 'Mid'){
            if(state == 'on'){

                light_on('switch.9b_stu_test_switch_3')
                light_on('switch.9b_stu_test_switch_4')
                light_on('switch.9b_stu_ee_switch_1')
            }else{
                light_off('switch.9b_stu_test_switch_3')
                light_off('switch.9b_stu_test_switch_4')
                light_off('switch.9b_stu_ee_switch_1')
            }
        }else if(id  == "TE"){
            if(state == 'on'){
                light_on('switch.9b_stu_test_switch_1')
                light_on('switch.9b_stu_test_switch_2')
            }else{
                light_off('switch.9b_stu_test_switch_1')
                light_off('switch.9b_stu_test_switch_2')
            }
        }else if(id == "EE"){
            if(state == 'on'){
                light_on('switch.9b_stu_ee_switch_2')
                light_on('switch.9b_stu_ee_switch_3')
            }else{
                light_off('switch.9b_stu_ee_switch_2')
                light_off('switch.9b_stu_ee_switch_3')
            }
        }
    })
}


exports.ha_init = function (){

}
