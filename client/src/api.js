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
    return service.get(`${process.env.REACT_APP_API_URL}/isLogged`)
      .then( res => {
        // console.log('console',res.data);
        return res.data;
      })
      .catch(e => console.log(e));     
  },
  async signup(userInfo) {
    return await service
      .post(`${process.env.REACT_APP_API_URL}/signup`, userInfo);
  },

  async login(username, password) {
    let data = await service.post(`${process.env.REACT_APP_API_URL}/login`,{username, password});
    return data;
  },

  logout() {
    localStorage.removeItem('user')
    return service
      .get(`${process.env.REACT_APP_API_URL}/logout`)
  },
  async deleteFromS3(url,type,id){
    return await service
    .post(`${process.env.REACT_APP_API_URL}/file/delete`,{url,type:type,id})
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
                      .post(`${process.env.REACT_APP_API_URL}/file/upload`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      })
      // console.log('uploadtoS3 async', data);
      return data;
  },
  async getUserInfo(username){
    let data = await service.get(`${process.env.REACT_APP_API_URL}/user/profile/user/${username}`);
    return data;
  },
  async getCompanyInfo(username){
    let data = await service.get(`${process.env.REACT_APP_API_URL}/user/profile/company/${username}`);
    return data;
  },
  async getCompanies(category,location,dist){
    if(category !== 'all' && category !== null){
      let data = await service.get(`${process.env.REACT_APP_API_URL}/company/${category}/all`);
      return data;
    } else {
      if(location && location !== undefined){
      let data = await service.get(`${process.env.REACT_APP_API_URL}/company/all?latitude=${location.latitude}&longitude=${location.longitude}`);
      return data;
      } else {
        return {data: {
          message: `Can't find companies if you don't turn your location on`
        }}
      }
    }
  },
  async updateUser(stateInfo){
    return await service.post(`${process.env.REACT_APP_API_URL}/user/info/update`,{stateInfo})
  },
  async deleteProduct(id){
    let data = await service.post(`${process.env.REACT_APP_API_URL}/product/delete`,{product:id})
    return data;
  },
  async addBookmark(id){
    let data = await service.post(`${process.env.REACT_APP_API_URL}/user/bookmark/add`,{product:id})
    return {...data};
  },
  async removeBookmark(id){
    let data = await service.post(`${process.env.REACT_APP_API_URL}/user/bookmark/remove`,{product:id})
    return {...data};
  },
  async addProduct(product){
    let savedProd = await service.post(`${process.env.REACT_APP_API_URL}/product/add`,{product});
    return savedProd;

  },
  async editProduct(product){
    let editedProd = await service.post(`${process.env.REACT_APP_API_URL}/product/edit`,{product});
    return editedProd;

  },
  async getProducts(user){
    let products = await service.get(`${process.env.REACT_APP_API_URL}/product/${user}/all`);
    return products;
  },
  async deleteAccount(){
    let data = await service.delete(`${process.env.REACT_APP_API_URL}/user/account/delete`);
    return data;
  },
  async sendMessage(mail){
    let response = await service.post(`${process.env.REACT_APP_API_URL}/message/send`,{mail})
    return response;
  }

}



