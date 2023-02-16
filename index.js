const parseMetalObject = require("./metalsApi")
const { parseMetalRequestSheet , nextAvailibleRange } = require("./sheetManager")


const monitor = async () => {
    let range = 2
    const metalObject = await parseMetalObject()
    range = await nextAvailibleRange(range)
    parseMetalRequestSheet(range,metalObject)
}

monitor()