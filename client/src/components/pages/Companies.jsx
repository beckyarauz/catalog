import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

import api from '../../api';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:'column',
  },
  margin: {
    margin: theme.spacing.unit,
    marginTop: 20,
  },
  paper: {
    height: 200,
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:14,
    padding:15,
    borderRadius: '15px 50px 30px',
    marginTop:20
  },
  gridContainer:{
    width:'100%',
    height:'100%',
    borderRadius:4,
  },
  gridImage:{
    borderRadius: '15px 50px 0px 0px'
  },
  gridContent:{
    borderRadius: '0px 0px 30px 50px'
  },
  gridItem:{
    flex:1
  }
});

class Companies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category:'',
      companies:null,
      message: null,
      error: null,
      spacing: '16',
    }
  }
  componentDidMount(){
    this.setState({category:this.props.category})
    
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps !== this.props){
      this.setState(currentState => ({category:this.props.category}), ()=>{
        // console.log(this.state.category);
        let category = this.state.category.toLowerCase();
        // console.log(category);
        (async ()=>{
          let data = await api.getCompanies(category);
          if(data.data.companies && data.data.companies !== undefined && data.data.companies !== null && data.data.companies.length > 0){
            let companies = data.data.companies;
            // console.log(companies);
            this.setState(currentState => ({companies}))
          } else if(data.statusText){
            if(this.state.companies !== null){
              this.setState(currentState => ({companies:null}))
            }
            let error = data.statusText;
            this.setState(currentState => ({error}))
            setTimeout(() =>{
              this.setState(currentState => ({error: null}))
            }, 3000)
          } else if(data.data.message){
            // if(this.state.companies !== null){
            //   this.setState(currentState => ({companies:null}))
            // }
            let message = data.data.message;
            this.setState(currentState => ({message}))
            setTimeout(() =>{
              this.setState(currentState => ({message: null}))
            }, 3000)
          }
          
        })()
      });
      
    }
    
  }

  render() {
    const { classes } = this.props;

    return (
      
      <div className={classNames(classes.root ,classes.margin)}>
        {this.state.error && <div className="info info-danger">{this.state.error}</div>}
        {this.state.message && <div className="info alert-info">{this.state.message}</div>}
        {this.state.companies && (this.state.companies.length > 0) && (this.state.companies.map((company,idx) => {
            return (
              <Paper className={classNames(classes.paper)} key={company._id}>
                <Grid className={classNames(classes.gridContainer)} container spacing={16} direction='column'>
                  
                      <Paper className={classNames(classes.gridImage,classes.gridItem)} elevation={18} style={{ backgroundImage: `url(https://img3.stockfresh.com/files/b/balabolka/m/95/5959516_stock-vector-seamless-pattern-with-beauty-and-cosmetics-background.jpg)`,}}>
                        <Grid container style={{height:'100%', width:'100%',position:'relative'}}>
                          <Avatar style={{backgroundColor:'rgba(0,0,0,0.5)', position:'absolute',bottom:5,right:5}}><Icon>wc</Icon></Avatar>
                        </Grid>
                      </Paper>
                      <Paper className={classNames(classes.gridContent,classes.gridItem)} elevation={4}>
                            <Typography variant="h5" component="h3">
                              {company.company}
                            </Typography>
                            <Typography component="p">
                              {company.about}
                            </Typography>
                      </Paper>
                </Grid>
            </Paper>
            )
        }))}
      </div>
    );
  }
}

Companies.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Companies);
