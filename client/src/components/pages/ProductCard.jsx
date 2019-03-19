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
  
  const styles = {
    card: {
      maxWidth: 345,
    },
    media: {
      height: 240,
    },
  };
  
  function ProductCard(props) {
    const { classes } = props;

    // const product = {
    //   name: props.name,
    //   price: props.price,
    //   description: props.description,

    // }
    let handleDetail = (e) => {
      props.detailHandler({name: props.name, id:props.dbid})
    }
    let handleContactSeller = (e) => {
      let productId = props.dbid;
    }

    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={props.image}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {/* Lizard */}
              {props.name}
            </Typography>
            <Typography gutterBottom variant="h6" component="h2">
              ${props.price}
            </Typography>
            <Typography component="p">
            {props.description}
              {/* Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica */}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" onClick={e => handleDetail(e)}>
            Details
          </Button>
          <Button size="small" color="primary" onClick={e => handleContactSeller(e)}>
            Contact Seller
          </Button>
        </CardActions>
      </Card>
    );
  }
  
  ProductCard.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(ProductCard);
