import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import { Link } from 'react-router-dom';

import api from '../api';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  link:{
    textDecoration:'none'
  }
};

class NavDrawer extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };
  handleLogoutClick = async (e) => {
    this.props.inLogout();
    await api.logout();
  }

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
      <List>
        <Link to="/" className={classes.link} exact="true">
            <ListItem button>
              <ListItemIcon><Icon>home</Icon></ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
        </Link>
        {this.props.isLogged && <Link to={`/profile/${this.props.user}`} className={classes.link}>
            <ListItem button>
              <ListItemIcon><Icon>account_box</Icon></ListItemIcon>
              <ListItemText primary='Profile' />
            </ListItem>
        </Link>}
        <Link to="/browse" className={classes.link} exact>
            <ListItem button>
              <ListItemIcon><Icon>search</Icon></ListItemIcon>
              <ListItemText primary='Browse' />
            </ListItem>
        </Link>
        <Divider />
        {!this.props.isLogged && <Link to="/login" className={classes.link}>
            <ListItem button>
              <ListItemIcon><Icon>vpn_key</Icon></ListItemIcon>
              <ListItemText primary='Log In' />
            </ListItem>
        </Link>}
        {!this.props.isLogged && <Link to="/signup" className={classes.link}>
            <ListItem button>
              <ListItemIcon><Icon>perm_identity</Icon></ListItemIcon>
              <ListItemText primary='Sign Up' />
            </ListItem>
        </Link>}
        <Divider />
        {this.props.isLogged && <Link to="/manage-account" className={classes.link}>
            <ListItem button>
              <ListItemIcon><Icon>build</Icon></ListItemIcon>
              <ListItemText primary='Manage Account' />
            </ListItem>
        </Link>}
        {this.props.isLogged && <Link to="/add-product" className={classes.link}>
            <ListItem button>
              <ListItemIcon><Icon>store</Icon></ListItemIcon>
              <ListItemText primary='Add a Product' />
            </ListItem>
        </Link>}
        <Divider />
        {this.props.isLogged && <Link to="/" className={classes.link} onClick={(e) => this.handleLogoutClick(e)}>
            <ListItem button>
              <ListItemIcon><Icon>directions_run</Icon></ListItemIcon>
              <ListItemText primary='Log Out' />
            </ListItem>
        </Link>}
      </List>
    </div>
    );

    return (
      <div>
        <Drawer anchor="right" open={this.props.open} onClose={this.props.toggle('right', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.toggle('right', false)}
            onKeyDown={this.props.toggle('right', false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

NavDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavDrawer);