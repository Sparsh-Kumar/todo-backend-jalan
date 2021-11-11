
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
import _ from 'lodash';

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


describe ('GET/:id', () => {

  let _id = '618bbaf32d17c54823853200';
  let todo;

  it ('should return a task if exists with the provided task id in request params', async () => {

    // Precondition
    // There should be a task already in DB with the id = '618bbaf32d17c54823853200';
    todo = await testAppContext.todoRepository.findOne ({ _id });
    if (_.isEmpty (todo)) {
      todo = await testAppContext.todoRepository.save (new Todo ({ _id, title: 'test title' }));
    }

    // Perform Testing
    // Trying to get task with the id = '618bbaf32d17c54823853200'

    const res = await chai.request (expressApp).get (`/todo/${_id}`);
    expect (res).to.have.status (200);
    expect (res.body).to.have.property ('id');
    expect (res.body).to.have.property ('title');

    // Postcondition
    // Task should still be in the database without any change
    todo = await testAppContext.todoRepository.findOne ({ _id });
    expect (todo).to.have.property ('_id');
    expect (todo).to.have.property ('title');

  });

  it ('should return an empty object, if no task exists with task "id" specified', async () => {

    // Precondition
    // Task with _id should not exists in the database
    todo = await testAppContext.todoRepository.findOne ({ _id });
    if (!_.isEmpty (todo)) {
      await testAppContext.todoRepository.deleteMany ({ _id });
    }

    // Perform Testing
    // Trying to get task with ID = '618bbaf32d17c54823853200', which is already been deleted
    const res = await chai.request (expressApp).get (`/todo/${_id}`);
    expect (res).to.have.status (200);
    expect (JSON.stringify (res.body)).to.equal ('{}');

    // Postcondition
    // Task with ID = '618bbaf32d17c54823853200' should not exist in database.
    todo = await testAppContext.todoRepository.findOne ({ _id });
    expect (JSON.stringify (todo)).to.equal ('{}');

  })

  it ('should return validation error if "id" specified in the request params is not of proper format', async () => {

    // Perform Testing
    // should get validation error, if try to get task having id which is not a proper mongoose ID.
    const res = await chai.request (expressApp).get (`/todo/thisisinvalididoftask`);
    expect (res).to.have.status (400);

  })

})
