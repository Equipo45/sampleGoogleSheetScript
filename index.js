const parseMetalObject = require("./metalsApi")
const { parseMetalRequestSheet , nextAvailibleRange } = require("./sheetManager")


const monitor = async () => {
    let range = 2
    const metalObject = await parseMetalObject()
    range = await nextAvailibleRange(range)
    await parseMetalRequestSheet(range,metalObject)
}
setInterval(monitor(),24 * 60 * 60 * 1000)
