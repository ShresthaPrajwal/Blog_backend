const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/usersModel');
const Media = require('../models/mediaModel');
const Blog = require('../models/blogModel');
chai.use(chaiHttp);

describe('Login API', () => {
  let token;
  after(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Media.deleteMany({});
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

    token = res.body.token;
  });

  it('should return an error for invalid credentials', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: 'wrongpassword',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });

  it('should return an error for empty password field', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: '',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });



  it('should return an error for invalid username', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'nonexistentuser',
      password: 'password123',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });
});
