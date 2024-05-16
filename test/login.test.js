const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const bcrypt = require('bcrypt');
const path = require('path')

const app = require('../app');
const User = require('../models/usersModel');

chai.use(chaiHttp);

describe('Login API', () => {

    let token;

  afterEach(async () => {
    await User.deleteMany({});
  });

  beforeEach(async () => {
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

    token= res.body.token
  });

  it('should return an error for invalid credentials', async () => {
    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: 'wrongpassword',
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property('error', 'invalid username or password');
  });

  describe('Media API', () => {
    it('should upload media successfully', async () => {
      const filePath = path.join('./public', 'sign.jpg');

      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`) 
        .attach('image', filePath);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property(
        'message',
        'Media Uploaded Successfully',
      );
    });


  });
});
