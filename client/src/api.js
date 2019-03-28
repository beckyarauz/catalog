import axios from 'axios'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true
})

// const errHandler = err => {
//   console.error(err)
//   if (err.response && err.response.data) {
//     console.error("API response", err.response.data)
//     throw err.response.data.message
//   }
//   throw err
// }

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
    // console.log('file: api.js message: api.login called', `${username},${password}`);
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
  // async getUserInfo(){
  //   // console.log('getUserInfocalled')
  //   let data = await service.get('/user/info');
  //   // console.log('api getUserInfo response:', data)
  //   return data;
  // },
  async getUserInfo(username){
    let data = await service.get(`/user/profile/${username}`);
    return data;
  },
  async getCompanies(category,location,dist){
    // console.log('get Companies! location:',location)
    // console.log('get Companies! category:',category)
    if(category !== 'all' && category !== null){
      // console.log('category is set')
      let data = await service.get(`/company/${category}/all`);
      // console.log('get Companies! data:',data)
      return data;
    } else {
      if(location && location !== undefined){
        // console.log('getting server')
      let data = await service.get(`/company/all?latitude=${location.latitude}&longitude=${location.longitude}`);
      // console.log('get Companies with location! data:',data)
      return data;
      } else {
        return {data: {
          message: `Can't find companies if you don't turn your location on`
        }}
      }
    }
  },
  async updateUser(stateInfo){
    return await service.post(`/user/info/update`,{stateInfo})
  },
  async deleteProduct(id){
    let data = await service.post('/product/delete',{product:id})
    return data;
  },
  async addBookmark(id){
    let data = await service.post('/user/bookmark/add',{product:id})
    return {...data};
  },
  async removeBookmark(id){
    let data = await service.post('/user/bookmark/remove',{product:id})
    return {...data};
  },
  async addProduct(product){
    let savedProd = await service.post('/product/add',{product});
    return savedProd;

  },
  async editProduct(product){
    let editedProd = await service.post('/product/edit',{product});
    return editedProd;

  },
  async getProducts(user){
    let products = await service.get(`/product/${user}/all`);
    return products;
  }
}



