import router from '../router'
import axios from 'axios'

const service = axios.create()
service.interceptors.request.use(

);
service.interceptors.response.use(function (response) {
    if(response.data.code == 3001){
        router.push({name:'login'})
    }
    return response;
},function error(response){
    return Promise.reject(error)
}

);
export default service

