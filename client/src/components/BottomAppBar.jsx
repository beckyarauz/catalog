import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
// import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';

import { Link } from 'react-router-dom';

const styles = theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  link:{
    'text-decoration':'none',
    color:'white'
  }
});

function BottomAppBar(props) {
  const { classes } = props;
  return (
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={props.toggle('right', true)} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Link to="/browse" className={classes.link}>
            <Fab color="secondary" aria-label="Add" className={classes.fabButton}>
                <SearchIcon />
            </Fab>
          </Link>
          <div>
            {props.isLogged && 
            <Link to="/manage-account" className={classes.link}>
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Link>
            }
            {/* <IconButton color="inherit">
              <MoreIcon />
            </IconButton> */}
          </div>
        </Toolbar>
      </AppBar>
  );
}

BottomAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomAppBar);