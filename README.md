Hangang
--------
# Hangang
You can get temperature of Hangang / Han River. 한강 수온 API

# Example
```js
const { getTemp } = require("hangang");

(async () => {
    console.log(`Hangang temperature : ${await getTemp()}°C`);
})()
```