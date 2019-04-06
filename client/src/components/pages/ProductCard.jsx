  import React from 'react';
  import PropTypes from 'prop-types';
  import { withStyles } from '@material-ui/core/styles';
  import Card from '@material-ui/core/Card';
  import CardActions from '@material-ui/core/CardActions';
  import CardContent from '@material-ui/core/CardContent';
  import CardMedia from '@material-ui/core/CardMedia';
  import Button from '@material-ui/core/Button';
  import Typography from '@material-ui/core/Typography';
  import Icon from '@material-ui/core/Icon';
  import ButtonBase from '@material-ui/core/ButtonBase';
  import Avatar from '@material-ui/core/Avatar';

  import imagePlaceholder from '../../images/image-placeholder.gif';
  
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
      color: 'rgba(255,255,255,1)',
      backgroundColor:'rgba(224,224,224,0.7)'
    },
    actionBookmark:{
      position: 'absolute',
      right: '2px',
      top: '2px',
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
    // console.log('is Owner?:',props.isOwner)
    // console.log('is Logged?:',props.isLogged)
    // console.log('is Bookmarked?:',props.bookmarked)
    const { classes } = props;
    let handleDetail = (e) => {
      props.detailHandler({...props.product})
    }
    let handleContactSeller = (e) => {
      props.contactSeller({id:props.product._id, name:props.product.name,sellerEmail:props.product.seller.email});
    }
    let handleEditProduct = (e) => {
      props.edit({product: props.product});
    }
    let handleDeleteProduct = (e) => {
        props.delete(props.product.imageUrl,props.product._id);
    }

    let handleBookmark = (e) =>{
      props.bookmarked ? handleRemoveProduct() : handleSaveProduct();
    }
    let handleSaveProduct = (e) => {
      props.save(props.product._id);
    }
    let handleRemoveProduct = (e) => {
      props.remove(props.product._id);
    }

    return (
      <Card className={classes.card}>
          {props.product.imageUrl ?
         (<CardMedia
          className={classes.media}
          image={props.product.imageUrl}
        />) : 
        (<CardMedia
        className={classes.media}
        image={imagePlaceholder}
      />)}
          <CardContent className={classes.content}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
         {props.product.name}
        </Typography>
            <Typography gutterBottom component="p">
              ${props.product.price}
            </Typography>
            { (props.isOwner && !props.bookmarked) ? 
            (<div className={classes.actionIcons}>
              <ButtonBase className={classes.edit} onClick={handleEditProduct}>
                <Icon>create</Icon>
              </ButtonBase>
              <ButtonBase className={classes.trash} onClick={handleDeleteProduct}>
                <Icon>delete</Icon>
              </ButtonBase>
            </div>) :
            ( props.isLogged && (!props.isOwner || props.bookmarked) && <div className={classes.actionBookmark}>
              <ButtonBase className={classes.bookmarkButton} onClick={handleBookmark}>
                <Avatar className={classes.bookmark}><Icon>{!props.bookmarked ? 'bookmark_border': 'clear'}</Icon></Avatar>
              </ButtonBase>
            </div>)}
          </CardContent>
        {(!props.isOwner || props.bookmarked) &&
        <CardActions>
          <Button size="small" className={classes.actionText} color="primary" onClick={e => handleDetail(e)}>
            Details
          </Button>
         { props.isLogged && 
         <Button size="small" className={classes.actionText} color="primary" onClick={e => handleContactSeller(e)}>
            Contact Seller
          </Button>}
        </CardActions>}
      </Card>
    );
  }
  
  ProductCard.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(ProductCard);
