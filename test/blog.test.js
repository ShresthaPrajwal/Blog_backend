const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const Media = require('../models/mediaModel');
const User = require('../models/usersModel');
const Blog = require('../models/blogModel');
chai.use(chaiHttp);
const bcrypt = require('bcrypt');
const path = require('path');

describe('Blog API', () => {
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
    const filePath = path.join('./public', 'sign.jpg');
    token = res.body.token;

    const res2 = await chai
      .request(app)
      .post('/api/media')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', filePath);
    console.log(res2.body);
    uploadedMediaId = res2.body.results[0]._id;
  });
  after(async function () {
    User.deleteMany({});
    Media.deleteMany({});
    Blog.deleteMany({});
  });

  it('should upload a blog successfully', async () => {
    const blogData = {
      title: 'Test Blog Title',
      content: 'This is some blog content',
      featuredImage: uploadedMediaId,
      media: [uploadedMediaId],
    };
    console.log('from blg test', uploadedMediaId, blogData);
    const res = await chai
      .request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogData);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message', 'Blog uploaded successfully!');
    expect(res.body.data).to.have.property('title', blogData.title);
    expect(res.body.data).to.have.property('featuredImage');
    console.log('from blog test post', res.body);
  });

  it('get all blogs succesfully', async () => {
    const res = await chai.request(app).get('/api/blogs');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('pagination');
    expect(res.body.data).to.be.an('array');
  });

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
    const res = await chai.request(app).get(`/api/blogs/${createdBlog.slug}`);

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property('title', blogData.title);
    expect(res.body.data).to.have.property('featuredImage');
    expect(res.body.data.media).to.be.an('array');
  });
});
