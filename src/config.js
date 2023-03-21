export default {
    //超星账号密码
    account: "",
    passwd: "", 

    //位置签到（自由）地点, 优先匹配课名
    LocationParams: {
        //默认地点
        default: {
            address : "西安市长安区西安电子科技大学(南校区)大学生活动中心2层 西安电子科技大学南校区-大学生活动中心小剧场",
            latitude : "34.1332077905055",
            latitude_gd : "34.126916",
            longitude : "108.8371326413889",
            longitude_gd : "108.830711",
        },
        //可以自定义某节课的位置, address/latitude/longitude这三个属性是必要的
        "test2": {
            //可以是任意字符串，只影响显示的地名
            //严谨一点可以把正常位置签到的地名copy过来
            address : "东方明珠塔",
            //坐标可以从超星的活动详情api拿，不知道的可以用百度地图api选点
            //https://api.map.baidu.com/lbsapi/getpoint/index.html
            latitude : "39.916505",
            longitude : "116.403766",
        }
    }

}