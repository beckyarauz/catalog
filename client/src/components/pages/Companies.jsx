import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

import api from '../../api';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  margin: {
    margin: theme.spacing.unit,
    marginTop: 20,
  },
  paper: {
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    padding:'5px 13px',
    borderRadius: '15px 50px 30px',
    '-webkit-border-top-left-radius' :'15px',
    '-webkit-border-top-right-radius' :'50px',
    '-webkit-border-bottom-right-radius' :'30px',
    '-webkit-border-bottom-left-radius' :'50px',
    marginTop: 20,
  },
  buttonBase: {
    flex: 1,
    height: '100%',
    display: 'block',
    borderRadius: '15px 50px 30px',
    '-webkit-border-top-left-radius' :'15px',
    '-webkit-border-top-right-radius' :'50px',
    '-webkit-border-bottom-right-radius' :'30px',
    '-webkit-border-bottom-left-radius' :'50px',
  },
  gridContainer: {
    height: '100%',
    borderRadius: '15px 50px 30px',
    '-webkit-border-top-left-radius' :'15px',
    '-webkit-border-top-right-radius' :'50px',
    '-webkit-border-bottom-right-radius' :'30px',
    '-webkit-border-bottom-left-radius' :'50px',
  },
  gridImage: {
    borderRadius: '15px 50px 0px 0px',
    '-webkit-border-top-left-radius' :'15px',
    '-webkit-border-top-right-radius' :'50px',
    '-webkit-border-bottom-right-radius' :'0px',
    '-webkit-border-bottom-left-radius' :'0px',
    flex: 1,
  },
  gridContent: {
    borderRadius: '0px 0px 30px 50px',
    '-webkit-border-top-left-radius' :'0px',
    '-webkit-border-top-right-radius' :'0px',
    '-webkit-border-bottom-right-radius' :'30px',
    '-webkit-border-bottom-left-radius' :'50px',
    
  },
  gridItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0 10px 0',
    flexWrap: 'wrap',
    maxWidth: '230px',
    maxHeight: '80px',
  },
  tags: {
    padding: '5px',
    margin: '0 3px',
    marginBottom: '3px',
    backgroundColor: '#eee',
  }
});

