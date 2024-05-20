const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/usersModel');

chai.use(chaiHttp);

describe('LOGIN API', () => {
  after(async () => {
    await User.deleteMany({});
  });

  before(async function () {
    await User.deleteMany({});
    await User.create({
      username: 'testuser',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'Test User',
    });
  });

  it('should return a JWT token upon successful login', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('username', 'testuser');
    expect(res.body).to.have.property('name', 'Test User');
  });

  it('should return an error for invalid credentials', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: 'wrongpassword',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });

  it('should return an error for empty username field', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: '',
      password: 'randompassword',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'Empty Username');
  });

  it('should return an error for empty password field', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: '',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'Empty Password');
  });

  it('should return an error for both username and password fields being empty', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: '',
      password: '',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'Empty Username and Password');
  });

  it('should return an error for invalid username', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'nonexistentuser',
      password: 'password123',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });

  it('should return an error for case-sensitive username mismatch', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'TestUser',
      password: 'password123',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });
});
