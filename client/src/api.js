import axios from 'axios'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true
})

export default {
  service: service,
  async isLoggedIn() {
    return service.get(`/isLogged`)
      .then( res => {
        return res.data;
      })
      .catch(e => console.log(e));     
  },
  async signup(userInfo) {
    return await service
      .post(`/signup`, userInfo);
  },
  async login(username, password) {
    let data = await service.post(`/login`,{username, password});
    return data;
  },
  logout() {
    localStorage.removeItem('user')
    return service
      .get(`/logout`)
  },
  async deleteFromS3(url,type,id){
    return await service
    .post(`/file/delete`,{url,type,id})
  },
  async uploadToS3(file,type) {
    if(!file){
      return {message: 'no image to upload'}
    }
      const formData = new FormData();
    
      formData.append('file', file);
      formData.append('myType', type);
      // console.log('formdata',formData);
      let data = await service
                      .post(`/file/upload`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      })
      return data;
  },
  async getUserInfo(username){
    let data = await service.get(`/user/profile/user/${username}`);
    return data;
  },
  async getCompanyInfo(username){
    let data = await service.get(`/user/profile/company/${username}`);
    return data;
  },
  async getCompanies(category,location,dist){
    if(category !== 'all' && category !== null){
      let data = await service.get(`/company/${category}/all`);
      return data;
    } else {
      if(location && location !== undefined){
      let data = await service.get(`/company/all?latitude=${location.latitude}&longitude=${location.longitude}`);
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
    let data = await service.post(`/product/delete`,{product:id})
    return data;
  },
  async addBookmark(id){
    let data = await service.post(`/user/bookmark/add`,{product:id})
    return {...data};
  },
  async removeBookmark(id){
    let data = await service.post(`/user/bookmark/remove`,{product:id})
    return {...data};
  },
  async addProduct(product){
    let savedProd = await service.post(`/product/add`,{product});
    return savedProd;
  },
  async editProduct(product){
    let editedProd = await service.post(`/product/edit`,{product});
    return editedProd;
  },
  async getProducts(user){
    let products = await service.get(`/product/${user}/all`);
    return products;
  },
  async deleteAccount(){
    let data = await service.delete(`/user/account/delete`);
    return data;
  },
  async sendMessage(mail){
    let response = await service.post(`/message/send`,{mail})
    return response;
  }
}



