const { Client } = require('@notionhq/client');
const fs = require('fs');

const NOTION_CREDENTIALS_PATH = 'config/notion.credentials.json';

let notion, databaseId;

async function connectToNotion() {
  return new Promise((resolve, reject) => {
    fs.readFile(NOTION_CREDENTIALS_PATH, (err, content) => {
      if (err) reject(`Error loading integration token: ${err}`);
      const credentials = JSON.parse(content);
      databaseId = credentials.database_id;
      notion = new Client({ auth: credentials.integration_token });
      resolve(notion);
    });
  })
}

async function createNote(title, content) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        title: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          has_children: true,
          paragraph: {
            text: [
              {
                type: 'text',
                text: { content },
              },
            ],
          },
        },
      ],
    });
    return response;
  } catch (e) {
    console.error(e.body);
  }
}

async function getRocketBookFileNames() {
  let rocketBookNotes = [];
  return new Promise((resolve, reject) => {
    fs.readdir('temp', async (err, files) => {
      if (err) reject('Error reading directory: /temp');
      for await (const fileName of files) {
        if(!fileName.includes('.gitkeep')) 
          rocketBookNotes.push(fileName);
      }
      resolve(rocketBookNotes);
    });
  })
}

async function submitRocketBookNotes() {
  const promises = [];
  const files = await getRocketBookFileNames();
  for (const fileName of files) {
    const promise = new Promise((resolve, reject) => {
      fs.readFile(`temp/${fileName}`, 'utf-8', async (err, data) => {
        if (err) reject(`Error reading file: ${fileName}`);
        const response = await createNote(fileName.split('.txt')[0], data);
        resolve(response);
      });
    })
    promises.push(promise);
  }
  await Promise.all(promises);
}

module.exports = {
  connectToNotion,
  submitRocketBookNotes,
}