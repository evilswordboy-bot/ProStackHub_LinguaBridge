import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('LinguaBridge Backend API Suite', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('GET /api/health returns healthy service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('LinguaBridge AI Backend');
    expect(res.body.gemini).toBeDefined();
  });

  it('GET /api/languages returns supported language catalog', async () => {
    const res = await request(app).get('/api/languages');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.languages)).toBe(true);
    expect(res.body.data.count).toBeGreaterThanOrEqual(20);

    // Verify key languages are present
    const codes = res.body.data.languages.map((l: any) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('ta'); // Tamil
    expect(codes).toContain('hi'); // Hindi
    expect(codes).toContain('fr'); // French
    expect(codes).toContain('es'); // Spanish
    expect(codes).toContain('ja'); // Japanese
  });

  it('POST /api/translate rejects empty text with friendly validation error', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ text: '', sourceLang: 'en', targetLang: 'ta' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/Please enter (some )?text to translate/i);
  });

  it('POST /api/translate rejects missing language target', async () => {
    const res = await request(app)
      .post('/api/translate')
      .send({ text: 'Hello world', sourceLang: 'en' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/translate rejects overly large payload > 10,000 characters', async () => {
    const hugeText = 'a'.repeat(10001);
    const res = await request(app)
      .post('/api/translate')
      .send({ text: hugeText, sourceLang: 'en', targetLang: 'ta' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('exceeds maximum limit');
  });
});
