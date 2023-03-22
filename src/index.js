import puppeteer from 'puppeteer';
import handle from './msgController.js'
import { login } from './login.js';
import { log } from './util/log.js'

export const browser = await puppeteer.launch({ headless: false });

await login();

const page = await browser.newPage();

page.on('console', async msg => {
    const args = msg.args();
    if (args[0] && args[0].toString() == 'JSHandle:收到文本消息--') {
        let temp = await args[1].jsonValue();
        // console.log(temp.data);
        handle(temp);
    }
});

page.on('dialog', async dialog => {
    log.print("发生弹窗：" + dialog.message() + "，刷新页面")
    await page.reload();
});

page.on('request', async request => {
    if (request.redirectChain().length && request.redirectChain()[0].url == "http://im.chaoxing.com/webim/me") {
        log.print("账号已登出，重新登录")
        await login();
    }
});

await page.goto('http://im.chaoxing.com/webim/me');

    // await page.close()