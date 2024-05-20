const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const Media = require('../models/mediaModel');
const User = require('../models/usersModel');
chai.use(chaiHttp);
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

describe('MEDIA API', () => {
  let token;
  let uploadedMediaId;
  before(async function () {
    await User.deleteMany({});
    await User.create({
      username: 'testuser',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'Test User',
    });

    const res = await chai.request(app).post('/api/login').send({
      username: 'testuser',
      password: 'password123',
    });

    token = res.body.token;
  });

  after(async function () {
    User.deleteMany({});
    Media.deleteMany({});
  });

  describe('POST /api/media', () => {
    it('should upload media with jpg extension successfully', async () => {
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
      uploadedMediaId = res.body.results[0]._id;
    });

    it('should upload file in local memory', async () => {
      const filePath = path.join('./public', 'sign.jpg');

      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filePath);

      expect(res).to.have.status(201);
      expect(res.body.results[0].paths[0].path).to.exist;
    });

    it('should upload media with unique file name', async () => {
      const filePath = path.join('./public', 'sign.jpg');

      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filePath);

      const res2 = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filePath);

      expect(res).to.have.status(201);
      expect(res.body.results[0].filename).to.not.equal(
        res2.body.results[0].filename,
      );
    });

    it('should upload an image and return different size paths', async () => {
      const filePath = path.join('./public', 'sign.jpg');

      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filePath);

      expect(res).to.have.status(201);
      expect(res.body.results[0]).to.have.property('paths').that.is.an('array');

      const paths = res.body.results[0].paths;

      const expectedSizes = ['large', 'medium', 'small', 'extrasmall'];
      paths.forEach((pathObj) => {
        expect(pathObj).to.have.property('size').that.is.oneOf(expectedSizes);
      });
    });

    it('should upload media with png extension successfully', async () => {
      const filePath = path.join('./public', 'sign.png');

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
    it('should upload media with jpeg extension successfully', async () => {
      const filePath = path.join('./public', 'sign.jpeg');

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

    it('should upload multiple media successfully', async () => {
      const filepath = path.join('./public', 'sign.jpeg');
      const filepath2 = path.join('./public', 'sign.jpg');
      const filepath3 = path.join('./public', 'sign.png');
      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filepath)
        .attach('image', filepath2)
        .attach('image', filepath3)
        .attach('image', filepath2)
        .attach('image', filepath);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property(
        'message',
        'Media Uploaded Successfully',
      );
      //array size check
    });
    it('should not upload more than threshold number of media', async () => {
      const filepath = path.join('./public', 'sign.jpeg');
      const filepath2 = path.join('./public', 'sign.jpg');
      const filepath3 = path.join('./public', 'sign.png');
      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filepath)
        .attach('image', filepath2)
        .attach('image', filepath3)
        .attach('image', filepath2)
        .attach('image', filepath2)
        .attach('image', filepath);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Too many Files');
    });
    it('should not upload media having size more than 1MB ', async () => {
      const filePath = path.join('./public', 'above1mb.jpg');

      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filePath);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'File size limit exceeded');
    });

    it('should receive error for non-image files', async () => {
      const filePath = path.join('./public', 'sample.txt');

      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', filePath);
      console.log(res.body);
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error', 'Only images allowed!');
    });

    it('should return 400 if no files are uploaded', async () => {
      const res = await chai
        .request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'No files uploaded');
    });
  });

  describe('GET', () => {
    describe('GET /api/media', () => {
      it('should get all media successfully', async () => {
        const res = await chai.request(app).get('/api/media');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'All Media Found');
        expect(res.body.results).to.be.an('array');
      });
    });
    describe('GET /api/media/:id', () => {
      it('should get media by ID successfully', async () => {
        const res = await chai
          .request(app)
          .get(`/api/media/${uploadedMediaId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
      });
      it('should return 400 for invalid media ID', async () => {
        const invalidMediaId = 'invalid-media-id';

        const res = await chai.request(app).get(`/api/media/${invalidMediaId}`);

        expect(res).to.have.status(400);
      });
      it('should return 400 for non-existent media ID', async () => {
        const nonExistentMediaId = 'nonexistentmediaid123456';

        const res = await chai
          .request(app)
          .delete(`/api/media/${nonExistentMediaId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(400);
      });
    });
  });

  describe('PUT /api/media/:id', () => {
    it('should edit media successfully', async () => {
      const newCaption = 'This is an edited caption';
      const newAlternateText = 'Edited alternate text';

      const res = await chai
        .request(app)
        .put(`/api/media/${uploadedMediaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ caption: newCaption, alternateText: newAlternateText });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property(
        'message',
        'Media Updated Successfully',
      );
      expect(res.body.results.caption).to.equal(newCaption);
      expect(res.body.results.alternateText).to.equal(newAlternateText);
    });
    it('should return 498 when attempting to edit media without authentication', async () => {
      const newCaption = 'This is an edited caption';
      const newAlternateText = 'Edited alternate text';

      const res = await chai
        .request(app)
        .put(`/api/media/${uploadedMediaId}`)
        .send({ caption: newCaption, alternateText: newAlternateText });

      expect(res).to.have.status(498);
      expect(res.body).to.have.property('error', 'Invalid Token');
    });
    it('should return 401 if token is invalid', async () => {
      const res = await chai
        .request(app)
        .put(`/api/media/${uploadedMediaId}`)
        .set('Authorization', `Bearer invalidtoken`);

      expect(res).to.have.status(401);
    });
  });

  describe('DELETE /api/media/:id', () => {
    it('should delete media successfully', async () => {
      const resp = await chai.request(app).get(`/api/media/${uploadedMediaId}`);
      const res = await chai
        .request(app)
        .delete(`/api/media/${uploadedMediaId}`)
        .set('Authorization', `Bearer ${token}`);
      console.log(resp.body);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Media Deleted Succesfully');
      fs.access(resp.body.results.paths[0].path, fs.constants.F_OK, (err) => {
        if (err) {
          expect(err).to.exist;
        } else {
          throw new Error('File unexpectedly exists');
        }
      });
    });

    it('should return 498 when trying to delete a media without authentication', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/media/${uploadedMediaId}`);

      expect(res).to.have.status(498);
    });
    it('should return 401 if token is invalid', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/media/${uploadedMediaId}`)
        .set('Authorization', `Bearer invalidtoken`);

      expect(res).to.have.status(401);
    });
  });
});
