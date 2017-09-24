const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo }     = require('./../server/models/todo');
const { User }     = require('./../server/models/user');

//var id = '59bb9eb1fa94eae94700170411';

// if(!ObjectID.isValid(id)){
//     return console.log('ID not vaild');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log("Todos: ", todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log("Todo: ", todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo){
//         return console.log('id not found');
//     }
//     console.log("Todo by id: ", todo);
// }).catch((e) => {
//     console.log(e);
// });

var userId = '59ba7c9e50a968d93363b1ca';

if(!ObjectID.isValid(userId)){
    return console.log('userId not vaild');
}

User.findById(userId).then((user) => {
    if (!user){
        return console.log('User not found');
    }
    console.log("User by id: ", user);
}).catch((e) => {
    console.log(e);
});