function transform(chess: string) {
    // 解压字符串
    var s = ""
    var temp = "0000000000000000000"
    var empty = true
    for (var i = 0; i < chess.length; i++) {
        if (chess[i] >= 'a' && chess[i] <= 'z') {

            for (var j = 0; j < chess[i].charCodeAt(0) - 'a'.charCodeAt(0); j++) {
                s += "0"
            }
            continue
        } else if (chess[i] == ',') {
            if (empty) {
                s += temp
            }
            empty = true
        } else {
            empty = false
        }
        s += chess[i]
    }
    // 字符串转棋盘
    var ret = [] as number[][]
    for (let i = 0; i < 19; i++) {
        ret[i] = [];
    }
    var j = 0, k = 0;
    var tempnum = "";
    var flag = false;
    for (var i = 0; i < s.length; i++) {

        if (s[i] == '/' || s[i] == ',') {
            j++;
            k = 0;
            continue;
        }
        if (s[i] == '(') {
            flag = true;
            continue;
        }
        if (s[i] == ')') {
            ret[j][k++] = parseInt(tempnum)
            tempnum = "";
            flag = false;
            continue;
        }
        if (flag) {
            tempnum += s[i];
        } else {

            var c = parseInt(s[i]);
            if (c == 0) {
                ret[j][k++] = 0;
            } else {
                ret[j][k++] = c
            }
        }

    }
    return ret;

}


export{
    transform
}