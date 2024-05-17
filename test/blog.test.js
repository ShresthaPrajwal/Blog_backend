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
  let uploadedBlogSlug;
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
    const res = await chai
      .request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogData);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message', 'Blog uploaded successfully!');
    expect(res.body.data).to.have.property('title', blogData.title);
    expect(res.body.data).to.have.property('featuredImage');

    uploadedBlogSlug = res.body.data.slug;
  });

  it('get all blogs succesfully', async () => {
    const res = await chai.request(app).get('/api/blogs');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('pagination');
    expect(res.body.data).to.be.an('array');
  });

  it('should get a blog by slug successfully', async () => {
    const res = await chai.request(app).get(`/api/blogs/${uploadedBlogSlug}`);

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property('title');
    expect(res.body.data).to.have.property('featuredImage');
    expect(res.body.data.media).to.be.an('array');
    uploadedBlogSlug = res.body.data.slug;
  });

  it('should update a blog successfully', async () => {
    const updatedTitle = 'Updated Test Blog Title';
    const updatedContent = 'Updated blog content';
    const updatedRes = await chai
      .request(app)
      .put(`/api/blogs/${uploadedBlogSlug}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: updatedTitle, content: updatedContent });

    expect(updatedRes).to.have.status(200);
    expect(updatedRes.body).to.have.property('success', true);
    expect(updatedRes.body).to.have.property(
      'message',
      'Blog updated successfully',
    );
    expect(updatedRes.body.data).to.have.property('title', updatedTitle);
    expect(updatedRes.body.data).to.have.property('content', updatedContent);
  });

  it('should return 498 when trying to update a blog without authentication', async () => {
    const updatedTitle = 'Updated Test Blog Title';
    const updatedContent = 'Updated blog content';
    const res = await chai
      .request(app)
      .put(`/api/blogs/${uploadedBlogSlug}`)
      .send({ title: updatedTitle, content: updatedContent });

    expect(res).to.have.status(498);
  });

  it('should delete a blog successfully', async () => {
    const blogData = {
      title: 'Test Blog Title',
      content: 'This is some blog content',
      featuredImage: uploadedMediaId,
      media: [uploadedMediaId],
    };

    const createRes = await chai
      .request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogData);
    const deleteRes = await chai
      .request(app)
      .delete(`/api/blogs/${createRes.body.data.slug}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes).to.have.status(200);
    expect(deleteRes.body).to.have.property('success', true);
    expect(deleteRes.body).to.have.property(
      'message',
      'Blog deleted successfully',
    );
    expect(deleteRes.body.data).to.have.property('title', blogData.title);

    const deletedBlog = await Blog.findOne({ slug: createRes.body.data.slug });
    expect(deletedBlog).to.be.null;
  });

  it('should return 498 when trying to delete a blog without authentication', async () => {
    const res = await chai
      .request(app)
      .delete(`/api/blogs/${uploadedBlogSlug}`);

    expect(res).to.have.status(498);
  });

  it('should return 404 when trying to delete a non-existent blog', async () => {
    const res = await chai
      .request(app)
      .delete('/api/blogs/non-existent-slug')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(404);
  });
});
