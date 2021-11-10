
import { Schema, model } from 'mongoose';

/* creating the interface representing the document in MongoDB */

interface Todo {
    title: string;
}

/**
 * defining the todoSchema 
 */

const todoSchema: Schema = new Schema <Todo> (

    {
        title: { type: String, required: true }
    },

    {
        collection: 'todos',
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }

);

const todo = model('Todo', todoSchema);
export default todo;