import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';

import { Link } from 'react-router-dom';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
// import PersonIcon from '@material-ui/icons/Person';
// import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import blue from '@material-ui/core/colors/blue';
import classNames from 'classnames';

const styles = {
  detailPanel :{
    display:'flex',
    justifyContent:'center'
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  details :{
    textAlign: 'center',
    fontSize: 14
  },
  header:{
    display:'flex',
    padding:'20px',
  },
  image:{
    flex:1
  },
  rightDetail:{
    flex:2
  }
};


class ProductDetail extends React.Component {
  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog fullScreen className={classNames(classes.detailPanel)} onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
      <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
        <DialogTitle id="simple-dialog-title">{this.props.product.name}</DialogTitle>
        <DialogContent>
          <div className={classes.header}>
            <div className={classes.image}>
              <img src={this.props.product.imageUrl} alt='product' width="100px" height="100px"/>
            </div>
            <div className={classNames(classes.details,classes.rightDetail)}>
              <Typography variant="subtitle1" color="textSecondary">
                Price
              </Typography>
              <Typography component="p">
                ${this.props.product.price}
              </Typography>
              {this.props.product.seller && 
              <div>
                <Typography variant="subtitle1" color="textSecondary">
                Seller
                </Typography>
                <Typography component="p">
                <Link to={`/profile/company/${this.props.product.seller.username}`}> {this.props.product.seller.company}</Link>
                </Typography>
              </div>
            }
            </div>
          </div>
          <Divider />
          <div className={classes.details}>
            <Typography variant="subtitle1" color="textSecondary">
              Product Description
            </Typography>
            <Typography component="p">
              {this.props.product.description}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

ProductDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(ProductDetail); 