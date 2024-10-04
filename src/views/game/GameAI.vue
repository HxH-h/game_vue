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
import { ref, onMounted, watch } from 'vue';
import { ChessBoard } from '@/componetjs/ChessBoard.js'
import { Chess } from '@/componetjs/Chess.js'
import { useStore } from "vuex"
import useWsStore from '@/store/WsSocket';
import { ElMessage } from 'element-plus'
import route from '@/router/index'
import { transform } from '@/ts/utils'
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
        // 倒计时
        const countDown = ref(Date.now() + 1000 * 60 * 60 * 7)
        // 获取websocket
        const wsstore = useWsStore();
        //获取棋盘原点
        var rect = null;
        //获取棋子对象
        var Chesses = null;
        // 获取页面跳转带来的数据
        const pagedata = history.state.data
        console.log(pagedata)


        const store = useStore()

        // TODO : 断线重连
        onMounted(() => {

            // 初始化页面
            render()

            // 判断是 断线重连 还是 新游戏
            if (pagedata === undefined || pagedata == null) {
                wsstore.sendMsg({
                    event: "startAI"
                })
            } else {
                recovery(pagedata.reconnect)
            }


            // 开启监听
            watch(() => wsstore.msg, (newValue, oldValue) => {
                const data = JSON.parse(newValue)
                //判断消息类型
                if (data.event === "match_success") {
                    let msg = JSON.parse(data.match_success)
                    store.state.gamer.turn = msg.turn
                    store.state.gamer.opponent = msg.opponent
                    store.state.gamer.status = msg.status
                    timer.value = setTimeout(() => {
                        render()
                    }, 150)
                } else if (data.event === "InitChess") {
                    console.log(data)
                    timer.value = setTimeout(() => {
                        Chesses.InitChessBoard(data.InitChess)
                    }, 150)
                } else if (data.event === "start_turn") {
                    if (data.start_turn == store.state.gamer.turn) {
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
                    if (data.end == store.state.gamer.turn) {
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
                    countDown.value = data.countDown
                } else if (data.event === "timeout") {
                    if (data.timeout == store.state.gamer.turn) {
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

                } else if (data.event === "reconnect") {
                    recovery(data.reconnect)
                }
            })
        });

        function ClickHandle(e) {

            //下棋
            var pos = Chesses.setChess(1);
            wsstore.sendMsg({
                event: "down",
                position: pos
            })

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
            store.state.gamer.turn = ''
            store.state.gamer.opponent = ''
            store.state.gamer.status = ''
        }

        function recovery(reconnect) {
            // 断线重连需要同步棋盘信息
            store.state.gamer.turn = reconnect.playerturn
            var curTurn = reconnect.curturn
            timer.value = setTimeout(() => {
                Chesses.InitChessBoard(transform(reconnect.chess))
            }, 150)
            // 判断是否为落子回合
            if (curTurn == store.state.gamer.turn) {
                ElMessage({
                    message: 'It`s your turn',
                    type: 'success',
                })
                document.getElementById("can").onclick = ClickHandle
            } else {
                document.getElementById("can").onclick = DoNothing
            }
        }

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