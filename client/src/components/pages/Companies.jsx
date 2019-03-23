import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

import api from '../../api';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:'column',
  },
  margin: {
    margin: theme.spacing.unit,
    marginTop: 20,
  },
  paper: {
    height: 200,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:14,
    padding:15,
    borderRadius: '15px 50px 30px',
    marginTop:20
  },
  gridContainer:{
    width:'100%',
    height:'100%',
    borderRadius:4,
  },
  gridImage:{
    borderRadius: '15px 50px 0px 0px'
  },
  gridContent:{
    borderRadius: '0px 0px 30px 50px'
  },
  gridItem:{
    flex:1,
    display:'flex',
    flexDirection: 'column',
    alignItems:'center',
    justifyContent:'center'
  },
  tagsContainer:{
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '10px 0 10px 0'
    // margin: '10px 0 10px 0'
  },
  tags: {
    padding:'5px',
    backgroundColor: '#eee',
  }
});

class Companies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category:'all',
      companies:null,
      message: null,
      error: null,
      spacing: '16',
      location:null,
      filteredCompanies:[]
    }
  }

  backImage = (category) =>{
    // console.log('backimage',category)
    let myCat;
    let image;
    let icon;
    switch(category){
      case 'beauty':
        image = 'https://img3.stockfresh.com/files/b/balabolka/m/95/5959516_stock-vector-seamless-pattern-with-beauty-and-cosmetics-background.jpg';
        icon = 'spa';
        break;
      case 'food':
        image = 'https://i.pinimg.com/originals/f0/c3/32/f0c332d32df07415ecb1f07dc500fa74.jpg';
        icon = 'restaurant'
        break;
      case 'gifts':
        image = 'https://st2.depositphotos.com/4948655/8247/v/950/depositphotos_82474894-stock-illustration-seamless-birthday-pattern.jpg';
        icon = 'redeem'
        break;
      case 'furniture':
        image = 'https://previews.123rf.com/images/seamartini/seamartini1608/seamartini160800101/61439594-furniture-seamless-background-wallpaper-with-vector-pattern-icons-of-vintage-and-classic-home-access.jpg';
        icon = 'weekend'
        break;
      case 'tattoo':
        image = 'https://i.pinimg.com/originals/71/1f/2b/711f2b5491cb72d99073318d981d4cff.jpg';
        icon = 'brush'
        break;
      case 'art':
        image = 'https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?cs=srgb&dl=abstract-abstract-expressionism-abstract-painting-1070527.jpg&fm=jpg';
        icon = 'color_lens'
        break;
      case 'clothing':
        image = 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/276000/580/386/m1/fpnw/wm1/vector-pattern-with-hand-drawn-womens-clothes-.jpg?1418840753&s=223af5d1d7daf263f2b17d09b4e89a5e';
        icon = 'wc'
        break;
      default:
      image = 'http://www.freechristmaswallpapers.net/web/wallpapers/thumbnail/Christmas-Tree-Nature_lg.jpeg';
      icon = 'redeem'
    }

    myCat = {
      image,
      icon
    }
    return myCat;
  }
  componentDidMount(){
    // console.log('mounted Companies')
    if(this.props.category && this.props.category !== null){
      this.setState({category:this.props.category})
    } 
    if ("geolocation" in navigator) {
      let self = this;
      navigator.geolocation.getCurrentPosition(async function (position) {
        
        let currentLocation = {
          latitude: position.coords.latitude,
          longitude:position.coords.longitude
        }
        let data = await api.getCompanies(self.state.category,currentLocation);
        self.setState(prevState =>( { currentLocation, companies:data.data.companies,message:'Companies near you' }));
        setTimeout(() =>{
          self.setState({message:null})
        }, 2000)
      })
    } else {
      console.log('geolocation not available');
      //ADD A MESSAGE FOR THE USER: IS IMPORTANT TO ACTIVATE GEOLOCATION
    }
    
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.category !== this.props.category ){
      this.setState(currentState => ({category:this.props.category}), ()=>{
        if(this.state.filteredCompanies.length > 0){
          this.setState(state => ({filteredCompanies:[]}))
        }
        let category = this.state.category;
        let location = this.state.currentLocation;
        if(category && category !== 'all' && category !== null){
          category = category.toLowerCase();
          (async ()=>{
            // console.log('async',category);
            let data = await api.getCompanies(category,location);

            if(data.data.companies && data.data.companies !== undefined && data.data.companies !== null && data.data.companies.length > 0){
              let companies = data.data.companies;
              this.setState(currentState => ({companies}))
            } else if(data.statusText){
              if(this.state.companies !== null){
                this.setState(currentState => ({companies:null}))
              }
              let error = data.statusText;
              this.setState(currentState => ({error}))
              setTimeout(() =>{
                this.setState(currentState => ({error: null}))
              }, 2000)
            } else if(data.data.message){
              if(this.state.companies !== null){
                this.setState(currentState => ({companies:null}))
              }
              let message = data.data.message;
              this.setState(currentState => ({message}))
              setTimeout(() =>{
                this.setState(currentState => ({message: null}))
              }, 3000)
            }
            
          })()
        }
      });
    }
    if(this.props.search !== prevProps.search){
      if(this.state.filteredCompanies.length > 0 && this.props.search.length <= 0){
        this.setState(state =>({ filteredCompanies:[] }));
        return;
      }
      let str = this.props.search;
      let reg = new RegExp('^'+str, 'i');

      let filteredCompanies = this.state.companies.filter(company => (
        company.tags.length > 0
        ));
      
        filteredCompanies = filteredCompanies.filter( company => (() => {
          return company.tags.filter(tag => reg.test(tag)).length > 0
        })())

      if(filteredCompanies.length > 0){
        this.setState(state =>({ filteredCompanies }));
      } 
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classNames(classes.root ,classes.margin)}>
        {this.state.error && <div className="info info-danger">{this.state.error}</div>}
        {this.state.message && <div className="info alert-info">{this.state.message}</div>}
        {(this.props.search.length <= 0) && this.state.companies && (this.state.companies.length > 0) && (this.state.companies.map((company,idx) => {
          let image, icon;
          ({image, icon } = this.backImage(company.category));
            return (
              <Paper className={classNames(classes.paper)} key={company._id}>
                <Grid className={classNames(classes.gridContainer)} container spacing={16} direction='column'>
                      <Paper className={classNames(classes.gridImage,classes.gridItem)} elevation={18} style={{ backgroundImage: `url(${image})`}}>
                        <Grid container style={{height:'100%', width:'100%',position:'relative'}}>
                          <Avatar style={{backgroundColor:'rgba(0,0,0,0.5)', position:'absolute',bottom:5,right:5}}><Icon>{icon}</Icon></Avatar>
                        </Grid>
                      </Paper>
                      <Paper className={classNames(classes.gridContent,classes.gridItem)} elevation={4}>
                            <Typography variant="h5" component="h3">
                              {company.company}
                            </Typography>
                            <Typography component="p">
                              {company.about}
                            </Typography>
                            <div className={classes.tagsContainer}>
                            {company.tags && company.tags !== undefined && company.tags.length > 0 && (
                              company.tags.map((tag,idx) => (
                              <Paper key={idx} className={classes.tags}>{tag}</Paper>
                              ))
                            )}
                            </div>
                            
                      </Paper>
                </Grid>
            </Paper>
            )
        }))}
        {(this.props.search.length > 0) && (this.state.filteredCompanies.length > 0) && (this.state.filteredCompanies.map((company,idx) => {
          let image, icon;
          ({image, icon } = this.backImage(company.category));
            return (
              <Paper className={classNames(classes.paper)} key={company._id}>
                <Grid className={classNames(classes.gridContainer)} container spacing={16} direction='column'>
                      <Paper className={classNames(classes.gridImage,classes.gridItem)} elevation={18} style={{ backgroundImage: `url(${image})`}}>
                        <Grid container style={{height:'100%', width:'100%',position:'relative'}}>
                          <Avatar style={{backgroundColor:'rgba(0,0,0,0.5)', position:'absolute',bottom:5,right:5}}><Icon>{icon}</Icon></Avatar>
                        </Grid>
                      </Paper>
                      <Paper className={classNames(classes.gridContent,classes.gridItem)} elevation={4}>
                            <Typography variant="h5" component="h3">
                              {company.company}
                            </Typography>
                            <Typography component="p">
                              {company.about}
                            </Typography>
                            <div className={classes.tagsContainer}>
                            {company.tags && company.tags !== undefined && company.tags.length > 0 && (
                              company.tags.map((tag,idx) => (
                              <Paper key={idx} className={classes.tags}>{tag}</Paper>
                              ))
                            )}
                            </div>
                            
                      </Paper>
                </Grid>
            </Paper>
            )
        }))}
      </div>
    );
  }
}

Companies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Companies);
