const chai = require('chai');
const app = require('../app');
const Blog = require('../models/blogModel');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Controller', () => {

  describe('GET /api/blogs', () => {
    it('should retrieve all blog posts', async () => {
      await Blog.create([
        {
          title: 'Test Blog 1',
          content: 'This is a test blog post 1',
          slug: 'test1',
        },
        {
          title: 'Test Blog 2',
          content: 'This is a test blog post 2',
          slug: 'test2',
          featuredImage: '663cb87e5ed475f22f6599b4',
          media: ['663cb87e5ed475f22f6599b4', '663dd5660ae12e2e6c17fab9'],
        },
      ]);

      const res = await chai.request(app).get('/api/blogs');
      console.log(res.body)
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success').to.be.true;
      expect(res.body).to.have.property('data').to.be.an('array');
      expect(res.body.data).to.have.lengthOf.at.least(2);
    });
  });
});
