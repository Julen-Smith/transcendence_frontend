//import router from '@/router';
import axios from 'axios';
import axiosInstance from '../axiosService';
//import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

async function postGateway(endpoint) {
  axiosInstance.post(endpoint, {timeout: 1000})
  .then((response) => {
    console.log("Succesful POST request: ", response);
  })
  .catch((error) => {
    console.log("Error in POST request: ", error);
  });
}

async function checktoken() {
  try {
      await axiosInstance.post('https://trascendence.tech:4242/api/check');
      } catch (error) {
          console.log('Error al cargar los datos del usuario:', error);
      }
}


async function getGateway() {
  try {
    const res = await axios.get('https://trascendence.tech:4242/api/login/google', {timeout: 5000});
    return res.data.url;
  } catch (error) {
      console.log("Error in GET request: ", error);
      return null;
  }
}

async function check_register(credentials)
{
  try {
    const response = await axiosInstance.post('/check_reg_user', credentials);
    return { success: true, data: response.data, error: null };
  } catch (error) {
    if (error.response) {
      return { 
        success: false, 
        data: null, 
        error: error.response.data.detail || 'Error desconocido.', 
        status: error.response.status 
      };
  }
  console.log("Error desconocido");
 }
}

//RegisterView @POST /create_user


//LoginView @POST /login_user
async function login(credentials) {
  try {
    const response = await axiosInstance.post('/login/default', credentials);
    //aqui metemos lo del refresh?????
    console.log("Response data de LOGIN es  : ",response.data)
    if (response.status == 200) {
          const { access, refresh } = response.data;
          console.log("ACCESS Y REFRESH DESDE DATA")
          localStorage.setItem('authToken', access);
          localStorage.setItem('refreshToken', refresh);
          const decoded = jwtDecode(access);
          console.log("Decoded token:", decoded);

    return { 
      success: true, 
      data: response.data, 
      error: null, 
      status: response.status 
    };
  }} catch (error) {
    if (error.response) {
      return { 
        success: false, 
        data: null, 
        error: error.response.data.detail || 'Error desconocido.', 
        status: error.response.status 
      };
    } else {
      console.log("Error making the request:", error);
      return { 
        success: false, 
        data: null, 
        error: 'Necesita verificación OTP', 
        status: 428 
      };
    }
  }
}

async function handleIntraRedirect() {
    try {
      // Peticion de build url al back
     // const response = await axios.get('http://trascendence.tech:4242/api/intra');
      // Redireccion a la url
      window.location.href = 'https://trascendence.tech:4242/api/intra';
    } catch (error) {
      console.log('Error al manejar el inicio de sesión con Intra 42:', error);
      window.location.href = 'https://trascendence.tech';
    }
}

async function backendOTPVerification(otpCode, email, username, password) {
  //console.log("Backend OTP verification");
  try {
    const response_otp = await axiosInstance.post('/verify-otp', {}, {
      headers: {
        'otp': otpCode,
        'email': email
      }
    });
    //console.log("Response from backend:", response_otp.data); 
    if (response_otp.status === 200 && response_otp.data.Result === "OK") {      
      try {
        //const { success, error , response } = 
        //const response = await register(credentials.value);
        const response = await axiosInstance.post('/login/register', {
          username: username,
          password: password,
          email: email
        });
        //aqui pillar el response de register
        //console.log("Response data de register es  : ",response.data)
        if (response.status == 200) {
          const { access, refresh } = response.data;
          localStorage.setItem('authToken', access);
          localStorage.setItem('refreshToken', refresh);
          const decoded = jwtDecode(access);
          console.log("Decoded token:", decoded);
          return { success: true, data: response.data , error: null };
        } else {
          console.log("Unexpected response:", response.data);
          return { success: false, data: null, error: 'Respuesta inesperada del servidor.' };
        }  
      } catch (error) {
        console.log('Error during register:', error);
      }
    }
  } catch (error) {
    if (error.response) { 
      console.log(`Error ${error.response.status}: ${error.response.statusText}`);
      return { success: false, data: null, error: error.response.data.detail || 'Otp incorrecta.' };
    } else {
      console.log("Error making the request:", error);
      return { success: false, data: null, error: 'Error de red o desconocido.' };
    }
  }
}

async function backendOTPRequest(email)
{
  try {
    const response = await axiosInstance.post('/send-otp', {}, {
      headers: {
        'email': email
      }
    });
    //console.log("Response es :" + response);
    return { success: true, data: response.data, error: null };
  
  } catch (error) {
    if (error.response) {
      console.log(`Error ${error.response.status}: ${error.response.statusText}`);
      return { success: false, data: null, error: error.response.data.detail || 'Error desconocido.' };
    } else {
      console.log("Error making the request:", error);
      return { success: false, data: null, error: 'Error de red o desconocido.' };
    }
  }
}



export { handleIntraRedirect, login, check_register, postGateway, getGateway, backendOTPVerification, backendOTPRequest, checktoken};
