export default {
    //超星账号密码
    account: "",
    passwd: "", 

    //位置签到（自由）地点, 优先匹配课名
    LocationParams: {
        //默认地点
        default: {
            address : "中国陕西省西安市长安区兴隆街道内环北路西安电子科技大学(南校区)",
            latitude : "34.1332077905055",
            latitude_gd : "34.126916",
            longitude : "108.8371326413889",
            longitude_gd : "108.830711",
        },
        //可以自定义某节课的位置, address/latitude/longitude这三个属性是必要的
        //注意：课程名称要和超星系统里的名称一样
        "量子力学": {
            //可以是任意字符串，只影响显示的地名
            //严谨一点可以把正常位置签到的地名copy过来
            address : "上海市浦东新区世纪大道1号 东方明珠广播电视塔",
            //坐标可以从超星的活动详情api拿，不知道的可以用百度地图api选点
            //https://api.map.baidu.com/lbsapi/getpoint/index.html
            latitude : "39.916505",
            longitude : "116.403766",
        }
    }

}