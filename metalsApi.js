const axios = require("axios")
require("dotenv").config()

const API_KEY= "?access_key=" + process.env.API_KEY
const MAIN_API_URL = "https://metals-api.com/api/latest"
const BASE_CURRENCY = "&base=EUR"
const QUERY_METALS = ["ALU","XAU","XAG","XPD","XPT","TIN","TUNGSTEN","URANIUM","ZNC"]

function setUrl(){
    return MAIN_API_URL + API_KEY + BASE_CURRENCY + `&symbols =${QUERY_METALS.join(",")}`
}

async function parseMetalObject() {
    const response = await axios.get(setUrl())
    const data = response.data
    const base = data.base
    const rates = data.rates
    const metalsObject = {
        date : new Date().toISOString().trim(),
        goldPrice : rates.XAU + base,
        silverPrice : rates.XAG + base,
        paladiumPrice : rates.XPD + base,
        platinumPrice : rates.XPT + base,
        aluminiumPrice : rates.ALU + base,
        tinPrice : rates.TIN + base,
        tungstenPrice : rates.TUNGSTEN + base,
        uraniumPrice : rates.URANIUM + base,
        zincPrice : rates.ZNC + base
    }

    return metalsObject
}


module.exports = parseMetalObject