const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const bcrypt = require('bcrypt');
const path = require('path');

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
    await Media.deleteMany({});
    console.log('start');
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

  describe('Media API', () => {
    let uploadedMediaId;

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
      console.log(res.body);
      uploadedMediaId = res.body.results[0]._id;
      console.log('uploaded media id from upload', uploadedMediaId);
    });

    it('should get media by ID successfully', async () => {
      console.log('uploadedMediaID here', uploadedMediaId);
      const res = await chai.request(app).get(`/api/media/${uploadedMediaId}`);
      console.log(res.body);
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
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
      expect(res.body).to.have.property(
        'message',
        'Media Updated Successfully',
      );
      expect(res.body.results.caption).to.equal(newCaption);
      expect(res.body.results.alternateText).to.equal(newAlternateText);
    });

    // it('should delete media successfully', async () => {
    //   const res = await chai
    //     .request(app)
    //     .delete(`/api/media/${uploadedMediaId}`)
    //     .set('Authorization', `Bearer ${token}`);

    //   expect(res).to.have.status(200);
    //   expect(res.body).to.have.property('message', 'Media Deleted Succesfully');
    // });

    describe('Blog API', () => {
      it('should upload a blog successfully', async () => {
        const blogData = {
          title: 'Test Blog Title',
          content: 'This is some blog content',
          featuredImage: uploadedMediaId,
          media: [uploadedMediaId],
        };

        const res = await chai
          .request(app)
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(blogData);

        expect(res).to.have.status(201);
        expect(res.body).to.have.property(
          'message',
          'Blog uploaded successfully!',
        );
        expect(res.body.data).to.have.property('title', blogData.title);
        expect(res.body.data).to.have.property('featuredImage');
      });

      it('get all blogs succesfully', async () => {});

      it('should get a blog by slug successfully', async () => {
        const blogData = {
          title: 'Test Blog Title',
          content: 'This is some blog content',
          featuredImage: uploadedMediaId,
          media: [uploadedMediaId],
        };

        const blogCreationRes = await chai
          .request(app)
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(blogData);
        const createdBlog = blogCreationRes.body.data;
        console.log('created Blog', createdBlog);
        const res = await chai
          .request(app)
          .get(`/api/blogs/${createdBlog.slug}`);

        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('title', blogData.title);
        expect(res.body.data).to.have.property('featuredImage');
        expect(res.body.data.media).to.be.an('array');
      });
    });
  });
});
