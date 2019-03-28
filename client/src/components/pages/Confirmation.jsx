import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class Confirmation extends React.Component {
  handleClick = (confirm) => {
    this.props.onConfirm(confirm)
    this.props.onClose()
  }

  render() {
    return (
        <Dialog
          open={this.props.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.props.onClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {this.props.message}
          </DialogTitle>
          <DialogActions>
            <Button onClick={(e) => this.handleClick(false)} color="primary">
              No
            </Button>
            <Button onClick={(e) => this.handleClick(true)} color="secondary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default Confirmation;