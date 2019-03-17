import React, { Component } from 'react';
import api from '../../api';

class FileUpload extends Component {
  constructor () {
    super();
    this.state = {
      file: null
    };
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    const stateFile = this.state.file[0];
    api.uploadToS3(stateFile);
  }

  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }

  render () {
    return (
      <form onSubmit={(e)=>{this.handleSubmit(e)}}>
        <input label='upload file' type='file' onChange={this.handleFileUpload} />
        <button type='submit'>Send</button>
      </form>
    );
  }
}

export default FileUpload;