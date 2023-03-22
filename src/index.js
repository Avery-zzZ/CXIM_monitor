import puppeteer from 'puppeteer';
import handle from './msgController.js'
import Config from './config.js';

export let cookies;

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://passport2.chaoxing.com/login');
    const phoneInputBoxSelector = '#phone';
    await page.type(phoneInputBoxSelector, Config.account);
    const pwdInputBoxSelector = '#pwd';
    await page.type(pwdInputBoxSelector, Config.passwd);
    const loginBtnSelector = '#loginBtn';
    await page.waitForSelector(loginBtnSelector);
    await page.click(loginBtnSelector);
    await page.waitForResponse("https://passport2.chaoxing.com/fanyalogin");
    cookies = await page.cookies();

    page.on('console', async msg => {
        const args = msg.args();
        if (args[0] && args[0].toString() == 'JSHandle:收到文本消息--') {
            let temp = await args[1].jsonValue();
            // console.log(temp.data);
            handle(temp);
        }
    });

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await page.reload();
    });

    await page.goto('http://im.chaoxing.com/webim/me');

    // await page.close()
})();