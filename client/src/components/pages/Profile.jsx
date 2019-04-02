import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
// import PersonPinIcon from '@material-ui/icons/PersonPin';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
// import Button from '@material-ui/core/Button';
import ContactForm from './ContactForm';

import Products from './Products';
import Bookmarks from './Bookmarks';
import Contact from './Contact';

import api from '../../api';

import { withStyles } from '@material-ui/core/styles';

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
    width: 100,
    height: 100,
  },
  avatarContainer:{
    // backgroundColor:'green'
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column'
    // textAlign:'center'
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
  },
  messages:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
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
        bookmarks: [],
        address: 'my address',
        logoUrl: 'https://www.freepngimg.com/thumb/kiss_smiley/30518-9-kiss-smiley-transparent-image-thumb.png',
        firstName:'First Name',
        lastName:'Last Name',
        products:null,
      },
      open:false,
      selectedProduct:{},
      message: null,
      error: null,
      isOwner:false,
      prevPath:'',
      showBackButton:false,
      value:0, //value of the Tabs
    }
  }
  mounted = false;

  getUser = async (username) => {
    let info = await api.getCompanyInfo(username);
    let user = info.data.user;
    let isOwner = info.data.isOwner;
    this.setState(currentState => ({user,isOwner}))
  }

  componentWillMount(){
    let path, link, user;
    path = this.props.location.pathname;

    if (path.includes('company')) {
      user = this.props.match.params.user;
    } else {
      link = path.substring(path.search('profile'));
      user = link.substring(link.search('/') + 1);
    }
    (async ()=>{
      await this.getUser(user);
    })()
    
  }

  componentDidMount(){
    this.mounted = true;
  }

  componentDidUpdate(prevProps,prevState){
    if(this.mounted){
      let path = this.props.location.pathname;
      let link = path.substring(path.search('profile'));
      let user = link.substring(link.search('/')+1);
      if(prevProps.location.pathname !== this.props.location.pathname){
        if(this.mounted){
          (async ()=>{
            await this.getUser(user);
            })()
        }
      }
      if(prevState.message !== this.state.message){
        setTimeout(() =>{
          this.setState(currentState => ({message: null}))
        }, 3000)
      }
      if(prevState.error !== this.state.error){
        setTimeout(() =>{
          this.setState(currentState => ({error: null}))
        }, 3000)
      }
    }
  }

  handleChange = (event, value) => {
    if(this.mounted){
      this.setState({ value });
    }
  };
  handleDeleteProduct = async (image,id) => {
    if(image && image.length > 0){
      await api.deleteFromS3(image,'product');
    }
    let response = await api.deleteProduct(id);
    let user = {...this.state.user};
    let products = [...user.products];
    let found = products.filter(product => product._id === id).map(product => products.indexOf(product));
   
    products.splice(found[0],1);

    user.products = products;

    if(response.data.message){
      if(this.mounted){
        this.setState(state => ({user,message:response.data.message}))
      }
    }
  }
  handleRemoveBookmark = async (id) => {
    let response = await  api.removeBookmark(id);
    let user = {...this.state.user};
    let bookmarks = [...user.bookmarks];
    let found = bookmarks.filter(product => product._id === id).map(product => bookmarks.indexOf(product));
   
    bookmarks.splice(found[0],1);

    user.bookmarks = bookmarks;

    if(response.data.message){
      if(this.mounted){
        this.setState(state => ({user,message:response.data.message}))
      }
    }
  }
  handleAddBookmark = async (id) => {
    (async ()=>{
      
      let data = await api.addBookmark(id);
      let message = data.data.message;
      if(message){
        if(this.mounted){
          this.setState({message})
        }
      }
    })()
  }

  updateProducts = async () => {
    if(this.mounted){
    let user = {...this.state.user};
    
    let data = await api.getProducts(user.username);
    if(data.data.error){
      this.setState(state=> ({error:data.data.error}))
    }
    let products = data.data.products;
    user.products = products;

    this.setState(currentState => ({user}))
    }
  }
  updateBookmarks = async () => {
    if(this.mounted){
      let info = await api.getCompanyInfo(this.state.user.username);
      let user = info.data.user;

      let bookmarks = [...user.bookmarks];

      user.bookmarks = bookmarks;

      this.setState(currentState => ({user}))
    }
  }

  handleClickOpenContact = (value) => {
    this.setState(currentState => ({
      open: true,
      selectedProduct:value
    }));
  };

  handleCloseContact = (value) => {
    this.setState({ open: false});
  };
  handleSend = (mail) => {
    api.sendMessage(mail);
  }

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    return (this.state.user.username && (
      <div className={classNames(classes.root ,classes.margin)}>
      <ContactForm
          product={this.state.selectedProduct}
          sender={this.props.loggedUser}
          sellerMail={this.state.user.email}
          open={this.state.open}
          onClose={this.handleCloseContact}
          onSend={this.handleSend}
        />

            <div className={classNames(classes.header)}>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={4} className={classNames(classes.avatarContainer,classes.text)}>
                <Avatar alt="Cat" src={this.state.user.logoUrl} className={classes.bigAvatar} />
                <p>@{this.state.user.username}</p>
              </Grid>
              <Grid item xs={8} className={classNames(classes.infoContainer,classes.text)}>
                <h2>{this.state.user.company}</h2>
                <p><b>Bio:</b></p>
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
              <Tab icon={<Icon>shopping_cart</Icon>} />
              <Tab icon={<PhoneIcon/>} />
              {this.state.isOwner && <Tab icon={<FavoriteIcon />} />}
              {/* <Tab icon={<PersonPinIcon />} /> */}
            </Tabs>
          </Paper>
          <div className={classNames(classes.container)}>
          <div className={classNames(classes.messages)}>
            {this.state.message && <div className="info">
            {this.state.message}
          </div>}
            {this.state.error && <div className="info info-danger">
            {this.state.error}
          </div>}
          </div>
          {this.state.value === 2 && 
          <Bookmarks 
            products={this.state.user.bookmarks}  
            user={this.state.user._id} 
            isOwner={this.state.isOwner} 
            handleRemove={this.handleRemoveBookmark} 
            handleClickOpenContact={this.handleClickOpenContact} 
            handleUpdate={this.updateBookmarks}/>}
          {this.state.value === 1 && 
          <Contact 
            phone={this.state.user.phone} 
            email={this.state.user.email} 
            address={this.state.user.address} 
            name={`${this.state.user.firstName} ${this.state.user.lastName}`}/>}
          {this.state.value === 0 && 
          <Products 
            handleClickOpenContact={this.handleClickOpenContact} 
            products={this.state.user.products} 
            history={this.props.history} 
            user={this.state.user.username} 
            isOwner={this.state.isOwner} 
            handleDelete={this.handleDeleteProduct} 
            handleAdd={this.handleAddBookmark} 
            handleUpdate={this.updateProducts}/>}
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