import axios from 'axios'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true
})

const errHandler = err => {
  console.error(err)
  if (err.response && err.response.data) {
    console.error("API response", err.response.data)
    throw err.response.data.message
  }
  throw err
}

export default {
  service: service,
  // To know if the user is connected, we just check if we have a value for localStorage.getItem('user')
   isLoggedIn() {
    return service.get('/isLogged')
      .then( res => {
        // console.log('console',res.data);
        return res.data;
      })
      .catch(e => console.log(e));     
  },

  // This method returns the user from the localStorage
  // Be careful, the value is the one when the user logged in for the last time
  getLocalStorageUser() {
    return JSON.parse(localStorage.getItem('user'))
  },

  // This method signs up and logs in the user
  async signup(userInfo) {
    return await service
      .post('/signup', userInfo);
  },

  async login(username, password) {
    console.log('file: api.js message: api.login called', `${username},${password}`);
    await service.post('/login',{username, password});
  },

  logout() {
    localStorage.removeItem('user')
    return service
      .get('/logout')
  },
  async deleteFromS3(url,type){
    return await service
    .post(`/upload/delete`,{url,type:type})
  },
  async uploadToS3(file,type) {
    if(!file){
      return {message: 'no image to upload'}
    }
    // console.log('type',type);
      const formData = new FormData();
    
      formData.append('file', file);
      formData.append('myType', type);
      // console.log('formdata',formData);
      let data = await service
                      .post(`/upload`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      })
      // console.log('uploadtoS3 async', data);
      return data;
  },
  async getUserInfo(){
    // console.log('getUserInfocalled')
    let data = await service.get('/user/info');
    // console.log('api getUserInfo response:', data)
    return data;
  },
  async getCompanies(category,location){
    console.log('get Companies! location:',location)
    console.log('get Companies! category:',category)
    if(category !== 'none' && category !== null){
      console.log('category is set')
      let data = await service.get(`/company/${category}/all`);
      console.log('get Companies! data:',data)
      return data;
    } else {
      console.log('getting server')
      let data = await service.get(`/company/all?latitude=${location.latitude}&longitude=${location.longitude}`);
        console.log('get Companies with location! data:',data)
      return data;
    }
    

  },
  async updateUser(stateInfo){
    return await service.post(`/update/company-info`,{stateInfo})
  },
  getCountries() {
    return service
      .get('/countries')
      .then(res => res.data)
      .catch(errHandler)
  },

  getSecret() {
    return service
      .get('/secret')
      .then(res => res.data)
      .catch(errHandler)
  },

  addPicture(file) {
    const formData = new FormData()
    formData.append("picture", file)
    return service
      .post('/endpoint/to/add/a/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data)
      .catch(errHandler)
  },
  async addProduct(product){
    // console.log('addProduct api called!');
    let savedProd = await service.post('/product/add',{product});
    console.log('addProduct RESPONSE',savedProd)
    return savedProd;

  },
  async getProducts(user){
    // console.log('get Products!')
    let products = await service.get(`/product/${user}/all`);
    return products;

  }
}



