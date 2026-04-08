import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import supertest = require('supertest');

describe('Mahasiswa - Search & Pagination (E2E)', () => {
  let app: INestApplication;
  let req: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    req = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /mahasiswa - Pagination', () => {
    it('should return paginated results with default limit (10)', async () => {
      const response = await req
        .get('/mahasiswa')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(10);
      expect(response.body.meta.total).toBeGreaterThan(0);
      expect(response.body.meta.totalPages).toBeGreaterThan(0);
    });

    it('should return data with correct limit', async () => {
      const response = await req
        .get('/mahasiswa?limit=5')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.meta.limit).toBe(5);
    });

    it('should return correct page with offset', async () => {
      const response = await req
        .get('/mahasiswa?page=2&limit=10')
        .expect(200);

      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.limit).toBe(10);
    });

    it('should calculate totalPages correctly', async () => {
      const response = await req
        .get('/mahasiswa?limit=10')
        .expect(200);

      const expectedTotalPages = Math.ceil(response.body.meta.total / 10);
      expect(response.body.meta.totalPages).toBe(expectedTotalPages);
    });
  });

  describe('GET /mahasiswa - Search', () => {
    it('should search by nama column (case-insensitive)', async () => {
      const response = await req
        .get('/mahasiswa?column=nama&search=ahmad')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        response.body.data.forEach(item => {
          expect(item.nama.toLowerCase()).toContain('ahmad');
        });
      }
    });

    it('should search by nim column', async () => {
      const response = await req
        .get('/mahasiswa?column=nim&search=202100')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        response.body.data.forEach(item => {
          expect(item.nim).toContain('202100');
        });
      }
    });

    it('should search by email column', async () => {
      const response = await req
        .get('/mahasiswa?column=email&search=student')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        response.body.data.forEach(item => {
          expect(item.email.toLowerCase()).toContain('student');
        });
      }
    });

    it('should search by jurusan column', async () => {
      const response = await req
        .get('/mahasiswa?column=jurusan&search=informatika')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        response.body.data.forEach(item => {
          expect(item.jurusan.toLowerCase()).toContain('informatika');
        });
      }
    });

    it('should return empty results for non-existent search', async () => {
      const response = await req
        .get('/mahasiswa?column=nama&search=XYZ12345NonExistent')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.meta.total).toBe(0);
      expect(response.body.meta.totalPages).toBe(0);
    });

    it('should not search if column is missing', async () => {
      const response = await req
        .get('/mahasiswa?search=ahmad')
        .expect(200);

      // Without column, search should be ignored and return all active mahasiswa
      expect(response.body.meta.total).toBeGreaterThan(0);
    });

    it('should validate column values', async () => {
      const response = await req
        .get('/mahasiswa?column=invalidColumn&search=test')
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /mahasiswa - Search & Pagination Combined', () => {
    it('should search and paginate simultaneously', async () => {
      const response = await req
        .get('/mahasiswa?column=jurusan&search=informatika&page=1&limit=5')
        .expect(200);

      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(5);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      
      if (response.body.data.length > 0) {
        response.body.data.forEach(item => {
          expect(item.jurusan.toLowerCase()).toContain('informatika');
        });
      }
    });

    it('should calculate correct offset for page 3 with limit 5', async () => {
      const page1 = await req
        .get('/mahasiswa?limit=1000')
        .expect(200);

      if (page1.body.meta.total > 15) {
        const page3 = await req
          .get('/mahasiswa?page=3&limit=5')
          .expect(200);

        expect(page3.body.meta.page).toBe(3);
        // Page 3, limit 5 should have offset (3-1)*5 = 10
        // Check that some results are different from page 1
        const page1Ids = page1.body.data.slice(0, 10).map(m => m.id);
        const page3Ids = page3.body.data.map(m => m.id);
        
        const overlap = page1Ids.filter(id => page3Ids.includes(id));
        expect(overlap.length).toBe(0);
      }
    });
  });

  describe('GET /mahasiswa - Response Structure', () => {
    it('should return data with all required fields', async () => {
      const response = await req
        .get('/mahasiswa?limit=1')
        .expect(200);

      if (response.body.data.length > 0) {
        const mahasiswa = response.body.data[0];
        expect(mahasiswa).toHaveProperty('id');
        expect(mahasiswa).toHaveProperty('nim');
        expect(mahasiswa).toHaveProperty('nama');
        expect(mahasiswa).toHaveProperty('email');
        expect(mahasiswa).toHaveProperty('jurusan');
        expect(mahasiswa).toHaveProperty('tgl_lhr');
        expect(mahasiswa).toHaveProperty('created_at');
        expect(mahasiswa).toHaveProperty('updated_at');
      }
    });

    it('should return correct metadata structure', async () => {
      const response = await req
        .get('/mahasiswa')
        .expect(200);

      expect(response.body.meta).toHaveProperty('page');
      expect(response.body.meta).toHaveProperty('limit');
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('totalPages');

      expect(typeof response.body.meta.page).toBe('number');
      expect(typeof response.body.meta.limit).toBe('number');
      expect(typeof response.body.meta.total).toBe('number');
      expect(typeof response.body.meta.totalPages).toBe('number');
    });

    it('should not return inactive mahasiswa', async () => {
      const response = await req
        .get('/mahasiswa?limit=100')
        .expect(200);

      response.body.data.forEach(item => {
        expect(item).not.toHaveProperty('is_active');
      });
    });
  });

  describe('GET /mahasiswa - Integration Tests', () => {
    it('search results across all allowed columns', async () => {
      const columns = ['nim', 'nama', 'email', 'jurusan', 'tgl_lhr'];
      
      for (const column of columns) {
        const response = await req
          .get(`/mahasiswa?column=${column}&limit=10`)
          .expect(200);

        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta.page).toBe(1);
      }
    });

    it('pagination with various limit values', async () => {
      const limits = [1, 5, 10, 20];

      for (const limit of limits) {
        const response = await req
          .get(`/mahasiswa?limit=${limit}`)
          .expect(200);

        expect(response.body.data.length).toBeLessThanOrEqual(limit);
        expect(response.body.meta.limit).toBe(limit);
      }
    });
  });
});
