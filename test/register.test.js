const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');

const User = require('../models/usersModel');
chai.use(chaiHttp);

describe('REGISTER API', () => {
  after(async () => {
    await User.deleteMany({});
  });

  before(async function () {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a user successfully', async () => {
      const newUser = {
        username: 'testuser',
        password: '123456',
        name: 'Test User',
      };
      const res = await chai
        .request(app)
        .post('/api/users/register')
        .send(newUser);

      expect(res).status(201);
      expect(res.body).to.have.property('passwordHash');
      expect(res.body).to.have.property('username', 'testuser');
      expect(res.body).to.have.property('name', 'Test User');
    });

    it('should return an error for duplicate username', async () => {
      await chai.request(app).post('/api/register').send({
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
      });

      const res = await chai.request(app).post('/api/users/register').send({
        username: 'testuser',
        name: 'Another User',
        password: 'password123',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Username already taken');
    });
    it('should return an error for username length less than 4', async () => {
      const res = await chai.request(app).post('/api/users/register').send({
        username: 'usr',
        name: 'Short Username',
        password: 'password123',
      });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Username length less than 4');
    });

    it('should return an error for password length less than 4', async () => {
      const res = await chai.request(app).post('/api/users/register').send({
        username: 'validusername',
        name: 'Short Password',
        password: 'pwd',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Password length less than 4');
    });
    it('should return an error for empty username field', async () => {
      const res = await chai.request(app).post('/api/users/register').send({
        username: '',
        name: 'No Username',
        password: 'password123',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Username cannot be empty');
    });

    it('should return an error for empty name field', async () => {
      const res = await chai.request(app).post('/api/users/register').send({
        username: 'nonameuser',
        name: '',
        password: 'password123',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Name cannot be empty');
    });

    it('should return an error for empty password field', async () => {
      const res = await chai.request(app).post('/api/users/register').send({
        username: 'nopassworduser',
        name: 'No Password',
        password: '',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Password cannot be empty');
    });

    it('should return an error for both username and password fields being empty', async () => {
      const res = await chai.request(app).post('/api/users/register').send({
        username: '',
        name: 'No Username and Password',
        password: '',
      });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'Username cannot be empty');
    });
  });

  describe('GET api/users', () => {
    it('should return all users', async () => {
      const newUser2 = {
        username: 'testuser2',
        password: '123456',
        name: 'Test User 2',
      };
      await chai.request(app).post('/api/users/register').send(newUser2);

      const res = await chai.request(app).get('/api/users');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(2);
      expect(res.body[0]).to.have.property('username', 'testuser');
      expect(res.body[0]).to.have.property('name', 'Test User');
      expect(res.body[1]).to.have.property('username', 'testuser2');
      expect(res.body[1]).to.have.property('name', 'Test User 2');
    });
  });

  describe('PUT & DELETE', () => {
    let token;
    before(async () => {
      const res = await chai.request(app).post('/api/login').send({
        username: 'testuser',
        password: '123456',
      });

      token = res.body.token;
    });
    describe('PUT /api/users/:username', () => {
      it('should update user details', async () => {
        const updatedUserData = {
          name: 'Updated Name',
          password: 'newpassword',
        };

        const res = await chai
          .request(app)
          .put('/api/users/testuser')
          .set('Authorization', `Bearer ${token}`)
          .send(updatedUserData);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name', updatedUserData.name);
      });

      it('should return 404 if user does not exist', async () => {
        const res = await chai
          .request(app)
          .put('/api/users/nonexistentuser')
          .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(404);
      });
      it('should return 404 if username is not provided', async () => {
        const res = await chai
          .request(app)
          .put('/api/users/')
          .set('Authorization', `Bearer ${token}`);
        expect(res).to.have.status(404);
      });
      it('should return 401 if token is invalid', async () => {
        const res = await chai
          .request(app)
          .put('/api/users/testuser')
          .set('Authorization', `Bearer invalidtoken`)
          .send({
            name: 'Updated Name',
            password: 'newpassword',
          });

        expect(res).to.have.status(401);
      });

      it('should return 498 when trying to edit a user without token', async () => {
        const res = await chai.request(app).put('/api/users/testuser').send({
          name: 'Updated Name',
          password: 'newpassword',
        });

        expect(res).to.have.status(498);
      });
    });

    describe('DELETE /api/users/:username', () => {
      it('should delete user', async () => {
        const res = await chai
          .request(app)
          .delete('/api/users/testuser')
          .set('Authorization', `Bearer ${token}`);
        expect(res).to.have.status(204);
      });
      it('should return 404 if user does not exist', async () => {
        const res = await chai
          .request(app)
          .delete('/api/users/nonexistentuser')
          .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(404);
      });
      it('should return 400 if username is not provided', async () => {
        const res = await chai
          .request(app)
          .delete('/api/users/')
          .set('Authorization', `Bearer ${token}`);
        expect(res).to.have.status(404);
      });
      it('should return 401 if token is invalid', async () => {
        const res = await chai
          .request(app)
          .delete('/api/users/testuser')
          .set('Authorization', `Bearer invalidtoken`);

        expect(res).to.have.status(401);
      });

      it('should return 498 when trying to delete a user without token', async () => {
        const res = await chai
          .request(app)
          .delete('/api/users/testuser')

          .send({
            name: 'Updated Name',
            password: 'newpassword',
          });

        expect(res).to.have.status(498);
      });
    });
  });
});
