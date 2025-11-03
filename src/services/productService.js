import axios from 'axios';
import authHeader from './auth-header'; // We'll create this next

const API_URL = 'http://localhost:8080/api/';

// Axios instance with interceptors for refreshing tokens or handling errors
// For simplicity, we'll use direct axios calls with authHeader
// A more robust app would have an interceptor to auto-refresh tokens

class ProductService {

  // --- Categories ---
  getAllCategories() {
    return axios.get(API_URL + 'categories', { headers: authHeader() });
  }

  createCategory(categoryName) {
    return axios.post(API_URL + 'categories', categoryName, { headers: authHeader() });
  }

  // --- Products ---
  getAllProducts(searchTerm = '') {
    const params = searchTerm ? { searchTerm } : {};
    return axios.get(API_URL + 'products', { headers: authHeader(), params });
  }

  getProductById(id) {
    return axios.get(API_URL + `products/${id}`, { headers: authHeader() });
  }

  createProduct(productData) {
    return axios.post(API_URL + 'products', productData, { headers: authHeader() });
  }

  updateProduct(id, productData) {
    return axios.put(API_URL + `products/${id}`, productData, { headers: authHeader() });
  }

  deleteProduct(id) {
    return axios.delete(API_URL + `products/${id}`, { headers: authHeader() });
  }

  // --- Dashboard Summary ---
  getTotalProductsCount() {
    return axios.get(API_URL + 'products/summary/total-count', { headers: authHeader() });
  }

  getLowStockItemsCount() {
    return axios.get(API_URL + 'products/summary/low-stock-count', { headers: authHeader() });
  }

  getOutOfStockItemsCount() {
    return axios.get(API_URL + 'products/summary/out-of-stock-count', { headers: authHeader() });
  }

  getTotalInventoryValue() {
    return axios.get(API_URL + 'products/summary/total-value', { headers: authHeader() });
  }

  getLowStockProducts() {
    return axios.get(API_URL + 'products/summary/low-stock-products', { headers: authHeader() });
  }

  getOutOfStockProducts() {
    return axios.get(API_URL + 'products/summary/out-of-stock-products', { headers: authHeader() });
  }
}

export default new ProductService();