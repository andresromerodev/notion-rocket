const { connectToGoogleDrive, listFiles, downloadFile } = require("./google/drive");

connectToGoogleDrive().then(() => downloadFile());