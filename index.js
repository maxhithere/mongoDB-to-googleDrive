const fs = require('fs');
const { google } = require('googleapis');
const { exec } = require('child-process-promise');
const { vars, oAuth2Client } = require('./config');

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const dumpDatabase = async () => {
  const baseDump = 'dumps';
  const dbDumpFolderName = `db_dump_${new Date().toISOString()}`;
  
  const dbDumpPath = `${baseDump}/${dbDumpFolderName}`;
  await exec(`mongodump --uri=${vars.DB} --out ${dbDumpPath}`);

  const compressedFileName = `${new Date()
    .toDateString()
    .split(' ')
    .join('_')}.tar.gz`;
  await exec(`tar -zcvf ${compressedFileName} ${dbDumpPath}`);

  return compressedFileName;
};


const uploadToDrive = async (fileName) => {
  
  const { driveBackupId } = vars;
  const uploadRes = await drive.files.create({
    resource: {
      name: fileName,
      parents: [ driveBackupId ],
    },
    media: {
      body: fs.createReadStream(fileName),
    },
  });
  return uploadRes.data.id;
};


  const dbDumpPath = await dumpDatabase().then(() => console.log('Dumped Database'))
  const fileId = await uploadToDrive(dbDumpPath).then(() => console.log(`Uploaded to Google Drive. File ID: ${fileId}`))
