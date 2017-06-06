'use babel';

import React, {Component} from 'react';
import App from '../components/main';
import {isNSConnected, connectNS, listDir, deleteFile, deleteDir, uploadFile, mkDir, downloadFile} from '../lib/netstorage';
import {getSettings, setSettings} from '../lib/settings';

class Root extends Component{



  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.NSDelete = this.NSDelete.bind(this);
    this.NSUpload = this.NSUpload.bind(this);
    this.NSDownload = this.NSDownload.bind(this);
    this.NSMkdir = this.NSMkdir.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.state = {
     data: [],
     folderPath:"",
     logs: "",
     NSUploading: false,
     settings: {},
     NSConfigured: false,
     NSDownloading: false
    }
  }

  componentWillMount(){
    this.fetchSettings();
  }
  componentDidMount(){
    // Load data
    if(isNSConnected()){
      this.fetchData('dir', this.state.folderPath);
    }

    //implement a timer to periodically recheck the current folder. Maybe every 30s or minute.
    // need to see impact on UX before rolling this out to prod.
  }

  fetchSettings(){
    let settings = getSettings();
    //console.log(settings);
    this.setState({settings: settings});
    this.setState({folderPath: "/"+settings.cpcode});
    if(settings && settings.hostname && settings.key && settings.keyName ){
      this.setState({NSConfigured: true});
    }
  }

  updateSettings(newSettings){
    setSettings(newSettings);
    this.setState({settings: getSettings()});
    connectNS();
    if(this.state.folderPath){
      this.setState({folderPath: "/"+newSettings.cpcode});
      this.fetchData('dir', "/"+newSettings.cpcode);
    } else {
      this.fetchData('dir', this.state.folderPath);
    }

  }

  fetchData(type, path){
    if(type === 'dir'){
      listDir(path)
      .then((results) => {
        this.setState({folderPath:path});
        if(results){
          if(results == 'unconfigured') return 'unconfigured';
          //this.setState({folderPath:path});
          return results.map((result) => {
            return {name:result.name,type:result.type, files: result.files}
          })
        }
        else {
          return [{name: "", type:"empty"}]
        }
      })
      .catch((error) => {
        let errorExplained = {};
        if(error.statusCode == '404'){
            errorExplained.message = error.message;
            this.setState({folderPath: "/"+this.state.settings.cpcode});
            this.setState({logs: errorExplained});
            return this.fetchData('dir', "/"+this.state.settings.cpcode);
        }
        //console.log(error);
        this.setState({NSConfigured: false});
        // try to do a bit better messaging of error message as they tend to be a bit cryptic. Return error.message as message gets displayed to user

        if(error.code == 'ENOTFOUND'){
          errorExplained.message = "This url is invalid or cannot be found";
        } else {
          errorExplained = error;
        };

        this.setState({logs: errorExplained});
        return 'unconfigured';
      })
      .then((data) => {
        if(data == 'unconfigured'){
            this.setState({NSConfigured: false});
        } else {
          this.setState({NSConfigured: true});
          this.setState({logs: ''});
        }
        this.setState({ data: data });

      });
      // get netstorage list
    }
  }

  NSDelete(itemPath, type){
    // console.log(itemPath);
    // console.log(type);
    // console.log("Delete "+itemPath);
    if(type =="file"){
      deleteFile(itemPath).then((results) => {
        //console.log(results);
        this.fetchData('dir', this.state.folderPath);
      });
    } else if(type == "dir"){
      deleteDir(itemPath).then((results) => {
        this.fetchData('dir', this.state.folderPath);
      })
    }
  }

  NSUpload(localSourcePath,destinationPath, fileName){
    //console.log("Uploading "+ localSourcePath + " to "+ destinationPath);
    if(!this.state.NSUploading){
        this.setState({NSUploading: true});
        uploadFile(localSourcePath,destinationPath + '/'+fileName).then((results) => {
          //console.log(results);
          this.setState({NSUploading: false});
          this.fetchData('dir', this.state.folderPath);
        });
      }
  }

  NSDownload(itemPath){
    // console.log(itemPath);
    // console.log("Downloading "+itemPath);
    this.setState({NSDownloading: true});
    downloadFile(itemPath, this.state.settings.downloadFolder).then((results) => {
      let logs = {message: 'Downloaded '+itemPath+ ' at '+this.state.settings.downloadFolder};
      this.setState({logs: logs});
      this.setState({NSDownloading: false});
    }).catch((error) => {
      this.setState({NSDownloading: false});
      console.error(error)
    });
  }

  NSMkdir(folderPath){
    mkDir(this.state.folderPath+'/'+folderPath).then((results) => {
      this.fetchData('dir', this.state.folderPath);
    });
  }


  render(){

    return <App dirList={this.state.data}
                parentFolderName={this.state.folderPath}
                fetchList={this.fetchData}
                NSDelete={this.NSDelete}
                NSUpload={this.NSUpload}
                NSUploading={this.state.NSUploading}
                NSDownload={this.NSDownload}
                NSMkdir={this.NSMkdir}
                logs={this.state.logs}
                settings={this.state.settings}
                setSettings={this.updateSettings}
                NSConfigured={this.state.NSConfigured}
                NSDownloading={this.state.NSDownloading}
                />
  }
}


export default Root;
