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
    console.log(response);
    console.log("Success! Entry added.");
  } catch (e) {
    console.error(e.body);
  }
}

module.exports = {
  connectToNotion,
  createNote,
}