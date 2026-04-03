// Admin API Service Layer
// Connects the frontend admin panel to the PHP backend API

const API_BASE_URL = 'http://localhost/soucul';

class AdminAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin_token') || null;
  }

  // Helper method to make authenticated requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const result = await this.request('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true
    });

    if (result.success && result.data.token) {
      this.token = result.data.token;
      localStorage.setItem('admin_token', result.data.token);
      localStorage.setItem('admin_user', JSON.stringify(result.data.admin));
    }

    return result;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  async getProfile() {
    return await this.request('/api/v1/admin/profile');
  }

  // Dashboard
  async getDashboardStats() {
    return await this.request('/api/v1/admin/dashboard/stats');
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/admin/products${queryString ? '?' + queryString : ''}`;
    return await this.request(endpoint);
  }

  async createProduct(productData) {
    return await this.request('/api/v1/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(productId, productData) {
    return await this.request(`/api/v1/admin/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
  }

  async updateProductInventory(productId, quantity) {
    return await this.request(`/api/v1/admin/products/${productId}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity_in_stock: quantity })
    });
  }

  // Orders
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/admin/orders${queryString ? '?' + queryString : ''}`;
    return await this.request(endpoint);
  }

  async getOrderDetails(orderId) {
    return await this.request(`/api/v1/admin/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status) {
    return await this.request(`/api/v1/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Users
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/v1/admin/users${queryString ? '?' + queryString : ''}`;
    return await this.request(endpoint);
  }

  async getUserDetails(userId) {
    return await this.request(`/api/v1/admin/users/${userId}`);
  }

  async toggleUserStatus(userId) {
    return await this.request(`/api/v1/admin/users/${userId}/toggle`, {
      method: 'PATCH'
    });
  }

  // Admins
  async getAdmins() {
    return await this.request('/api/v1/admin/admins');
  }

  async createAdmin(adminData) {
    return await this.request('/api/v1/admin/admins', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  async toggleAdminStatus(adminId) {
    return await this.request(`/api/v1/admin/admins/${adminId}/toggle`, {
      method: 'PATCH'
    });
  }

  // Health check
  async healthCheck() {
    return await this.request('/health', { skipAuth: true });
  }
}

// Create and export a singleton instance
const adminAPI = new AdminAPI();
