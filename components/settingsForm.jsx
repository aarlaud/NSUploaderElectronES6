import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class SettingsForm extends Component {
  constructor(props){
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleDownloadFolderChange = this.handleDownloadFolderChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      settings: {}
    }
  }


  handleSave(){
    this.props.save(this.state.settings);
  }

  componentDidMount() {
    var input = ReactDOM.findDOMNode(this.refs.customAttributes)
     input.setAttribute('webkitdirectory', '')
     input.setAttribute('directory', '')
     input.setAttribute('moz-directory', '');
     this.setState({
       settings: this.props.settings
     });
  }

  handleDownloadFolderChange(){
    var settings = this.state.settings;
    settings.downloadFolder = ReactDOM.findDOMNode(this.refs.customAttributes).files[0].path
    this.setState({
      settings: settings
    });

  }
  handleInputChange(event){
    let value = event.target.value;
    let name = event.target.name;
    var settings = this.state.settings;
    settings[name] = value;
    this.setState({
      settings: settings
    });
  }

  // "hostname": "aarlaud-im-nsu.akamaihd.net",
  // "keyName": "antoinearlaud",
  // "key": "xnZAuYyc4nW4eeR66mYgaNuC1DG9yj77aK69AO06sSyFZ2CncH",
  // "cpCode": "574572",

  render(){
    var settings = this.state.settings;
    let downloadFolder = 'undefined';
    if(settings.downloadFolder) downloadFolder = settings.downloadFolder;
    return (
      <div>
        <h4>Download folder</h4> {downloadFolder}
        <br />
        <div className="inputFolderLabel"><input className="inputFolder" type="file" id="file" ref="customAttributes" onChange={this.handleDownloadFolderChange} />
        <label htmlFor="file">Choose a folder</label></div>
        <br />
        <h4>Netstorage settings</h4>
        <form className="netstorageSettings">
          <input type="text" name="hostname" placeholder="Netstorage hostname (nsu one)" onChange={this.handleInputChange} value={this.state.settings.hostname}></input>
          <input type="text" name="keyName" placeholder="keyName (username)" onChange={this.handleInputChange} value={this.state.settings.keyName}></input>
          <input type="text" name="key" placeholder="key" onChange={this.handleInputChange} value={this.state.settings.key}></input>
          <input type="number" name="cpcode" placeholder="CPCode" onChange={this.handleInputChange} value={this.state.settings.cpcode}></input>
          <div className="saveBtn" onClick={this.handleSave}>Save</div>

        </form>
      </div>

    )

  }
}
