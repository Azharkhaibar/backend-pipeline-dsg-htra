import request from 'supertest';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';
import { app } from '../app';

let server: any;
let token: string;

// Set environment variable for JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;

function toRequest(req: IncomingMessage): Promise<Request> {
  const { method, headers, url } = req;

  return new Promise((resolve, reject) => {
    const chunks: any[] = [];

    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = chunks.length ? Buffer.concat(chunks) : null;
      const request = new Request(`http://localhost:3001${url}`, {
        method,
        headers: headers as any,
        body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
      });
      resolve(request);
    });
    req.on('error', reject);
  });
}

beforeAll((done) => {
  server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const rqs = await toRequest(req);
      const rsp = await app.fetch(rqs);
      res.statusCode = rsp.status;
      rsp.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (rsp.body) {
        const reader = rsp.body.getReader();
        const stream = new Readable({
          read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                this.push(null);
              } else {
                this.push(value);
              }
            });
          },
        });

        stream.pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      console.error("Server error:", error);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(3001, done);
});

afterAll(() => {
  server.close();
});

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const response = await request(server)
      .post('/users/register')
      .send({
        namaDepan: 'John',
        namaBelakang: 'Doe',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201); // Expecting 201 for successful user registration
    expect(response.body.message).toBe('User berhasil ditambahkan');
  });

  it('should login and return a token', async () => {
    const response = await request(server)
      .post('/users/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200); // Expecting 200 for successful login
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  it('should not allow login with incorrect credentials', async () => {
    const response = await request(server)
      .post('/users/login')
      .send({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401); // Expecting 401 for failed login
    expect(response.body.message).toBe('ga ada');  // Expected failure message
  });

  it('should access a protected route with a valid token', async () => {
    const response = await request(server)
      .get('/users/protected-route')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200); // Expecting 200 for protected route access
    expect(response.body.message).toBe('This is a protected route');
  });

  it('should not access a protected route without a token', async () => {
    const response = await request(server).get('/users/protected-route');

    expect(response.status).toBe(401); // Expecting 401 for missing token
    expect(response.body.error).toBe('Token is required');
  });

  it('should not access a protected route with an invalid token', async () => {
    const response = await request(server)
      .get('/users/protected-route')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401); // Expecting 401 for invalid token
    expect(response.body.error).toBe('Invalid or expired token');
  });
});
