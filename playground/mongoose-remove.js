const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo }     = require('./../server/models/todo');
const { User }     = require('./../server/models/user');

// TODO.remove

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({
    
// }).then((todo) => {
//     console.log(todo);
// });

Todo.findByIdAndRemove('59bbbd959aae99454ee0df7e').then((todo) => {
    console.log(todo);
});