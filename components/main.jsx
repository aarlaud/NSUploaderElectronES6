'use babel';

import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {SkyLightStateless} from 'react-skylight';
import FolderForm from './createFolderForm';
import SettingsForm from './settingsForm';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleParentItemClick = this.handleParentItemClick.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.handleNewFolderClick = this.handleNewFolderClick.bind(this);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
    this.isDownloading = this.isDownloading.bind(this);
    this.isNotDownloading = this.isNotDownloading.bind(this);
    this.state = {
     logs: [],
     dropzoneActive: false,
     modal: false,
     modalSettings: false
    }
    this.setState({logs: this.props.logs});
  }

  componentDidMount(){
    if(!this.props.NSConfigured) this.setState({modalSettings: true});
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.logs != ''){
      let logs = this.state.logs;
      if(logs.slice(0,2).indexOf(nextProps.logs.message) < 0 ){
        logs.unshift(nextProps.logs.message);
        this.setState({logs: logs});
      }

    }
    return true;
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.logs != '' && this.props.logs == ''){
      this.setState({logs: []});
    }
  }
  handleItemClick(item){
    this.props.fetchList(item.type, this.props.parentFolderName+"/"+item.name);
  }
  handleParentItemClick(item){
    //console.log(item.replace(/\/[a-zA-Z0-9\-\_]+$/, ''));
    this.props.fetchList('dir', item.replace(/\/[a-zA-Z0-9 \-\_]+$/, ''));
  }
  handleItemDownloadClick(item){
    if(this.props.settings.downloadFolder == ""){
      alert('Please set up a download folder first in the settings (gear icon)');
    } else {
      this.props.NSDownload(this.props.parentFolderName+"/"+item.name);
      //console.log(item);
      let logs = this.state.logs;
      logs.unshift('Downloading '+item.name);
      this.setState(logs:logs);
    }
  }
  handleItemTrashClick(item){
    this.props.NSDelete(this.props.parentFolderName+"/"+item.name, item.type);
    let logs = this.state.logs;
    logs.unshift('Trashing '+item.name);
    this.setState(logs:logs);
  }

  doesFolderAlreadyExist(folderName){
    return this.props.dirList.filter(function (folder) { return folder.name == folderName }).length > 0;
    //if(this.props.dirList)
    //console.log(this.props.dirList);
  }

  handleNewFolderClick(value=""){
    //this.refs.newfolder.show();
    if(!this.state.modal){
      this.setState({modal: true});
    } else if(this.state.modal && this.doesFolderAlreadyExist(value)){
      //this.setState({modal: false});
      alert('A folder with that name already exists !');
    } else {

      this.props.NSMkdir(value);
      this.setState({modal: false});

    }

  }

  handleSettingsClick(value=""){
    if(!this.state.modalSettings){
      this.setState({modalSettings: true});
    } else if(this.state.modalSettings){
      if(value != ""){
        this.props.setSettings(value);
      }
      this.setState({modalSettings: false});
    } else {
      this.setState({modalSettings: false});

    }
  }




  onDrop(files) {
    //console.log(files);
    if(this.props.NSUploading){
      let logs = this.state.logs;
      logs.unshift('Uploading in progress, please wait.');
      this.setState({
        dropzoneActive: false,
        logs:logs
      });
    } else {
      if(files[0].type == ""){
        alert("sorry, no folder upload support at the moment");
      } else {
        let logs = this.state.logs;
        logs.unshift('Uploading '+files[0].name + ' into '+this.props.parentFolderName);
        this.setState({
          dropzoneActive: false,
          uploadInProgress: true,
          logs:logs
        });
        // console.log("Uploading "+files[0].path);
        this.props.NSUpload(files[0].path, this.props.parentFolderName, files[0].name);
      }
    }


  }
  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  renderlist(list){
    if(list && list != 'unconfigured'){
      return list.map((item) => {
        let itemName = item.name;
          if(itemName.length > 45) {
              itemName = itemName.substring(0,45)+"...";
          }
          var itemStyled;
          if(item.type =='dir'){
            var trashIcon = '';
            if(item.files == 1){
              trashIcon = <img className="actionable" onClick={() => this.handleItemTrashClick(item)} src="./assets/images/trash-icon.png"/>;
            }
            itemStyled = <div key={item.name} className="listitem link directory"><div className="itemHandler" onClick={() => this.handleItemClick(item)}>{itemName}</div><img src="./assets/images/30x-Folder.png"/>{trashIcon}</div>
          } else if(item.type == 'empty'){
            itemStyled = <div key="empty">Empty !</div>
          } else {
            itemStyled = <div key={item.name} className="listitem file">{itemName}<img onClick={() => this.handleItemDownloadClick(item)} src="./assets/images/Download-Icon.png"/><img onClick={() => this.handleItemTrashClick(item)} src="./assets/images/trash-icon.png"/></div>
          }
          return itemStyled;
      });
    } else {
      return "";
    }
  }

  renderLogs(){
    if(this.state.logs){
      return this.state.logs.map((log, index) => {
        return <div key={index} >{log}</div>
      });
    }
  }

  manageDropZoneDisplay(){
    if(this.state.dropzoneActive && !this.props.NSUploading){
      return <div className="spinner spinner__2" ></div>
    } else if(!this.state.dropzoneActive && this.props.NSUploading){
      return <div>
                <div className="spinner spinner__3" ></div>
                <div style={{textAlign:"center",marginTop:"20px"}}>Uploading....</div>
              </div>

    } else {
      return <div className="spinner spinner__1" ></div>
    }
  }

  renderFolderCreationModal(){
    var folderCreationDialog = {
      backgroundColor: '#f28b20',
      color: '#ffffff',
      zIndex: 2000,
      width: '200px',
      height: '100px'
    };
    return <SkyLightStateless dialogStyles={folderCreationDialog} onCloseClicked={() => this.setState({modal: false})} onOverlayClicked={() => this.setState({modal: false})} isVisible={this.state.modal} ref="newfolder" >
              <FolderForm name="test" save={this.handleNewFolderClick}/>
            </SkyLightStateless>
  }


  renderSettingsModal(){
    var settingsDialog = {
      backgroundColor: '#f28b20',
      color: '#ffffff',
      zIndex: 2000,
      width: '400px',
      height: '300px'
    };
    return <SkyLightStateless dialogStyles={settingsDialog}  onCloseClicked={() => this.setState({modalSettings: false})} onOverlayClicked={() => this.setState({modalSettings: false})} isVisible={this.state.modalSettings} ref="settings" >
              <SettingsForm save={this.handleSettingsClick} settings={this.props.settings}/>
            </SkyLightStateless>
  }


  renderListPane(){
    if(this.props.NSConfigured){
      return (<div className="list">
                  {this.renderlist(this.props.dirList)}
                  <div className="createFolder"><span className="createFolderBtn" onClick={() => this.handleNewFolderClick()} ><img src="./assets/images/add_folder.png" /> Create folder</span></div>
                  {this.renderFolderCreationModal()}
              </div>);
    } else {
      return (<div className="list">
                  Please review Netstorage configuration in settings
              </div>);
    }

  }

  isDownloading(){
    if(this.props.NSDownloading) return "";
    return "hide";
  }
  isNotDownloading(){
    if(!this.props.NSDownloading) return " snackbar border-top";
    return "snackbar";
  }



  renderDownloadingIndicator(){
    var loadingbit = [];
    for(var i=0;i<250;i++){
      loadingbit.push(<span key={i} className="loading-bit"></span>);
    }
    return (
        <div className={this.isDownloading()}>
          <div className="loading-line">
            {loadingbit}
          </div>
        </div>
    );
  }

  render() {
    var parentPath = "";
    var folderName = "";


    if(this.props.parentFolderName){
      parentPath = this.props.parentFolderName.replace(/\/[a-zA-Z0-9 ]+$/, '');
      let fullPathTokenized = this.props.parentFolderName.match(/([0-9a-zA-Z \-\_]+$)/);
      folderName = fullPathTokenized[0];
      if(folderName.length > 25) {
          folderName = folderName.substring(0,24)+"...";
      }
      // console.log(folderName);
      // console.log(parentPath);
    }

    return <div className="container">
              <div className="fileManager">
                <div className="fileManagerContent"><h3>{folderName}</h3>
                  <h4 onClick={() => this.handleParentItemClick(this.props.parentFolderName)} className="link">{parentPath}</h4>
                  {this.renderListPane()}
                </div>
              </div>
              <div className="dropzoneContainer">
                <div className="settings"><img src="./assets/images/gear.png" onClick={this.handleSettingsClick}/></div>
                {this.renderSettingsModal()}
                <h3 style={{textAlign:"center"}}>dropzone</h3>
                  <Dropzone className="dropzone" onDrop={this.onDrop}
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    >
                    {this.manageDropZoneDisplay()}
                  </Dropzone>

              </div>
              <div className={this.isNotDownloading()}>
                {this.renderDownloadingIndicator()}
                Console
                <div className="snackbar_background"></div>
                <div className="snackbar_content">
                  {this.renderLogs()}
                </div>

              </div>
          </div>;
  }
}
