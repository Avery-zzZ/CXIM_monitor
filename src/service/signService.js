import axios from "axios";
import { cookies } from "../index.js";

export function handleSign(activeObj) {
    if (activeObj?.aid && activeObj.courseInfo) {
        getSignInfo(activeObj.aid)
            .then(
                (activeInfo) => {
                    if (activeInfo?.data?.otherId != undefined) {
                        let signTypeStr = logNewSign(activeObj, activeInfo);
                    }
                }
            )
    }
}

const timeDivider = '  ';
let logTime = new Date().toLocaleString();
const spaces = ' '.repeat(timeDivider.length + logTime.length);
function logAfterSpaces(str) {
    console.log(spaces + str);
}
function logNewSign(activeObj, activeInfo) {
    logTime = new Date().toLocaleString();
    console.log(logTime + timeDivider + 'New sign activity found');
    logAfterSpaces('- Course    ' + activeObj.courseInfo.coursename);
    logAfterSpaces('- Teacher   ' + activeObj.courseInfo.teacherfactor);
    logAfterSpaces('- ActiveId  ' + activeObj.aid);
    let type;
    switch (activeInfo.data.otherId) {
        case 0:
            if (!activeInfo.data.ifphoto) {
                type = '普通签到';
            } else {
                type = '拍照签到';
            }
            break;
        case 2:
            if (!activeInfo.data.ifrefreshewm) {
                type = '二维码签到（静态）';
            } else {
                type = '二维码签到（动态）';
            }
            break;
        case 3:
            type = '手势签到';
            break;
        case 4:
            if (!activeInfo.data.ifopenAddress) {
                type = '位置签到（自由）';
            } else {
                type = '位置签到（限制）';
            }
            break;
        case 5 :
            type = '密码签到';
            break;
        default:
            type = '未知';
            break;
    }
    logAfterSpaces('- Type      ' + type)
    if (type == '手势签到'|| type == '密码签到') {
        logAfterSpaces('- SignCode  ' + activeInfo.data.signCode)  
    }
    return type;
}

const getActiveInfoUrl = 'https://mobilelearn.chaoxing.com/v2/apis/active/getPPTActiveInfo';
function getSignInfo(aid) {
    return (axios.get(getActiveInfoUrl, {
        params: {
            activeId: aid
        },
        headers: {
            Cookie: getCookieStr()
        }
    }).then(function (response) {
        return response.data;
    }))
}

function getCookieStr() {
    let retStr = "";
    cookies.forEach(ele => {
        if (ele.domain == '.chaoxing.com') {
            retStr += ele.name + '=' + ele.value + ';';
        }
    });
    return retStr;
}