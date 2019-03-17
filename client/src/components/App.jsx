import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Countries from './pages/Countries';
import FileUpload from './pages/FileUpload';
import AddProduct from './pages/AddProduct';
import Secret from './pages/Secret';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManageAccount from './pages/ManageAccount';
import api from '../api';
import logo from '../logo.svg';

// import Button from '@material-ui/core/Button';
import NavBar from './NavBar';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogged: false
    }
  }

  componentWillMount(){

    (async (e) => {
      console.log('file:app.jsx variable: this.state.isLogged', this.state.isLogged)
      let isLogged = await api.isLoggedIn();
      // console.log('isLogged:',isLogged)
      this.setState({
            isLogged: isLogged
      })
    })()
    
  }

  handleLogin = () =>{
    console.log('handle Login called');
    (async (e) => {
      console.log('file:app.jsx variable: this.state.isLogged function: handleLogin', this.state.isLogged)
      let isLogged = await api.isLoggedIn();
      console.log('isLogged:',isLogged)
      this.setState({
            isLogged: isLogged
      })
    })()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <Button variant="contained" color="primary">Button</Button> */}
          <h1 className="App-title">Local Market</h1>
          <NavBar isLogged={this.state.isLogged} inLogout={this.handleLogin} />
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/countries" component={Countries} />
          <Route path="/add-product" component={AddProduct} />
          <Route path="/signup" render={(props) => <Signup {...props} inLogin={this.handleLogin}/>} />
          <Route path="/login" render={(props) => <Login {...props} inLogin={this.handleLogin}/>} />
          <Route path="/secret" component={Secret} />
          <Route path="/upload" component={FileUpload} />
          <Route path="/manage-account" component={ManageAccount} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}