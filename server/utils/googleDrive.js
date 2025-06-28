// Google Drive upload function
// server/utils/googleDrive.js
const fs = require('fs');
const { google } = require('googleapis');

const KEYFILEPATH = './google-service-account.json'; // Your downloaded key
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFileToDrive = async (filePath, fileName) => {
  const driveService = google.drive({ version: 'v3', auth: await auth.getClient() });

  const fileMetadata = {
    name: fileName,
    parents: [process.env.GDRIVE_FOLDER_ID], // Folder ID from Google Drive
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = response.data.id;

  // Make file public
  await driveService.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
  return fileUrl;
};

module.exports = uploadFileToDrive;
