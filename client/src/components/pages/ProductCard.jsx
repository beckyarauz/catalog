  import React from 'react';
  import PropTypes from 'prop-types';
  import { withStyles } from '@material-ui/core/styles';
  import Card from '@material-ui/core/Card';
  // import CardActionArea from '@material-ui/core/CardActionArea';
  import CardActions from '@material-ui/core/CardActions';
  import CardContent from '@material-ui/core/CardContent';
  import CardMedia from '@material-ui/core/CardMedia';
  import Button from '@material-ui/core/Button';
  import Typography from '@material-ui/core/Typography';
  import Icon from '@material-ui/core/Icon';
  import ButtonBase from '@material-ui/core/ButtonBase';

 
  
  const styles = {
    card: {
      maxWidth: 150,
      minWidth: 150,
      marginBottom: '20px',
      position:'relative'
    },
    media: {
      height: 150,
    },
    title: {
      fontSize: 14,
    },
    content :{
      padding:'5px',
    },
    actionText:{
      fontSize: '0.7rem'
    },
    trash:{
      color:'#ab003c',
      padding:0,
      width: 27
    },
    bookmark:{
      color: '#32c3ff',
      fontSize:36
    },
    actionBookmark:{
      width: 27,
      position: 'absolute',
      right: '5px',
      top: 0,
      // padding:2,
    },
    edit:{
      color: '#8bc34a',
      padding:0,
      width: 27
    },
    actionIcons:{
      display:'flex',
      justifyContent:'flex-end',
    }
  };
  
  function ProductCard(props) {
    const { classes } = props;
    let handleDetail = (e) => {
      props.detailHandler({...props.product})
    }
    let handleContactSeller = (e) => {
      props.contactSeller(props.product._id);
    }
    let handleEditProduct = (e) => {
      props.edit({product: props.product});
    }
    let handleDeleteProduct = (e) => {
        props.delete(props.product.imageUrl,props.product._id);
    }
    let handleSaveProduct = (e) => {
      props.save(props.product._id);
    }

    return (
      <Card className={classes.card}>
        {/* <CardActionArea> */}
          {props.product.imageUrl ?
         (<CardMedia
          className={classes.media}
          image={props.product.imageUrl}
        />) : 
        (<CardMedia
        className={classes.media}
        image='http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png'
      />)}
          <CardContent className={classes.content}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
         {props.product.name}
        </Typography>
            <Typography gutterBottom component="p">
              ${props.product.price}
            </Typography>
            {props.isOwner ? 
            (<div className={classes.actionIcons}>
              <ButtonBase className={classes.edit} onClick={handleEditProduct}>
                <Icon>create</Icon>
              </ButtonBase>
              <ButtonBase className={classes.trash} onClick={handleDeleteProduct}>
                <Icon>delete</Icon>
              </ButtonBase>
            </div>) :
            (<div className={classes.actionBookmark}>
              <ButtonBase className={classes.bookmarkButton} onClick={handleSaveProduct}>
                <Icon className={classes.bookmark}>bookmark</Icon>
              </ButtonBase>
            </div>)}
          </CardContent>
        {/* </CardActionArea> */}
        {!props.isOwner &&
        <CardActions>
          <Button size="small" className={classes.actionText} color="primary" onClick={e => handleDetail(e)}>
            Details
          </Button>
          <Button size="small" className={classes.actionText} color="primary" onClick={e => handleContactSeller(e)}>
            Contact Seller
          </Button>
        </CardActions>}
      </Card>
    );
  }
  
  ProductCard.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(ProductCard);
