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

describe('BLOG API', () => {
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
  describe('POST /api/blogs', () => {
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
      expect(res.body.data).to.have.property('slug');//update here

      uploadedBlogSlug = res.body.data.slug;
    });

    it('should return an error when title is missing', async () => {
      const blogData = {
        content: 'This is some blog content',
        featuredImage: uploadedMediaId,
        media: [uploadedMediaId],
      };
      const res = await chai
        .request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData);

      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.property('message')
        .that.includes('title is required');
    });

    it('should return an error when content is missing', async () => {
      const blogData = {
        title: 'Test Blog Title',
        featuredImage: uploadedMediaId,
        media: [uploadedMediaId],
      };
      const res = await chai
        .request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData);

      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.property('message')
        .that.includes('content is required');
    });

    it('should create a unique slug for each blog with the same title', async () => {
      const blogData1 = {
        title: 'Duplicate Blog Title',
        content: 'This is some blog content',
        featuredImage: uploadedMediaId,
        media: [uploadedMediaId],
      };
      const blogData2 = {
        title: 'Duplicate Blog Title',
        content: 'This is another blog content',
        featuredImage: uploadedMediaId,
        media: [uploadedMediaId],
      };

      const res1 = await chai
        .request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData1);

      const res2 = await chai
        .request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData2);

      expect(res1).to.have.status(201);
      expect(res1.body).to.have.property(
        'message',
        'Blog uploaded successfully!',
      );
      expect(res2).to.have.status(201);
      expect(res2.body).to.have.property(
        'message',
        'Blog uploaded successfully!',
      );

      const slug1 = res1.body.data.slug;
      const slug2 = res2.body.data.slug;
      expect(slug1).to.be.a('string');
      expect(slug2).to.be.a('string');
      expect(slug1).to.not.equal(slug2);
    });

    it('should return an error when unauthorized', async () => {
      const blogData = {
        title: 'Test Blog Title',
        content: 'This is some blog content',
        featuredImage: uploadedMediaId,
        media: [uploadedMediaId],
      };
      const res = await chai.request(app).post('/api/blogs').send(blogData);

      expect(res).to.have.status(498);
    });

    it('should return 401 if token is invalid', async () => {
      const blogData = {
        title: 'Test Title',
        content: 'This is some blog content',
        featuredImage: uploadedMediaId,
        media: [uploadedMediaId],
      };
      const res = await chai
        .request(app)
        .post(`/api/blogs/`)
        .set('Authorization', `Bearer invalidtoken`)
        .send(blogData);

      expect(res).to.have.status(401);
    });

    it('should return null featuredImage when featuredImage is null', async () => {
      const blogData = {
        title: 'Test Blog Title',
        content: 'This is some blog content',
        featuredImage: '',
        media: [uploadedMediaId],
      };
      const res = await chai
        .request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData);
      expect(res).to.have.status(201);
      expect(res.body.data).to.have.property('featuredImage', null);
    });
  });
  describe('GET /api/blogs', () => {
    before(async () => {
      for (let i = 1; i <= 5; i++) {
        const blogData = {
          title: `Test Title`,
          content: `This is some blog content ${i}`,
          featuredImage: `${uploadedMediaId}`,
          media: [`${uploadedMediaId}`],
        };
        const res = await chai
          .request(app)
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(blogData);
      }
    });
    describe('GET /api/blogs', () => {
      it('get all blogs succesfully', async () => {
        const res = await chai.request(app).get('/api/blogs');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pagination');
        expect(res.body.data).to.be.an('array');
      });

      it('should paginate blogs with default limit', async () => {
        const res = await chai.request(app).get('/api/blogs?page=1');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pagination');
        expect(res.body.pagination).to.have.property('currentPage', 1);
        expect(res.body.pagination).to.have.property('totalPages');
        expect(res.body.pagination).to.have.property('perPage', 2);
        expect(res.body.pagination).to.have.property('totalItems');
        expect(res.body.pagination).to.have.property('nextPageUrl');
        expect(res.body.data).to.be.an('array').that.has.lengthOf.at.most(2);
      });

      it('should paginate blogs with specified limit', async () => {
        const res = await chai.request(app).get('/api/blogs?page=1&size=3');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pagination');
        expect(res.body.pagination).to.have.property('currentPage', 1);
        expect(res.body.pagination).to.have.property('totalPages');
        expect(res.body.pagination).to.have.property('perPage', 3);
        expect(res.body.pagination).to.have.property('totalItems');
        expect(res.body.pagination).to.have.property('nextPageUrl');
        expect(res.body.data).to.be.an('array').that.has.lengthOf.at.most(3);
      });

      it('should return next and previous page URLs', async () => {
        const res = await chai.request(app).get('/api/blogs?page=2&size=2');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pagination');
        expect(res.body.pagination).to.have.property('currentPage', 2);
        expect(res.body.pagination).to.have.property('totalPages');
        expect(res.body.pagination).to.have.property('perPage', 2);
        expect(res.body.pagination).to.have.property('totalItems');
        expect(res.body.pagination).to.have.property('nextPageUrl');
        expect(res.body.pagination).to.have.property('prevPageUrl');
        expect(res.body.data).to.be.an('array').that.has.lengthOf.at.most(2);
      });

      it('should return blogs sorted by title in descending order', async () => {
        const res = await chai
          .request(app)
          .get('/api/blogs?sort=title&order=desc');

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pagination');
        expect(res.body.pagination).to.have.property('currentPage', 1);
        expect(res.body.pagination).to.have.property('totalPages');
        expect(res.body.pagination).to.have.property('perPage');
        expect(res.body.pagination).to.have.property('totalItems');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.be.sortedBy('title', { descending: true });
      });

      it('should filter blogs by search query', async () => {//naauni ni garni
        const res = await chai
          .request(app)
          .get('/api/blogs?search=Test Title 1');
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('pagination');
        expect(res.body.pagination).to.have.property('currentPage', 1);
        expect(res.body.pagination).to.have.property('totalPages');
        expect(res.body.pagination).to.have.property('perPage');
        expect(res.body.pagination).to.have.property('totalItems');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('title', 'Test Title 1');
      });
    });
    describe('GET /api/blogs/:slug', () => {
      it('should get a blog by slug successfully', async () => {
        const res = await chai
          .request(app)
          .get(`/api/blogs/${uploadedBlogSlug}`);

        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('title');
        expect(res.body.data).to.have.property('featuredImage');
        expect(res.body.data.media).to.be.an('array');
      });

      it('should return 404 for non-existent blog slug', async () => {
        const nonExistentSlug = 'non-existent-blog-slug';
        const res = await chai
          .request(app)
          .get(`/api/blogs/${nonExistentSlug}`);
        expect(res).to.have.status(404);
      });
    });
  });

  describe('PUT /api/blogs', () => {
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

    it('should return 404 if blogslug is not given', async () => {
      const res = await chai
        .request(app)
        .put(`/api/blog/`)
        .set('Authorization', `Bearer invalidtoken`);

      expect(res).to.have.status(404);
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

    it('should return 401 if token is invalid', async () => {
      const res = await chai
        .request(app)
        .put(`/api/blogs/${uploadedBlogSlug}`)
        .set('Authorization', `Bearer invalidtoken`);

      expect(res).to.have.status(401);
    });
  });

  describe('DELETE /api/blogs', () => {
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

      const deletedBlog = await Blog.findOne({
        slug: createRes.body.data.slug,
      });
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
    it('should return 401 if token is invalid', async () => {
      const res = await chai
        .request(app)
        .delete(`/api/blogs/${uploadedBlogSlug}`)
        .set('Authorization', `Bearer invalidtoken`);
      expect(res.body).to.have.property('error', 'Invalid token');

      expect(res).to.have.status(401);
    });
  });
});
