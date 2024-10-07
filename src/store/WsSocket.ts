import { defineStore } from 'pinia'
import { useStore } from 'vuex';

const url = 'ws://localhost:8080/websocket'
// TODO 断线重连
const useWsStore = defineStore('websocket', {

    state: () => ({
        ws: undefined as WebSocket | undefined,
        msg: '',
        heartCheckTime: 40000,
        heartBeat: undefined as any | undefined,
        disConnection: undefined as any | undefined,
        timeout: 50000,
    }),
    actions: {
        createWs() {
            const store = useStore();
            try {
                this.ws = new WebSocket(url + '/' + store.state.token)
                this.initWs()
            } catch (error) {
                console.log(error)
            }
        },
        initWs() {
            if (!this.ws) return
            this.ws.onopen = () => {
                console.log('连接成功')
                // 心跳检测
                this.heartCheck()
            }
            this.ws.onmessage = (e) => {
                if (e.data === 'pang') {
                    this.heartCheck()
                    return
                }
                this.msg = e.data
                // 心跳检测
                this.heartCheck()
            }
            this.ws.onclose = () => {
                console.log('连接关闭')
            }
            this.ws.onerror = () => {
                console.log('连接错误')
            }
        },
        sendMsg(msg: any) {
            // 判断ws是否存在
            if (!this.ws) return
            // 判断websocket 通道是否处于打开状态
            if (this.ws.readyState === WebSocket.OPEN) {
                // 封装并发送消息
                this.ws.send(JSON.stringify(msg))
            } else {
                console.log('连接未建立')
            }
        },
        heartCheck() {
            console.log('heart check')
            // 清除上一次心跳
            if (this.heartBeat) this.clearTime()
            // 延时心跳
            this.heartBeat = setTimeout(() => {
                this.sendMsg({
                    event: 'ping'
                })
                // 超时断连
                this.disConnection = setTimeout(() => {
                    this.close()
                }, this.timeout)
            }, this.heartCheckTime)

        },
        clearTime() {
            if (this.heartBeat) clearTimeout(this.heartBeat)
            if (this.disConnection) clearTimeout(this.disConnection)
        },
        getMsg() {
            return this.msg
        },
        close() {
            if (this.ws) {
                this.ws.close()
                this.ws = undefined
            }
        }
    }
})
export default useWsStore