import React, {Component} from 'react';

export default class FolderForm extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      value: ""
    }
  }

  handleChange(event){
    this.setState({value: event.target.value});
  }

  handleSave(){
    this.props.save(this.state.value);
    this.setState({value: ""});

  }

  render(){
    return (
      <form className="folderForm">
        <input placeholder="folder name" onChange={this.handleChange} value={this.state.value} ></input>
        <div className="saveBtn" onClick={this.handleSave}>Save</div>
      </form>
    )

  }
}
