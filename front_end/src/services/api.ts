import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor to attach the token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          // If the token doesn't already start with Bearer and looks like a JWT (contains dots), 
          // we could add it, but for now we follow the existing pattern of just passing the token.
          config.headers.Authorization = token; 
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor for global error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error: AxiosError) => {
        console.error('API Request failed:', error);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorData: any = error.response.data;
            console.log("Error details:", errorData);

            // Global handling for "Unauthorized access"
            if (error.response.status === 401 || errorData?.message === "Unauthorized access") {
                console.warn("Unauthorized access detected. Redirecting to login...");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(new Error("Session expired. Please login again."));
            }

            throw new Error(errorData?.message || `Request failed with status ${error.response.status}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('Network error occurred. No response received. Please check your connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`API Error: ${error.message}`);
        }
      }
    );
  }

  // GET request
  async get(endpoint: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get(endpoint, config);
  }

  // POST request
  async post(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post(endpoint, data, config);
  }

  // PUT request
  async put(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put(endpoint, data, config);
  }

  // DELETE request
  async delete(endpoint: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete(endpoint, config);
  }

  // Upload file (FormData)
  async upload(endpoint: string, formData: FormData) {
     return this.axiosInstance.post(endpoint, formData, {
        headers: {
           'Content-Type': 'multipart/form-data',
        }
     });
  }

  // Patch request (FormData)
  async patch(endpoint: string, formData: FormData) {
      return this.axiosInstance.patch(endpoint, formData, {
        headers: {
           'Content-Type': 'multipart/form-data',
        }
      });
  }
}

export const apiService = new ApiService();