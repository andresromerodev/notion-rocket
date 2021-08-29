const { connectToGoogleDrive, listFiles } = require("./google/drive");

connectToGoogleDrive().then(() => listFiles());