const boxen = require('boxen');
const chalk = require('chalk');
const figlet = require('figlet');

const { connectToGoogleDrive, downloadRocketBookNotes } = require('./google/drive');
const { connectToNotion, submitRocketBookNotes } = require('./notion/notion');

async function intro() {
  return new Promise((resolve, reject) => {
    figlet('Notion Rocket', function(err, data) {
      if (err) reject('Something went wrong');
      resolve(data);
    });
  })
}

function errorHandler({ stack }) {
  console.error('\n' + chalk.redBright(stack));
  process.exit(1);
}

async function main() {
  await intro();
  await connectToGoogleDrive();
  await downloadRocketBookNotes();
  await connectToNotion();
  await submitRocketBookNotes();
  
  console.log(
    chalk.green(
      boxen(
        '✨ 🚀 All notes are in sync! 🚀 ✨', { padding: 1 }
      )
    )
  )
}


main().then(() => process.exit(0)).catch(errorHandler);
