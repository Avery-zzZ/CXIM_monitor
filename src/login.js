import { log } from './util/log.js';
import { sleep } from './util/sleep.js';
import { browser } from './index.js'
import Config from './config.js';

export async function login() {
    if (!await refreshCookies()) {
        process.exit(1);
    }
}

// export var cookies = [];

async function refreshCookies() {
    const page = await browser.newPage();
    for (let t = 0; t < 3; t++) {
        try {
            await page.goto('https://passport2.chaoxing.com/login');
            const phoneInputBoxSelector = '#phone';
            await page.type(phoneInputBoxSelector, Config.account);
            const pwdInputBoxSelector = '#pwd';
            await page.type(pwdInputBoxSelector, Config.passwd);
            const loginBtnSelector = '#loginBtn';
            await page.waitForSelector(loginBtnSelector);
            await page.click(loginBtnSelector);
            await page.waitForResponse("https://passport2.chaoxing.com/fanyalogin");
            global.cookies = await page.cookies();
            const hasFidCookie = global.cookies.some(cookie => cookie.name === 'vc');
            if (hasFidCookie) {
                await page.close();
                log.print("登录成功");
                return true;
            } else {
                await page.close();
                log.print("登录失败：账号或密码错误");
                return false;
            }

        } catch (err) {
            console.log(err);
            log.print("登录失败：网络异常（" + (t + 1) + ")");
            await sleep(30000);
            continue;
        }
    }
    await page.close();
    return false;
}