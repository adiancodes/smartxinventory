export default function authHeader() {
  const token = localStorage.getItem('token');

  if (token) {
    // For Spring Boot backend, the default header is "Authorization: Bearer [token]"
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
}