# notion-rocket 🚀🚀
A CLI tool to sync your RocketBook notes with Notion.

## Google Drive API
Before using the CLI make sure to create a Google Cloud Platform project with the Google Drive API enabled:

1. To create a project and enable an API, refer to [Create a project and enable the API](https://developers.google.com/workspace/guides/create-project). 
**Note**: If you already have a Google account is very likely you have a Google Cloud Platform account as well but, if that's not the case you can also [create a new Google account](https://support.google.com/accounts/answer/27441?hl=en).

2. Create authorization credentials for the application, to learn how to create credentials for a desktop application, refer to [Create credentials](https://developers.google.com/workspace/guides/create-credentials). Make sure to download the OAuth client created JSON as you will need it to run the app.

3. Once the project and the credentials are setup you will need to enable the Google Drive API, to enable the Google Drive API you can do it from the [API and Services Management Portal](https://console.cloud.google.com/apis/api/drive.googleapis.com/overview)
