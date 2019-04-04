import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {
    flexGrow: 1,

  },
  toolbar :{
    'justify-content': 'center',
    'flex-direction': 'column',
    padding: '20px 0px',
  },
  link:{
    'text-decoration':'none',
  }
};

function Header(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar className={classes.toolbar}>
          <Typography className="App-title" variant="h1" color="inherit">
            Local Market
          </Typography>
          {props.user && (
          <Link 
          className={classes.link} 
          to={`/profile/${props.user}`} >
                    <Chip
                      avatar={
                        <Avatar>
                          <FaceIcon />
                        </Avatar>
                      }
                      label={props.user}
                      style={{ marginTop: '10px' }}
                    />
                  </Link>
                  )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);