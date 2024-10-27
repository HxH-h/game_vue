<template>
    <CardItem :width="90" :height="90" :background="backgroundImg">
        <template #head>
            <img src="https://game-platform-hxh.oss-cn-beijing.aliyuncs.com/history.png" style="margin-left: -30vw;" />
        </template>
        <template #body>
            <canvas id="can" ref="canvas" :width="canvasSize" :height="canvasSize" style="margin-top: 3vh; margin-left: -8vw;"></canvas>
        </template>
    </CardItem>
</template>
<script>
import { ref, onMounted } from 'vue';
import CardItem from '@/components/CardItem.vue'

export default {
    components: {
        CardItem
    },
    setup() {
        const canvasSize = 500;
        const size = 19;
        const margin = 30;
        const gridSize = (canvasSize - 2 * margin) / (size - 1);
        const canvas = ref(null);
        var ctx = null

        let chessboard = ref([])
        chessboard.value = JSON.parse(history.state.params).chess
        function render() {
            ctx.fillStyle = '#DEB887'; // 使用米色背景
            ctx.fillRect(0, 0, canvasSize, canvasSize);

            // 绘制网格线
            ctx.strokeStyle = '#000000'; // 黑色线条
            for (let i = 0; i < size; i++) {
                // 垂直线
                ctx.beginPath();
                ctx.moveTo(margin + i * gridSize, margin);
                ctx.lineTo(margin + i * gridSize, canvasSize - margin);
                ctx.stroke();

                // 水平线
                ctx.beginPath();
                ctx.moveTo(margin, margin + i * gridSize);
                ctx.lineTo(canvasSize - margin, margin + i * gridSize);
                ctx.stroke();
            }

            // 绘制星位
            const starPositions = [3, 9, 15];
            starPositions.forEach(x => {
                starPositions.forEach(y => {
                    drawStar(ctx, margin + x * gridSize, margin + y * gridSize);
                });
            });
        }
        function drawStar(ctx, x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2, true);
            ctx.fillStyle = '#000000'; // 黑色星位
            ctx.fill();
        }
        function drawAllChess() {
            let x = 0;
            let y = 0;
            for (let i = 0; i < 19; i++) {
                for (let j = 0; j < 19; j++) {
                    if (chessboard.value[i][j] % 2 === 1) {
                        x = margin + gridSize * j;
                        y = margin + gridSize * i;
                        drawChess(x, y, 'black', 'white', chessboard.value[i][j])
                    } else if (chessboard.value[i][j] % 2 === 0 && chessboard.value[i][j] !== 0) {
                        x = margin + gridSize * j;
                        y = margin + gridSize * i;
                        drawChess(x, y, 'white', 'black', chessboard.value[i][j])
                    }
                }

            }
        }
        function drawChess(x, y, color, fontcolor, num) {
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            // 在棋子中央写入数字
            ctx.font = "10px Arial";
            ctx.fillStyle = fontcolor;
            ctx.textAlign = 'center';
            ctx.fillText(num, x, y + 5);

        }
        onMounted(() => {
            ctx = canvas.value.getContext('2d');
            render()
            drawAllChess()
        })

        return {
            canvasSize,
            canvas,
            backgroundImg: require('../../assets/history.png')
        }
    }
}


</script>
<style></style>