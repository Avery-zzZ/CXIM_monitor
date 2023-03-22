export let log = {};

let logTime = new Date().toLocaleString();
const timeDivider = '  ';
const spaces = ' '.repeat(timeDivider.length + logTime.length);

log.printAfterSpaces = (str) => {
    console.log(spaces + str);
}

log.print = (str) => {
    logTime = new Date().toLocaleString();
    console.log(logTime + timeDivider + str);
}