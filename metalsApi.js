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
        goldPrice : rates.XAU.toFixed(5).replace(".",","),
        silverPrice : rates.XAG.toFixed(5).replace(".",","),
        paladiumPrice : rates.XPD.toFixed(5).replace(".",","),
        platinumPrice : rates.XPT.toFixed(5).replace(".",","),
        aluminiumPrice : rates.ALU.toFixed(5).replace(".",","),
        tinPrice : rates.TIN.toFixed(5).replace(".",","),
        tungstenPrice : rates.TUNGSTEN.toFixed(5).replace(".",","),
        uraniumPrice : rates.URANIUM.toFixed(5).replace(".",","),
        zincPrice : rates.ZNC.toFixed(5).replace(".",",")
    }

    return metalsObject
}


module.exports = parseMetalObject