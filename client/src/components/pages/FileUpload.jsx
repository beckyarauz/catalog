import React, { Component } from 'react';
import api from '../../api';

class FileUpload extends Component {
  constructor () {
    super();
    this.state = {
      file: null
    };
  }

  // submitFile = (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append('file', this.state.file[0]);
  //   api.uploadToS3(formData);
  // }

  handleSubmit = (e) =>{
    e.preventDefault();
    const stateFile = this.state.file[0];
    // let file = api.submitFile(stateFile);
    // console.log(file);
    // api.uploadToS3(file);
    api.uploadToS3(stateFile);
  }

  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }

  render () {
    return (
      // <form onSubmit={this.submitFile}>
      <form onSubmit={(e)=>{this.handleSubmit(e)}}>
        <input label='upload file' type='file' onChange={this.handleFileUpload} />
        <button type='submit'>Send</button>
      </form>
    );
  }
}

export default FileUpload;