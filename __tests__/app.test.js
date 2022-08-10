const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/userService');
// const { response } = require('../lib/app');

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

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async () => {
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
    await request(app).post('/api/v1/users').send(testUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
  });
  it('delete /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.status).toBe(204);
  });
  it.only('/secrets should return a list of secrets if user authenticated', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.get('/api/v1/secrets');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(3);

    // expect(res.body[0]).toEqual({
    //   id: expect.any(String),
    //   title: expect.any(String),
    //   description: expect.any(String),
    //   created_at: expect.any(String),
    // });
  });
  afterAll(() => {
    pool.end();
  });
});
