  import React from 'react';
  import PropTypes from 'prop-types';
  import { withStyles } from '@material-ui/core/styles';
  import Card from '@material-ui/core/Card';
  import CardActionArea from '@material-ui/core/CardActionArea';
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
      color: 'red',
      padding:0,
      width: 27
    },
    edit:{
      color: 'green',
      padding:0,
      width: 27
    },
    actionIcons:{
      textAlign: 'center',
    }
  };
  
  function ProductCard(props) {
    const { classes } = props;
    let handleDetail = (e) => {
      props.detailHandler({name: props.name, id:props.dbid})
    }
    let handleContactSeller = (e) => {
      let productId = props.dbid;
      console.log(productId)
      props.contactSeller(productId);
    }
    let handleEditProduct = (e) => {
      let productId = props.dbid;
      console.log(productId)
      props.edit(productId);
    }
    let handleDeleteProduct = (e) => {
      let productId = props.dbid;
      props.delete(props.image,productId);
    }
    let handleSaveProduct = (e) => {
      let productId = props.dbid;
      props.save(productId);
    }

    return (
      <Card className={classes.card}>
        <CardActionArea>
          {props.image ?
         ( <CardMedia
          className={classes.media}
          image={props.image}
          title="Contemplative Reptile"
        />) : 
        (<CardMedia
        className={classes.media}
        image='http://saveabandonedbabies.org/wp-content/uploads/2015/08/default.png'
        title="Contemplative Reptile"
      />)
          }
          <CardContent className={classes.content}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
         {props.name}
        </Typography>
            <Typography gutterBottom component="p">
              ${props.price}
            </Typography>
            {props.isOwner ? (
            <div className={classes.actionIcons}>
            <ButtonBase className={classes.edit} onClick={handleEditProduct}>
              <Icon>create</Icon>
            </ButtonBase>
            <ButtonBase className={classes.trash} onClick={handleDeleteProduct}>
              <Icon>delete</Icon>
            </ButtonBase>
              </div>) :
              (<ButtonBase className={classes.trash} onClick={handleSaveProduct}>
              <Icon>bookmark</Icon>
            </ButtonBase>)
          }
          </CardContent>
        </CardActionArea>
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
