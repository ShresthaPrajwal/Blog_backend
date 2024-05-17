const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const Media = require('../models/mediaModel');
const User = require('../models/usersModel');
chai.use(chaiHttp);
const bcrypt = require('bcrypt');
const path = require('path');

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

  it('should upload media successfully', async () => {
    const filePath = path.join('./public', 'sign.jpg');

    const res = await chai
      .request(app)
      .post('/api/media')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', filePath);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message', 'Media Uploaded Successfully');
    uploadedMediaId = res.body.results[0]._id;
  });

  it('should get media by ID successfully', async () => {
    const res = await chai.request(app).get(`/api/media/${uploadedMediaId}`);
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
  it('should get all media successfully', async () => {
    const res = await chai.request(app).get('/api/media');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'All Media Found');
    expect(res.body.results).to.be.an('array');
  });

  it('should edit media successfully', async () => {
    const newCaption = 'This is an edited caption';
    const newAlternateText = 'Edited alternate text';

    const res = await chai
      .request(app)
      .put(`/api/media/${uploadedMediaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ caption: newCaption, alternateText: newAlternateText });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Media Updated Successfully');
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
  it('should delete media successfully', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/media/${uploadedMediaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Media Deleted Succesfully');
  });
});
