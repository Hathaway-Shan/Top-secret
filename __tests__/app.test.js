const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/userService');

//Dummy user for testing
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;

  //create 'agent' to give us the ability to store cookies between requests in test
  const agent = request.agent(app);

  //create user to sign in with
  const user = await UserService.create({ ...testUser, ...userProps });

  //finally sign in
  const { email } = user;
  await agent.post('/api/v1/users/session').send({ email, password });
  return [agent, user];
};
console.log('this stops error', registerAndLogin);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it.skip('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(testUser);
    const { firstName, lastName, email } = testUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
  it('logs in a user', async () => {
    const [agent, user] = await registerAndLogin();
    const me = await agent.get('/api/v1/users/sessions');

    expect(me.body).toEqual({
      ...user,
      id: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
