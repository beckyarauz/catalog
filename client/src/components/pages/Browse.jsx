import React,{Component} from 'react';
// import { Link } from 'react-router-dom';
// import { Route, Switch } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Companies from './Companies';
// import Products from './Products';
// import Contact from './Contact';

// import api from '../../api';

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
  },
  gridClass: {
    flexGrow: 1,
  },
  paper: {
    borderRadius: 25,
    height: 140,
    width: 100,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:14
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  paperText:{
    color:'white',
    position: 'relative',
  },
  demo:{
    overflow: 'scroll',
    minWidth: 375,
    maxWidth: 375,
  },
  image: {
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageSrc: {
    borderRadius: 25,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    borderRadius: 25,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  }
});

class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      companies:null,
      categories:[
        {
          name: 'Beauty',
          image:'https://img3.stockfresh.com/files/b/balabolka/m/95/5959516_stock-vector-seamless-pattern-with-beauty-and-cosmetics-background.jpg',
          icon:'spa'
        },
        {
          name: 'Food',
          image:'https://i.pinimg.com/564x/f7/23/7c/f7237c933b705e9b4383b1d31e200d3c.jpg?b=t',
          icon:'restaurant'
        },
        {
          name: 'Clothing',
          image:'https://i.pinimg.com/564x/67/fe/fa/67fefaac7dcd41f55630ce24204be412.jpg',
          icon:'wc'
        },
        {
          name: 'Gifts',
          image:'https://cdn.shopify.com/s/files/1/2156/7309/files/Bespoke_Parcel_London.com_Valentines_gifts_._Bespoke_boxes_from_50.._600x600@2x.jpg?v=1548165658',
          icon:'redeem'
        },
        {
          name: 'Furniture',
          image:'https://i.pinimg.com/originals/ee/7c/a5/ee7ca5eaed4b078f159caa332305ed9d.jpg',
          icon:'weekend'
        },
        {
          name: 'Tattoo',
          image:'https://i.pinimg.com/originals/03/5d/9e/035d9ee5c531a63269a106d6daa87af0.jpg',
          icon:'brush'
        },
        {
          name: 'Art',
          image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf5Fl3X6g94efmszJFpV3OxNchZXM9xLvfsetuOgKw_LYzYycCQQ',
          icon:'color_lens'
        },
      ],
      message: null,
      error: null,
      spacing: '16',
      selectedCategory:null
    }
  }

  handleChange = (event, value) => {
    this.setState({ selectedCategory: value });
  };

  render() {
    const { spacing } = this.state;
    const { classes } = this.props;
    return (
      // this.state.loaded && (
      <div className={classNames(classes.root ,classes.margin)}>
      
        <Grid container className={classes.gridClass} spacing={16} >
          <Grid item xs={12}>
            <Grid container className={classes.demo}  wrap="nowrap" spacing={Number(spacing)}>
              {this.state.categories.map((value,idx) => (
                
                <Grid key={idx} item>
                  <ButtonBase
                    focusRipple
                    key={idx}
                    className={classes.image}
                    focusVisibleClassName={classes.focusVisible}
                    onClick={e=>this.handleChange(e,value.name)}
                  >
                    <Paper className={classNames(classes.paper)}> 

                      <span
                        className={classes.imageSrc}
                        style={{
                          backgroundImage: `url(${value.image})`,
                        }}
                      />
                      <span className={classes.imageBackdrop} />
                      <span className={classes.imageButton}>
                        <Grid container wrap="nowrap" direction='column' alignItems='center' spacing={16}>
                          <Grid item xs zeroMinWidth>
                              <Typography noWrap variant="h6" className={classNames(classes.paperText)}>{value.name}</Typography>
                          </Grid>
                          <Grid item>
                            <Avatar style={{backgroundColor:'rgba(0,0,0,0.5)'}}><Icon>{value.icon}</Icon></Avatar>
                          </Grid>
                        </Grid>
                      </span>
                    </Paper>
                  </ButtonBase>
                </Grid>
                
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Companies category={this.state.selectedCategory}/>
      </div>
      // ) 
    );
  }
}

Browse.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Browse);
