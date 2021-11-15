
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
  
  let title = 'test title';
  let todo;

  it ('should create a new todo with the title provided in the request body', async () => {

    // Precondition
    // No task should exist having title value 'test title'
    todo = await testAppContext.todoRepository.findOne ({ title });
    expect (JSON.stringify (todo)).to.equal ('{}');

    // Perform Testing
    // Trying to create task with title value 'test title'
    const res = await chai.request (expressApp).post ('/todo').send ({ title });
    expect (res).to.have.status (201);
    expect (res.body).to.have.property ('id');
    expect (res.body).to.have.property ('title');

    // Postcondition
    // There should be a task created in DB with the title 'test title'
    todo = await testAppContext.todoRepository.findOne ({ title });
    expect (todo).to.have.property ('_id');
    expect (todo).to.have.property ('title');

  })

  it ('should return validation error if no title is provided in the request body', async () => {

    // Precondition
    // Tasks with empty title should not exist
    todo = await testAppContext.todoRepository.findOne ({ title: '' });
    expect (JSON.stringify (todo)).to.equal ('{}');

    // Perform Testing
    // Trying to create a task having empty title
    const res = await chai.request (expressApp).post ('/todo').send ({ title: '' });
    expect (res).to.have.status (400);

    // Postcondition
    // There should not be any tasks with empty title
    todo = await testAppContext.todoRepository.findOne ({ title: '' });
    expect (JSON.stringify (todo)).to.equal ('{}');
  })

  it ('should return validation error if task with same title already exists', async () => {

    // Precondition
    // There should be a task present in DB having title 'test title'
    todo = await testAppContext.todoRepository.findOne ({ title })
    expect (todo).to.have.property ('_id');
    expect (todo).to.have.property ('title');

    // Perform Testing
    // Trying to create another task having title 'test title'
    const res = await chai.request (expressApp).post ('/todo').send ({ title });
    expect (res).to.have.status (400);

    // Postcondition
    // There should be only 1 task in Database having title 'test title'
    todo = await testAppContext.todoRepository.getAll ({ title });
    expect (todo).to.have.lengthOf (1);

  })

})

describe ('DELETE /todo/:id', () => {
  let title = 'deletion api test';
  let todo;
  it ('should delete the task, if task present in the database', async () => {
    
    // Precondition Test
    // There should already be a task present in the database
    todo = await testAppContext.todoRepository.save (new Todo ({ title }));

    // Perform Testing
    // Trying to delete the task using task Id
    const res = await chai.request (expressApp).delete (`/todo/${todo._id}`);
    expect (res).to.have.status (204);

    // PostCondition Test
    // The task should not present in DB now
    todo = await testAppContext.todoRepository.findOne ({ _id:todo._id });
    expect (JSON.stringify (todo)).to.equal ('{}');
  })
  
  it ('should return a internal server error, if provided an invalid mongoose Object Id', async () => {

    // Perform Testing
    // Trying to delete a task providing invalid task Id
    const res = await chai.request (expressApp).delete (`/todo/itisinvalidid`);
    expect (res).to.have.status (400);
  })

})
