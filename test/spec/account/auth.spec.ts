// tslint:disable-next-line: no-var-requires
require('module-alias/register');

import chai from 'chai';
// tslint:disable-next-line: import-name
import spies from 'chai-spies';
chai.use(spies);
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { respositoryContext, testAppContext } from '../../mocks/app-context';

import { AuthHelper } from '@helpers';
import { App } from '@server';
import { Account } from '@models';

chai.use(chaiHttp);
const expect = chai.expect;
let expressApp: Application;

before(async () => {
  await respositoryContext.store.connect();
  const app = new App(testAppContext);
  app.initializeMiddlewares();
  app.initializeControllers();
  app.initializeErrorHandling();
  expressApp = app.expressApp;
});

describe('POST /account', () => {
  it('should create a new account when email address is not already registered', async () => {
    const res = await chai
      .request(expressApp)
      .post('/account')
      .send({
        firstName: 'Jack',
        lastName: 'Ryan',
        email: 'jack.ryan@jalantechnologies.com',
        password: 'password',
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('firstName');
    expect(res.body).to.have.property('lastName');
    expect(res.body).to.have.property('email');
  });

  it('should return a validation error if invalid email is specified', async () => {
    const res = await chai
      .request(expressApp)
      .post('/account')
      .send({
        firstName: 'Jack',
        lastName: 'Ryan',
        email: 'invalid email address',
      });

    expect(res).to.have.status(400);
  });
  it('should return a syntax error if incoming request data is not a proper JSON', async () => {
    const res = await chai
      .request(expressApp)
      .post('/account')
      .send(["random input" ,],);

    expect(res).to.have.status(400);
  });


  it('should return an error for duplicate email', async () => {
    await testAppContext.accountRepository.save(new Account({
      email: 'Jack.Ryan.2@jalantechnologies.com',
      firstName: 'Jack',
      lastName: 'Ryan',
      password: await AuthHelper.encryptPassword('password'),
    }));

    const res = await chai
      .request(expressApp)
      .post('/account')
      .send({
        email: 'Jack.Ryan.2@jalantechnologies.com',
        firstName: 'Jack',
        lastName: 'Ryan',
        password: 'password',
      });
    expect(res).to.have.status(400);
  });
});

describe('POST /account/access_token', () => {
  it('should return access token based on email address', async () => {
    await testAppContext.accountRepository.save(new Account({
      email: 'Jack.Ryan.3@gmail.com',
      firstName: 'Jack',
      lastName: 'Ryan',
      password: await AuthHelper.encryptPassword('password'),
    }));

    const res = await chai
      .request(expressApp)
      .post('/account/access_token')
      .send({ email: 'Jack.Ryan.3@gmail.com', password: 'password' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('token');
  });
});
