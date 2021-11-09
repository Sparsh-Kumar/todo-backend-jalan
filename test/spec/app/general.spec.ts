// tslint:disable-next-line: no-var-requires
require('module-alias/register');

import { App } from '@server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { respositoryContext, testAppContext } from '../../mocks/app-context';

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

describe('Based on Accept-Language header, system', () => {
  it('should return a message in english when Accept-Language is set to en', () => {
    return chai
      .request(expressApp)
      .get('/healthcheck')
      .set('Accept-Language', 'en')
      .then((res) => {
        expect(res.body.message).to.eql('OK');
      });
  });
});

describe('When the client access a resource that does not exists, system', () => {
  it('should return a 404 status', () => {
    return chai
      .request(expressApp)
      .get('/unknown')
      .then((res) => {
        expect(res).to.have.status(404);
      });
  });
});
