import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App.jsx';
import api from './api';
// import registerServiceWorker from './registerServiceWorker';
// let isLogged = false;
// let isSeller = false;
// let user = null;

ReactDOM.render(
  <App />
  , document.getElementById('root')
  );

  // (async (e) => {
  //     let response = await api.isLoggedIn();
  //     if(response !== undefined && response.isLogged){
  //       isLogged = response.isLogged;
  //       isSeller = response.isSeller;
  //       user = response.user;
  //     }
  //     ReactDOM.render(
  //       <App logged={isLogged} seller={isSeller} user={user}/>
  //       , document.getElementById('root')
  //       );
        
  //   })()
// registerServiceWorker();
