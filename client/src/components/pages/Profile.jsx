import React,{Component} from 'react';
// import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import PersonPinIcon from '@material-ui/icons/PersonPin';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Products from './Products';
import Contact from './Contact';

import api from '../../api';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button'

// import api from '../../api';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:'column',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  content:{
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center',
    width:'100%'
  },
  header:{
    display: 'flex',
    alignItems: 'center',
    width:'100%',
    height: '200px',
    // backgroundColor: 'blue'
  },
  bigAvatar: {
    margin: 10,
    width: 100,
    height: 100,
  },
  avatarContainer:{
    // backgroundColor:'green'
  },
  infoContainer:{
    // backgroundColor:'pink',
    textAlign: 'left',
    paddingLeft: 15,
  }, 
  text:{
    fontSize: 14,
  },
  tabs: {
    // textAlign:'center',
    flexGrow: 1,
    maxWidth: 500,
    // borderRadius: '25px'
  }
});

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        username:null,
        company:'The Company',
        category:'Food',
        about: 'my description',
        phone:'my phone',
        email: 'my email',
        address: 'my address',
        logoUrl: 'https://www.freepngimg.com/thumb/kiss_smiley/30518-9-kiss-smiley-transparent-image-thumb.png',
        firstName:'First Name',
        lastName:'Last Name',
        products:null,
      },
      message: null,
      error: null,
      value:0 //value of the Tabs
    }
  }

  getUser = async () => {
    let info = await api.getUserInfo();
    let user = info.data.user;
    this.setState({user});
  }

  componentWillMount(){
    
    (async ()=>{
      await this.getUser();

      let data = await api.getProducts(this.state.user.username);
      let products = data.data.products
      
      let user = this.state.user;

      user.products = products;
      console.log(products);
      this.setState(currentState => ({user}))
    })()
  }
  componentDidMount(){
    //setting the default Tab render
    this.props.history.push('/profile/products')
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    return (
      this.state.user.username && (
      <div className={classNames(classes.root ,classes.margin)}>
      
            <div className={classNames(classes.header)}>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={4} className={classNames(classes.avatarContainer,classes.text)}>
                <Avatar alt="Cat" src={this.state.user.logoUrl} className={classes.bigAvatar} />
                <p>@{this.state.user.username}</p>
              </Grid>
              <Grid item xs={8} className={classNames(classes.infoContainer,classes.text)}>
                <h2>{this.state.user.company}</h2>
                <p><b>Description:</b></p>
                <p>{this.state.user.about}</p>
  
                <p><b>Category:</b></p>
                <p>{this.state.user.category}</p>
              </Grid>
            </Grid>
            
            </div>
            <Paper className={classes.tabs}>
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              centered={true}
            >
              <Tab icon={<Link to="/profile/products"><Icon>shopping_cart</Icon></Link>} />
              <Tab icon={<Link to="/profile/contact"><PhoneIcon/></Link>} />
              {/* <Tab icon={<FavoriteIcon />} />
              <Tab icon={<PersonPinIcon />} /> */}
            </Tabs>
          </Paper>
          <div className={classNames(classes.container)}>
            <Switch>
              <Route path="/profile/contact" exact render={(props) => <Contact {...props} phone={this.state.user.phone} email={this.state.user.email} address={this.state.user.address} name={`${this.state.user.firstName} ${this.state.user.lastName}`}/>} />
              <Route path="/profile/products" exact render={(props)=> <Products {...props} products={this.state.user.products}  user={this.state.user.username}/>} />
              {/* <Route render={() => <h2>404</h2>} /> */}
            </Switch>
          </div>
            
        
      </div>
      ) 
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
