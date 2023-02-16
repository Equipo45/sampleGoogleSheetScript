const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
require("dotenv").config()

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function nextAvailibleRange(range) {
  const client = await authorize()
  const sheets = google.sheets({version: 'v4', auth:client});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `A${range}:E${range}`,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('Writing in row ' + range);
    return range;
  } else {
    range++
  }
}
async function parseMetalRequestSheet(range,metalObjet) {
  const client = await authorize()
  const sheets = google.sheets({version: 'v4', auth:client});
  appendValue("A",range,metalObjet.date,sheets)
  appendValue("B",range,metalObjet.goldPrice,sheets)
  appendValue("C",range,metalObjet.silverPrice,sheets)
  appendValue("D",range,metalObjet.paladiumPrice,sheets)
  appendValue("E",range,metalObjet.platinumPrice,sheets)
  appendValue("F",range,metalObjet.aluminiumPrice,sheets)
  appendValue("G",range,metalObjet.tinPrice,sheets)
  appendValue("H",range,metalObjet.tungstenPrice,sheets)
  appendValue("I",range,metalObjet.uraniumPrice,sheets)
  appendValue("J",range,metalObjet.zincPrice,sheets)
}

function appendValue(column,range,value,sheets) {
  sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: `${column}${range}`,
    valueInputOption: 'RAW',
    resource: value,
  })
}


module.exports = {
  nextAvailibleRange,
  parseMetalRequestSheet
}