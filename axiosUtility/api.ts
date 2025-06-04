import axios from 'axios';

const instance = axios.create({ 
  // baseURL: 'https://incodocs-server.vercel.app', 
  // baseURL: 'http://localhost:4080',
  baseURL: 'https://incodocs-server.onrender.com',
});


export const fetchData = async (endpoint:any, config = {}) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/, '$1') as string;
  try {
    const response = await instance.request({
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
    });
    

    return response.data;
  } catch (error) {
    console.error('Axios request error:', error);
    throw error;
  }
};

export const postData = async (endpoint: any, data: any, config = {}) => {
const token = document.cookie.replace(/(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/, '$1') as string;
console.log("Token:", token); // Log the token for debugging  
  try {
    const response = await instance.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error('Axios POST request error:', error);
    throw error;
  }
};


export const putData = async (endpoint: any, data: any, config = {}) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/, '$1') as string;
  try {
      const response = await instance.put(endpoint, data, {
          headers: {
              Authorization: `Bearer ${token}`,
              
            },
          ...config,
      });

      return response.data;
  } catch (error) {
      console.error('Axios PUT request error:', error);
      throw error;
  }
};

export const deleteData = async (endpoint: string, config = {}) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/, '$1') as string;
  try {
    const response = await instance.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    console.error('Axios delete request error:', error);
    throw error;
  }
};
export const deleteAllData = async (endpoint: string, data: { ids: string[]; token?: string }, config = {}) => {
  const token = data.token || document.cookie?.replace(/(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/, "$1") || "";
  console.log("Token in deleteAllData:", token); // Debug token
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  try {
    const response = await instance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { ids: data.ids }, // Fixed: Use 'ids' instead of 'id'
      ...config,
    });
    console.log("DELETE response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("DELETE error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      endpoint: url,
    });
    throw {
      message: error.response?.data?.message || "Error making delete request",
      originalError: error,
    };
  }
};



export const activateCoupon = async (endpoint: any, data: any, config = {}) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)AccessToken\s*=\s*([^;]*).*$)|^.*$/, '$1') as string;
    try {
      const response = await instance.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        ...config,
      });
  
      return response.data;
    } catch (error) {
      console.error('Axios put request error:', error);
      throw error;
    }
  };
  

export default instance;
