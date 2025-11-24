// Base API service for all backend communication
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Call: ${options.method || 'GET'} ${url}`); // Debug
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred. Please check your connection.');
    }
  }

  // GET request
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload(endpoint: string, formData: FormData) {
    const token = localStorage.getItem('authToken');
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return await response.json();
  }

  async patch(endpoint:string, formData:FormData) {
    const token = localStorage.getItem('authToken');
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...(token && { 'Authorization': `${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Update change status failed with status ${response.status}`);
    }

    return await response.json();
  }
}

export const apiService = new ApiService();