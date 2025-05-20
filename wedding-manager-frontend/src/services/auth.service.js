import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'signin', {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, email, password, firstName, lastName, phoneNumber, roles) {
    return axios.post(API_URL + 'signup', {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      roles
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isUserLoggedIn() {
    const user = this.getCurrentUser();
    return !!user && !!user.accessToken;
  }

  getToken() {
    const user = this.getCurrentUser();
    return user?.accessToken;
  }

  hasRole(requiredRoles) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return requiredRoles.some(role => user.roles.includes(role));
  }

  updateProfile(firstName, lastName, phoneNumber, currentPassword, newPassword) {
    return axios
      .put(API_URL + 'profile', {
        firstName,
        lastName,
        phoneNumber,
        password: newPassword,
        currentPassword
      }, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }
}

export default new AuthService(); 