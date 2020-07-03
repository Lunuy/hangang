

const { getTemp } = require("../dist/index");

(async () => {
    console.log("...");
    console.log(await getTemp(new Date("2020-07-03 15:0:0")));
})()