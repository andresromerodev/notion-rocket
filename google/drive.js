const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'google/token.json';

let drive;

async function connectToGoogleDrive() {
  return new Promise((resolve, reject) => {
    fs.readFile('google/credentials.json', (err, content) => {
      if (err) reject(`Error loading client secret file: ${err}`);
      authorize(JSON.parse(content), resolve, reject);
    });
  })
}

function authorize(credentials, resolve, reject) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, resolve, reject);
    oAuth2Client.setCredentials(JSON.parse(token));
    drive = google.drive({ version: 'v3', auth: oAuth2Client });
    resolve(drive);
  });
}

function getAccessToken(oAuth2Client, resolve, reject) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) reject('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) reject(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      drive = google.drive({ version: 'v3', auth: oAuth2Client });
      resolve(drive);
    });
  });
}

function listFiles() {
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

async function downloadFile() {
  const fileId = 'not_a_real_google_drive_id';
  const dest = 'assets/transcription.txt';
  drive.files.export(
    { fileId: fileId,
      mimeType: 'text/plain' }
  ).then(res => {
    console.log(res.data)
    fs.writeFileSync(dest, res.data, { flag: 'a+' });
  }).catch((e) => console.log(e)); 
}

module.exports = {
  connectToGoogleDrive,
  listFiles,
  downloadFile,
}