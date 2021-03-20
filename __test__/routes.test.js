const app = require('./testServer.js');
const supertest = require('supertest');
const request = supertest(app);

it ('GET questions route should receive status 200', async done => {
  const response = await request.get("/qa/questions?product_id=67423");
  expect(response.status).toBe(200);
  expect(response.body).toBeTruthy();
  done();
});

it ('GET answers route should receive status 200', async done => {
  const response = await request.get("/qa/answers?question_id=500");
  expect(response.status).toBe(200);
  done();
});
