import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import purple from '@material-ui/core/colors/purple';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import lightGreen from '@material-ui/core/colors/lightGreen';
import cyan from '@material-ui/core/colors/cyan';
import lime from '@material-ui/core/colors/lime';

const styles = theme => ({
  home:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    padding: '20px 0',
    width:'100%',
  },
  root: {
    boxSizing:'border-box',
    ...theme.mixins.gutters(),
    paddingLeft:'0px',
    paddingRight:'0px',
    maxHeight:'300px',
    minHeight:'350px',
    minWidth:'275px',
    maxWidth:'275px',
    borderRadius: '50px 0px',
    marginBottom: theme.spacing.unit * 2,
  },
  upper :{
    // ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    borderRadius: '50px 0px',
    height:'100px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    
  },
  location:{
    fontSize:100,
    color:'white'
  },
  info :{
    paddingLeft:'16px',
    paddingRight:'16px',
    paddingTop: theme.spacing.unit * 2,
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.home}>
        {/* <Redirect to="/browse"/> */}
          <Paper className={classes.root} elevation={1}>
            <Paper className={classNames(classes.upper)} elevation={8} style={{backgroundColor:purple['500']}}> 
              <Icon className={classes.location}>location_on</Icon> 
            </Paper>
            <div className={classes.info}>
              <Typography gutterBottom variant="h5" component="h2">
                Allow Location
              </Typography>
              <Typography component="p">
                Allow the app to use your device's location so you can be 
                able to find small businesses close to you!
              </Typography>
            </div>
          </Paper>

          <Paper className={classes.root} elevation={1}>
            <Paper className={classNames(classes.upper)} elevation={8} style={{backgroundColor:pink['500']}} > 
              <Icon className={classes.location}>search</Icon> 
            </Paper>
            <div className={classes.info}>
              <Typography gutterBottom variant="h5" component="h2">
                Browse
              </Typography>
              <Typography component="p">
                Browse businesses by category or if you want to be more specific,
                use the search bar to find companies with certain "tags" for example: "vegan"
                if you are searching for vegan products.
              </Typography>
            </div>
          </Paper>

          <Paper className={classes.root} elevation={1}>
            <Paper className={classNames(classes.upper)} elevation={8} style={{backgroundColor:lightGreen['500']}} > 
              <Icon className={classes.location}>favorite</Icon> 
            </Paper>
            <div className={classes.info}>
              <Typography gutterBottom variant="h5" component="h2">
                Bookmark
              </Typography>
              <Typography component="p">
                Save your favorite products into your bookmarks to access them easily later.
              </Typography>
            </div>
          </Paper>

          <Paper className={classes.root} elevation={1}>
            <Paper className={classNames(classes.upper)} elevation={8} style={{backgroundColor:lime['500']}} > 
              <Icon className={classes.location}>email</Icon> 
            </Paper>
            <div className={classes.info}>
              <Typography gutterBottom variant="h5" component="h2">
                Contact Sellers
              </Typography>
              <Typography component="p">
                Interested in a product? Contact the seller directly from our app and make
                an inquiry on a specific product.
              </Typography>
            </div>
          </Paper>

          <Paper className={classes.root} elevation={1}>
            <Paper className={classNames(classes.upper)} elevation={8} style={{backgroundColor:indigo['500']}} > 
              <Icon className={classes.location}>how_to_reg</Icon> 
            </Paper>
            <div className={classes.info}>
              <Typography gutterBottom variant="h5" component="h2">
                Sign Up
              </Typography>
              <Typography component="p">
              Sign up now to enjoy these awesome features!
              </Typography>
            </div>
          </Paper>

          <Paper className={classes.root} elevation={1}>
            <Paper className={classNames(classes.upper)} elevation={8} style={{backgroundColor:cyan['500']}} > 
              <Icon className={classes.location}>shopping_cart</Icon> 
            </Paper>
            <div className={classes.info}>
              <Typography gutterBottom variant="h5" component="h2">
                Want to become a Seller?
              </Typography>
              <Typography component="p">
              Create an account and contact us at <address>local.market.catalog@gmail.com</address>
               for further information on how to become part of <b>Local Market</b>.
              </Typography>
            </div>
          </Paper>

      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
