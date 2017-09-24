const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) { return console.log('Unable to connect to the MongoDB server'); }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').find().count().then((count) => {
    //     console.log('Todos');
    //     console.log(`Todos count: ${ count }`);
    // }, (error) => {
    //     console.log('Unable to fetch Todos', error);
    // });

    db.collection('Users').find({
        name: 'Ollie Thomas'
    }).toArray().then((docs) => {
        console.log('Users', JSON.stringify(docs, undefined, 2));
    }, (error) => {
        console.log('Unable to fetch Todos', error);
    })

    // db.close();
});