const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const bcrypt = require('bcrypt');

const User = require('../models/usersModel');
chai.use(chaiHttp);

describe('REGISTER API', () => {
  after(async () => {
    await User.deleteMany({});
  });

  before(async function () {
    await User.deleteMany({});
  });

  it('should register a user successfully', async () => {
    const res = await User.create({
      username: 'testuser',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'Test User',
    });
    expect(res).to.have.property('passwordHash');
    expect(res).to.have.property('username', 'testuser');
    expect(res).to.have.property('name', 'Test User');
  });

//   it('should return an error for duplicate username', async () => {
//     console.log('from dup username');
//     let res;
//     try {
//       res = await User.create({
//         username: 'testuser',
//         passwordHash: await bcrypt.hash('password123', 10),
//         name: 'Test User',
//       });
//     } catch (error) {
//       res.status(500).send({ success: false });
//     }
//     console.log('from dup username', res);

//     expect(res).to.have.status(500);
//     expect(res.body).to.have.property('success', 'false');
//   });
});
