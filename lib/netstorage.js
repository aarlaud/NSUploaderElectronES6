const Netstorage = require('netstorageapi');
//var configJson = require('../settings/settings.json');
import {getSettings} from './settings';

var ns = "";
var connectedStatus = true;
var dir_list;

export const isNSConnected = () => {
  return connectedStatus;
}

export const connectNS = () => {
  if(getSettings().hostname){
    let config = getSettings();
    config.ssl = false;
    ns = new Netstorage(config);
  }
}
connectNS();

export const listDir = (path) => {
  return new Promise((resolve, reject) => {
    if(!ns) resolve('unconfigured');
    ns.dir(path, (error, response, body) => {
      if (error) { // errors other than http response codes
        console.error(error);
        connectedStatus = false;
        reject(error);
      }
      // console.log(response);
      // console.log(body);
      if(response.statusCode == 404){
        reject({statusCode: "404", message: '404 - Directory not found'});
      }
      if(response.statusCode == 403){
        reject({statusCode: "403", message: '403 - Request unauthorized, please review your Netstorage settings'});
      }
      if (response.statusCode == 200) {
        //console.log(body.stat)

        if(body.stat.file){
          dir_list = body.stat.file;
        } else {
            dir_list = "";
        }
        connectedStatus = true;
        resolve(dir_list);
      }
    });
  });
}

export const deleteFile = (path) => {
  return new Promise((resolve, reject) => {
    ns.delete(path, (error, response, body) => {
      let deleteResponse;
      if (error) { // errors other than http response codes
        console.error(error);
        reject(error)
      }
      console.log(response);
      if (response.statusCode == 200) {
        // console.log(body)
        if(body.message){
          deleteResponse = body.message;
        } else {
            deleteResponse = "";
        }

        resolve(deleteResponse);
      }
    });
  });
}

export const deleteDir = (path) => {
  return new Promise((resolve, reject) => {
    ns.rmdir(path, (error, response, body) => {
      let deleteResponse;
      if (error) { // errors other than http response codes
        console.error(error);
        reject(error)
      }
      if (response.statusCode == 200) {

        if(body.message){
          deleteResponse = body.message;
        } else {
            deleteResponse = "";
        }

        resolve(deleteResponse);
      }
    });
  });
}

export const uploadFile = (sourcePath, destinationPath) => {
  return new Promise((resolve, reject) => {
    ns.upload(sourcePath,destinationPath, (error, response, body) => {
      let uploadResponse;
      if (error) { // errors other than http response codes
        console.error(error);
        reject(error)
      }
      if (response.statusCode == 200) {

        if(body.message){
          uploadResponse = body.message;
        } else {
            uploadResponse = "";
        }

        resolve(uploadResponse);
      }
    });
  });
}

export const mkDir = (folderPath) => {
  return new Promise((resolve, reject) => {
    ns.mkdir(folderPath, (error, response, body) => {
      let mkdirResponse;
      if (error) { // errors other than http response codes
        console.error(error);
        reject(error)
      }
      if (response.statusCode == 200) {

        if(body.message){
          mkdirResponse = body.message;
        } else {
            mkdirResponse = "";
        }

        resolve(mkdirResponse);
      }
    });
  });
}


export const downloadFile = (sourceNSPath, destinationLocal) => {
  return new Promise((resolve, reject) => {
    ns.download(sourceNSPath, destinationLocal, (error, response, body) => {
      let downloadResponse;
      if (error) { // errors other than http response codes
        console.error(error);
        reject(error)
      }
      if (response.statusCode == 200) {

        if(body.message){
          downloadResponse = body.message;
        } else {
            downloadResponse = "";
        }

        resolve(downloadResponse);
      }
    });
  });
}
