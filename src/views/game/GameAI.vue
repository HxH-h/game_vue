<template>
    <CardItem>
        <template #head><img /></template>
        <template #body>
            <el-countdown title="倒计时" :value="countDown" />
            <canvas id="can" ref="canvas" :width="canvasSize" :height="canvasSize"></canvas>
        </template>
    </CardItem>


</template>
<script>
import CardItem from '@/components/CardItem.vue'
import { ref, onMounted, onUnmounted } from 'vue';
import { ChessBoard } from '@/componetjs/ChessBoard.js'
import { Chess } from '@/componetjs/Chess.js'
import { useStore } from "vuex"
import { ElMessage } from 'element-plus'
import route from '@/router/index'
export default {
    components: {
        CardItem,
    },
    setup() {
        //棋盘参数
        const canvasSize = 600;
        const size = 19;
        const margin = 30;
        const gridSize = (canvasSize - 2 * margin) / (size - 1);
        const canvas = ref(null);
        const timer = ref()
        const countDown = ref(Date.now() + 1000 * 60 * 60 * 7)
        //获取棋盘原点
        var rect = null;
        //获取棋子对象
        var Chesses = null;
        function ClickHandle(e) {

            //下棋
            var pos = Chesses.setChess(1);
            store.state.wssocket.socket.send(JSON.stringify({
                event: "down",
                position: pos
            }))
        }
        function DoNothing() {
            ElMessage.error('It\'s not your turn')
        }
        //检测鼠标移动，并选择四角中的一角
        function MoveHandle(e) {
            var rect = canvas.value.getBoundingClientRect();
            var x = e.clientX;
            var y = e.clientY;
            x -= rect.left;
            y -= rect.top;
            x = (x - margin) / gridSize
            y = (y - margin) / gridSize

            var dx = x - parseInt(x)
            var dy = y - parseInt(y)
            if (dx > 0.5 && dy > 0.5) {
                x = parseInt(x) + 1;
                y = parseInt(y) + 1;

            } else if (dx < 0.5 && dy > 0.5) {
                x = parseInt(x);
                y = parseInt(y) + 1;

            } else if (dx > 0.5 && dy < 0.5) {
                x = parseInt(x) + 1;
                y = parseInt(y);

            } else {
                x = parseInt(x);
                y = parseInt(y);
            }
            if (x < 0 || y < 0 || x > 18 || y > 18) {
                return;
            }
            Chesses.ChessPossible(x, y)
        }

        function render() {
            const ctx = canvas.value.getContext('2d');
            rect = canvas.value.getBoundingClientRect();
            //棋盘
            new ChessBoard(ctx, canvasSize, size, margin, gridSize)
            Chesses = new Chess(ctx, margin, gridSize)
            window.addEventListener('mousemove', MoveHandle);
        }
        function gameover() {
            store.state.wssocket.opponent_name = ""
            store.state.wssocket.status = "matching"
            store.state.wssocket.turn = " "
        }
        const store = useStore()
        let socket = null
        onMounted(() => {
            render()
            socket = new WebSocket(store.state.wssocket.wsurl + '/' + store.state.token)
            store.state.wssocket.socket = socket
            socket.onopen = () => {
                console.log("connected")
                store.state.wssocket.socket.send(JSON.stringify({
                    event: "startAI"
                }))
            }

            socket.onmessage = msg => {
                const data = JSON.parse(msg.data)
                //判断消息类型
                if (data.event === "match_success") {
                    let msg = JSON.parse(data.match_success)
                    store.state.wssocket.opponent_name = msg.oppont_name
                    store.state.wssocket.status = "playing"
                    store.state.wssocket.turn = msg.turn
                    timer.value = setTimeout(() => {
                        render()
                    }, 150)
                } else if (data.event === "InitChess") {
                    console.log(data)
                    timer.value = setTimeout(() => {
                        Chesses.InitChessBoard(data.InitChess)
                    }, 150)
                } else if (data.event === "start_turn") {
                    if (data.start_turn == store.state.wssocket.turn) {
                        ElMessage({
                            message: 'It`s your turn',
                            type: 'success',
                        })
                        document.getElementById("can").onclick = ClickHandle
                    } else {
                        document.getElementById("can").onclick = DoNothing
                    }
                } else if (data.event === "synchronization") {
                    Chesses.InitChessBoard(data.synchronization)
                } else if (data.event === "end") {
                    console.log("end")
                    if (data.end == store.state.wssocket.turn) {
                        timer.value = setTimeout(() => {
                            alert('victory')
                            window.removeEventListener('mousemove', MoveHandle)
                            route.push({ name: 'gamemode' })
                        }, 150)
                    } else {
                        timer.value = setTimeout(() => {
                            alert('you lose')
                            window.removeEventListener('mousemove', MoveHandle)
                            route.push({ name: 'gamemode' })
                        }, 150)
                    }
                    timer.value = setTimeout(() => {
                        gameover()
                    }, 150)

                } else if (data.event === "countDown") {
                    console.log("countDown" + data.countDown)
                    countDown.value = data.countDown
                } else if (data.event === "timeout") {
                    if (data.timeout == store.state.wssocket.turn) {
                        timer.value = setTimeout(() => {
                            alert('time out you lose')
                            window.removeEventListener('mousemove', MoveHandle)
                            route.push({ name: 'gamemode' })
                        }, 150)
                    } else {
                        timer.value = setTimeout(() => {
                            alert('your opponter is time out ,you victory')
                            window.removeEventListener('mousemove', MoveHandle)
                            route.push({ name: 'gamemode' })
                        }, 150)
                    }
                    timer.value = setTimeout(() => {
                        gameover()
                    }, 150)
                    
                }
            }

            socket.onclose = () => {
                store.state.wssocket.status = "matching"
                store.state.wssocket.opponent_name = ""
                console.log("disconnected")
            }


        });
        onUnmounted(() => {
            socket.close()
        })

        return {
            canvas,
            canvasSize,
            store,
            ClickHandle,
            DoNothing,
            countDown
        }

    }

}

</script>
<style></style>