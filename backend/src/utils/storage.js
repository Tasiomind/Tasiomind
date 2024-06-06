import fs from 'fs';
import path from 'path';

const baseDir = path.join(__dirname, 'storage/files');

export const storage = {
  createFile: (fileName, data, callback) => {
    const filePath = path.join(baseDir, fileName + '.json');
    fs.open(filePath, 'wx', (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing file');
              }
            });
          } else {
            callback('Error writing to file');
          }
        });
      } else {
        callback('Could not create new file, it may already exist');
      }
    });
  },

  readFile: (fileName, callback) => {
    const filePath = path.join(baseDir, fileName + '.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      callback(err, data);
    });
  },

  deleteFile: (fileName, callback) => {
    const filePath = path.join(baseDir, fileName + '.json');
    fs.unlink(filePath, err => {
      if (!err) {
        callback(false);
      } else {
        callback('Error deleting file');
      }
    });
  },
};
