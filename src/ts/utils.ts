// 字符串转棋盘
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



export const DeviceTYPE = {
    UNKNOWN: 0,
    MOBILE: 1,
    DESKTOP: 2
}
export const BrowserTYPE = {
    UNKNOWN: 0,
    IE: 1,
    CHROME: 2,
    FIREFOX: 3,
    SAFARI: 4,
    OPERA: 5,
    EDGE: 6,
}
// 检测浏览器信息
function checkBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    let browserType = BrowserTYPE.UNKNOWN;
    let deviceType = DeviceTYPE.UNKNOWN;

    // Detect browser type
    if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg') === -1 && userAgent.indexOf('opr') === -1) {
        browserType = BrowserTYPE.CHROME;
    } else if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) {
        browserType = BrowserTYPE.SAFARI
    } else if (userAgent.indexOf('firefox') > -1) {
        browserType = BrowserTYPE.FIREFOX
    } else if (userAgent.indexOf('opera') > -1 || userAgent.indexOf('opr') > -1) {
        browserType = BrowserTYPE.OPERA
    } else if (userAgent.indexOf('edg') > -1) {
        browserType = BrowserTYPE.EDGE
    } else if (userAgent.indexOf('trident') > -1) {
        browserType = BrowserTYPE.IE
    }

    // Detect device type
    if (userAgent.indexOf('mobi') > -1 || userAgent.indexOf('android') > -1 || userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1) {
        deviceType = DeviceTYPE.MOBILE;
    } else {
        deviceType = DeviceTYPE.DESKTOP;
    }

    return { browserType, deviceType };
}

export {
    transform,
    checkBrowser
}