class Companies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: 'all',
      companies: null,
      message: null,
      error: null,
      spacing: '16',
      location: null,
      filteredCompanies: []
    }
  }

  mounted = false;
  handleClick = (e, username) => {
    this.props.handleCardClick(username);
  }
  backImage = (category) => {
    let image;
    let icon;
    switch (category) {
      case 'beauty':
        image = 'https://img3.stockfresh.com/files/b/balabolka/m/95/5959516_stock-vector-seamless-pattern-with-beauty-and-cosmetics-background.jpg';
        icon = 'spa';
        break;
      case 'food':
        image = 'https://i.pinimg.com/originals/f0/c3/32/f0c332d32df07415ecb1f07dc500fa74.jpg';
        icon = 'restaurant'
        break;
      case 'gifts':
        image = 'https://st2.depositphotos.com/4948655/8247/v/950/depositphotos_82474894-stock-illustration-seamless-birthday-pattern.jpg';
        icon = 'redeem'
        break;
      case 'furniture':
        image = 'https://previews.123rf.com/images/seamartini/seamartini1608/seamartini160800101/61439594-furniture-seamless-background-wallpaper-with-vector-pattern-icons-of-vintage-and-classic-home-access.jpg';
        icon = 'weekend'
        break;
      case 'tattoo':
        image = 'https://i.pinimg.com/originals/71/1f/2b/711f2b5491cb72d99073318d981d4cff.jpg';
        icon = 'brush'
        break;
      case 'art':
        image = 'https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg?cs=srgb&dl=abstract-abstract-expressionism-abstract-painting-1070527.jpg&fm=jpg';
        icon = 'color_lens'
        break;
      case 'clothing':
        image = 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/276000/580/386/m1/fpnw/wm1/vector-pattern-with-hand-drawn-womens-clothes-.jpg?1418840753&s=223af5d1d7daf263f2b17d09b4e89a5e';
        icon = 'wc'
        break;
      default:
        image = 'http://www.freechristmaswallpapers.net/web/wallpapers/thumbnail/Christmas-Tree-Nature_lg.jpeg';
        icon = 'redeem'
    }

    return {
      image,
      icon
    }
  }

  companyCard = (classes, array) => {
    return (
      array.map((company, idx) => {
        let { image, icon } = this.backImage(company.category);
        return (
          <Paper className={classNames(classes.paper)} key={company._id}>
            <ButtonBase className={classNames(classes.buttonBase)} onClick={e => this.handleClick(e, company.username)}>
              <Grid className={classNames(classes.gridContainer)} container spacing={16} direction='column'>
                <Paper className={classNames(classes.gridImage, classes.gridItem)} elevation={18} style={{ backgroundImage: `url(${image})` }}>
                  <Grid container style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <Avatar style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', bottom: 5, right: 5 }}><Icon>{icon}</Icon></Avatar>
                  </Grid>
                </Paper>
                <Paper className={classNames(classes.gridContent, classes.gridItem)} elevation={4}>
                  <Typography variant="h5" component="h3">
                    {company.company}
                  </Typography>
                  <Typography component="p">
                    {company.about}
                  </Typography>
                  <div className={classes.tagsContainer}>
                    {company.tags && company.tags !== undefined && company.tags.length > 0 && (
                      company.tags.map((tag, idx) => (
                        <Paper key={idx} className={classes.tags}>{tag.text}</Paper>
                      ))
                    )}
                  </div>
                </Paper>
              </Grid>
            </ButtonBase>
          </Paper>
        )
      })
    )
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.category && this.props.category !== null) {
      this.setState({ category: this.props.category })
    }
    if ("geolocation" in navigator) {
      let self = this;
      navigator.geolocation.getCurrentPosition(async function (position) {
        let { latitude,longitude } = position.coords
        let currentLocation = { latitude,longitude }
        let data = await api.getCompanies(self.state.category, currentLocation);
        if(self.mounted){
          self.setState(prevState => ({ currentLocation, companies: data.data.companies, message: 'Companies near you' }));
        }
      })
    } else {
      console.log('geolocation not available');
      if(this.mounted){
        this.setState({ message: 'Turn location on to browse companies near you' });
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(!this.mounted){
      return;
    }
    if (prevProps.category !== this.props.category) {
      this.setState(currentState => ({ category: this.props.category }), () => {
        if (this.state.filteredCompanies.length > 0) {
          this.setState(state => ({ filteredCompanies: [] }));
        }
        let {category, currentLocation:location} = this.state;

        if (category && category !== 'all' && category !== null) {
          category = category.toLowerCase();
          (async () => {
            // console.log('async',category);
            let data = await api.getCompanies(category, location);
            let companies = data.data.companies;
            let message = data.data.message;
            let error = data.statusText;

            if (companies && companies !== undefined && companies !== null && companies.length > 0) {
              this.setState(currentState => ({ companies }));
            } else if (error) {
              if (this.state.companies !== null) {
                this.setState(currentState => ({ companies: null }));
              }
              this.setState(currentState => ({ error }));
            } else if (message) {
              if (this.state.companies !== null) {
                this.setState(currentState => ({ companies: null }));
              }
              this.setState(currentState => ({ message }));
            }
          })()
        }
      });
    }
    
    if (this.props.search !== prevProps.search) {
      let str = this.props.search;
      let reg = new RegExp('^' + str, 'i');
      if (this.state.filteredCompanies.length > 0 && str.length <= 0) {
        this.setState(state => ({ filteredCompanies: [] }));
        return;
      }
      let filteredCompanies = [...this.state.companies]
        .filter(company => (company.tags.length > 0) && (company.tags.filter(tag => reg.test(tag.text)).length > 0))

      this.setState(state => ({ filteredCompanies }));
    }

    if(prevState.message !== this.state.message){
      setTimeout(() => {
        this.setState(currentState => ({ message: null }))
      }, 3000)
    }
    if(prevState.error !== this.state.error){
      setTimeout(() => {
        this.setState(currentState => ({ error: null }))
      }, 2000)
    }
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classNames(classes.root, classes.margin)}>
        {this.state.error && <div className="info info-danger" style={{ textAlign: 'center' }}>{this.state.error}</div>}
        {this.state.message && <div className="info alert-info" style={{ textAlign: 'center' }}>{this.state.message}</div>}
        {(this.props.search.length <= 0) && this.state.companies && (this.state.companies.length > 0) && this.companyCard(classes, this.state.companies)}
        {(this.props.search.length > 0) && (this.state.filteredCompanies.length > 0) && this.companyCard(classes, this.state.filteredCompanies)}
      </div>
    );
  }
}

Companies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Companies);
