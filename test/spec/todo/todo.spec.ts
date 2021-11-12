
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
import _ from 'lodash';
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


describe ('PUT /todo/:id', () => {
  
  let todo: Todo;
  let title = 'test title';
  let updatedTitle = 'updated test title';

  it ('should return the task with updated title', async () => {
    
    // Precondiion test
    // There should already be a todo present in the database
    todo = await testAppContext.todoRepository.save (new Todo ({ title }));

    // Perform Testing
    // Trying to change the title of the task.
    const res = await chai.request (expressApp).put (`/todo/${todo._id}`).send ({ title: updatedTitle });
    expect (res).to.have.status (200);
    expect (res.body).to.have.property ('id');
    expect (res.body).to.have.property ('title');

    // Postcondition Testing
    // The title of the task should get updated
    todo = await testAppContext.todoRepository.findOne ({ _id: todo._id });
    expect (todo.title).to.equal(updatedTitle)

  })

  it ('should return a not found error if task with provided id does not exist', async () => {

    // Precondition
    // delete the record if already exists with id '618e2ed3a15925a0428ef4dc'
    todo = await testAppContext.todoRepository.findOne ({ _id: '618e2ed3a15925a0428ef4dc' });
    if (!_.isEmpty (todo)) {
      await testAppContext.todoRepository.deleteMany ({ _id: '618e2ed3a15925a0428ef4dc' });
    }

    // Perform Testing
    // Trying to update the non existing todo
    const res = await chai.request (expressApp).put (`/todo/618e2ed3a15925a0428ef4dc`).send ({ title: updatedTitle });
    expect (res).to.have.status (404);

    // Post condition Testing
    // Checking if no todos are present with id '618e2ed3a15925a0428ef4dc' in database
    todo = await testAppContext.todoRepository.findOne ({ _id: '618e2ed3a15925a0428ef4dc' });
    expect (JSON.stringify(todo)).to.equal ('{}');

  })

  it ('should return a validation error if no title is specified in request', async () => {

    // Precondition
    // There should be a task already in the database
    todo = await testAppContext.todoRepository.save (new Todo ({ title }));

    // Perform Testing
    // Trying to update the todo item title with empty title
    const res = await chai.request (expressApp).put (`/todo/${todo._id}`).send ({ title: '' });
    expect (res).to.have.status (400);

    // Postcondition Testing
    // Task title should not get updated
    todo = await testAppContext.todoRepository.findOne ({ _id: todo._id });
    expect (todo.title).to.equal (title);

  })

})
