
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
import { Todo } from '@models';

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


describe ('POST /todo',() => {

    it ('should create a new todo with the title provided in the request body', async () => {
        const res = await chai.request (expressApp).post ('/todo').send ({ title: 'test title' });
        expect (res).to.have.status (201);
        expect (res.body).to.have.property ('id');
        expect (res.body).to.have.property ('title');
    })

    it ('should return validation error, if I try to add a task with no title', async () => {
      const res = await chai.request (expressApp).post ('/todo').send ({ title: '' });
      expect (res).to.have.status (400);
    })

})