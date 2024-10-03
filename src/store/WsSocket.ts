import { defineStore } from 'pinia'
const useWsStore = defineStore('websocket', {

    state: () => ({
        ws: undefined as WebSocket | undefined,
        msg: ''
    }),
    actions: {
        createWs(url: any, token: any) {
            try {
                this.ws = new WebSocket(url + '/' + token)
                this.initWs()
            }catch (error) {
                console.log(error)
            }       
        },
        initWs() {
            if (!this.ws) return
            this.ws.onopen = () => {
                console.log('连接成功')
            }
            this.ws.onmessage = (e) => {
                this.msg = e.data
            
            }
            this.ws.onclose = () => {
                console.log('连接关闭')
            }
            this.ws.onerror = () => {
                console.log('连接错误')
            }
        },
        sendMsg(msg:any) {
            // 判断ws是否存在
            if (!this.ws) return
            // 判断websocket 通道是否处于打开状态
            if(this.ws.readyState === WebSocket.OPEN){
                // 封装并发送消息
                this.ws.send(JSON.stringify(msg))
            }else{
                console.log('连接未建立')
            }
        },
        getMsg(){
            return this.msg
        },
        close(){
            if(this.ws){
                this.ws.close()
            }
        }
    }
})
export default useWsStore