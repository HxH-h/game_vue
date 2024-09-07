const { default: axios } = require("axios")

var baseurl = 'http://localhost:8080'

async function get(path: string, ...params: any) {
    var url = baseurl + path
    for (let param of params) {
        url += ('/' + param) 
    
    }
    
    return await axios({
        method: 'get',
        url: url,
        headers: { 
            'content-type': 'application/json',
         },
    }).then(function (response: any) {
        return response.data
    }).catch(function (error: any) {
        console.log(error)
    })
}
async function post(path: string, data: any){
    return await axios({
        method: 'post',
        url: baseurl + path,
        headers: { 
            'content-type': 'application/json',
            
         },
        data: JSON.stringify(data)
    }).then(function (response: any) {
        return response.data
    }).catch(function (error: any) {
        console.log(error)

    })
}
export {
    get,
    post
}
