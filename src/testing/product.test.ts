import { fetch } from 'undici';
import { app } from '../app';
import { serve } from '@hono/node-server'; 

let server: any;

beforeAll(async () => {
  server = await serve({
    fetch: app.fetch,
    port: 3002, // Ganti port jadi 3002
  });
  console.log('Server is running on port 3002');
});

afterAll(() => {
  server.close(); 
});

describe('GET /product', () => {
  it('should return list of products', () => {
    return fetch('http://localhost:3002/product') // Ganti port ke 3002
      .then(res => {
        expect(res.status).toBe(200);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          expect(true).toBe(true); // valid
        } else {
          throw new Error('Response data is not in the expected format');
        }
      })
      .catch(error => {
        if (error instanceof Error) {
          console.error("Error parsing JSON:", error.message);
          throw new Error(`Test failed: ${error.message}`);
        } else {
          console.error("Unknown error:", error);
          throw new Error("An unknown error occurred");
        }
      });
  });
});

describe('PATCH /product', () => {
  it('should return validation error if input is invalid', () => {
    const invalidProductData = {
      namaProduk: "",
      reviewProduk: "Review produk yang terlalu panjang".repeat(10),
      warnaProduk: "",
      fotoProduk: "invalid-url",
      deskripsiProduk: "",
      harga: -10,
      fkcategory: 0,
    };

    return fetch('http://localhost:3002/product/1', { // Ganti port ke 3002
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidProductData),
    })
    .then(res => res.text().then(text => ({ status: res.status, raw: text })))
    .then(({ status, raw }) => {
      console.log("Raw Response:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        throw new Error("Invalid JSON response");
      }

      expect(status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
      expect(Array.isArray(data.error.issues)).toBe(true);
      expect(data.error.issues.length).toBeGreaterThan(0);
    });
  });

  it('should return 404 if product does not exist', () => {
    const validProductData = {
      namaProduk: "Produk Baru",
      reviewProduk: "Review produk bagus",
      warnaProduk: "Merah",
      fotoProduk: "http://example.com/foto.jpg",
      deskripsiProduk: "Deskripsi produk",
      harga: 100,
      fkcategory: 1,
    };

    return fetch('http://localhost:3002/product/999', { // Ganti port ke 3002
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validProductData),
    })
    .then(rs => rs.text().then(text => ({ status: rs.status, raw: text })))
    .then(({ status, raw }) => {
      console.log("Raw Response:", raw);
      let dt;
      try {
        dt = JSON.parse(raw);
      } catch (error) {
        console.error("parsing json err:", error);
        throw new Error("respons json salah");
      }
      expect(status).toBe(404);
      expect(dt.message).toBe('Produk tidak ada');
    });
  });

  it('should successfully update product if valid input is provided', () => {
    const validProductData = {
      namaProduk: "Produk Baru Update",
      reviewProduk: "Review produk update",
      warnaProduk: "Biru",
      fotoProduk: "http://example.com/foto.jpg",
      deskripsiProduk: "Deskripsi produk update",
      harga: 150,
      fkcategory: 2,
    };

    return fetch('http://localhost:3002/product/1', { // Ganti port ke 3002
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validProductData),
    })
    .then(r => r.text().then(text => ({ status: r.status, raw: text })))
    .then(({ status, raw }) => {
      console.log("Raw Response:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        throw new Error("Invalid JSON response");
      }

      expect(status).toBe(200);
      expect(data.message).toBe('Success update');
      expect(data.data).toBeDefined();
      expect(data.data.namaProduk).toBe(validProductData.namaProduk);
    });
  });
});
