import axios from "axios";
import { cookies } from "../index.js";
import Config from "../config.js";

export function handleSign(activeObj) {
    if (activeObj?.aid && activeObj.courseInfo) {
        getSignInfo(activeObj.aid)
            .then(
                (activeInfo) => {
                    if (activeInfo?.data?.otherId != undefined) {
                        let signTypeStr = logNewSign(activeObj, activeInfo);
                        let result = sign(signTypeStr, activeObj, activeInfo);
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
        case 5:
            type = '密码签到';
            break;
        default:
            type = '未知';
            break;
    }
    logAfterSpaces('- Type      ' + type)
    if (type == '手势签到' || type == '密码签到') {
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

const presignUrl = "https://mobilelearn.chaoxing.com/newsign/preSign"
const signUrl = "https://mobilelearn.chaoxing.com/pptSign/stuSignajax"
async function sign(signTypeStr, activeObj, activeInfo) {
    await axios.get(presignUrl, {
        params: {
            "activePrimaryId": activeObj.aid,
            "genral": "1",
            "sys": "1",
            "ls": "1",
            "appType": "15",
            "tid": "",
            "ut": "s",
        },
        headers: {
            Cookie: getCookieStr()
        }
    }).then(function (response) {
        console.log(response.data);
    })

    let baseParams = { activeId: activeObj.aid };
    let extraParams = await getExtraParams(signTypeStr, activeObj, activeInfo);

    await axios.get(signUrl, {
        params: Object.assign({}, baseParams, extraParams),
        headers: {
            Cookie: getCookieStr()
        }
    }).then(response => {
        console.log(response.data);
    })
}

function getExtraParams(signTypeStr, activeObj, activeInfo) {
    switch (signTypeStr) {
        case '普通签到':
        case '手势签到':
        case '密码签到':
            return undefined;
        case '位置签到（自由）':
        case '位置签到（限制）':
            return activeInfo.data.locationLatitude ?
                {
                    address: activeInfo.data.locationText,
                    latitude: activeInfo.data.locationLatitude,
                    latitude_gd: activeInfo.data.locationLatitude_gd,
                    longitude: activeInfo.data.locationLongitude,
                    longitude_gd: activeInfo.data.locationLongitude_gd,
                    ifTiJiao: "1",
                } : Config.defaultLocationParams

    }
}