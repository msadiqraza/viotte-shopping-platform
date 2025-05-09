// Example: fetch from real endpoint or mock
export async function getProducts() {
  return fetch('/api/products').then(r => r.json());
}