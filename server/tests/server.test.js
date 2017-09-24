const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("Should create a new todo", (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it("Should not create todo with invaild body data", (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe("GET /todos", () => {
    it("Should get all the todos", (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {

    var id = todos[0]._id.toHexString(); // to Hex String converts the ObjectID to string.

    it("Should get a todo by ID", (done) => {
        request(app)
            .get(`/todos/${ id }`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("Should not return a todo doc created by another user", (done) => {
        request(app)
            .get(`/todos/${ todos[1]._id.toHexString() }`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("Should return a 404 if todo is not found", (done) => {
        var newHexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${ newHexId }`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("Should return a 404 for non-object ids", (done) => {
        request(app)
            .get(`/todos/dfihsefh23`) // something invalid
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {

    it("Should remove a todo", (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${ hexId }`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                return Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    return done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

    it("Should not remove another user's todo", (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${ hexId }`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                return Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    return done();
                }).catch((e) => {
                    return done(e);
                });
            });
    });

    it("Should return 404 if the todo is not found", (done) => {
        var newHexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${ newHexId }`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("Should return 404 if object id is invalid", (done) => {
        var newHexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/sdkfjsdf`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("PATCH /todos/:id", ()=>{

    it("Should update the todo", (done) => {
        
        var id = todos[0]._id.toHexString();
        var text = "Some updated text for the todo";

        request(app)
            .patch(`/todos/${ id }`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ 
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)
    });

    it("Should not update another user's todo", (done) => {
        
        var id = todos[0]._id.toHexString();
        var text = "Some updated text for the todo";

        request(app)
            .patch(`/todos/${ id }`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ 
                text,
                completed: true
            })
            .expect(404)
            .end(done)
    });

    it("Should clear completedAt when todo is not completed", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "Some updated text for the todo";

        request(app)
            .patch(`/todos/${ id }`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ 
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done)
    });

    it("Should return 404 if the todo is not found", (done) => {
        var newHexId = new ObjectID().toHexString();
        request(app)
            .patch(`/todos/${ newHexId }`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("Should return 404 is object id is invalid", (done) => {
        var newHexId = new ObjectID().toHexString();
        request(app)
            .patch(`/todos/flhsdfh`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe("GET /users/me", ()=>{
    it("Should return user if Authenticated", (done) => {
        request(app)
            .get('/users/me')
            .set('X-Auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("Should return a 401 if not Authenticated", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("POST /users", ()=>{
    it("Should create a user", (done) => {

        var email = 'example@email.com';
        var password = 'password123';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {

                if(err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    done(e)
                });
            });
    });

    it("Should return validation errors if request is invalid", (done) => {

        var email = '.com';
        var password = 'password123';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done);
    });

    it("Should not create a user if email is already in yse", (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email, // Existing User
                password: users[0].password
            })
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login", ()=>{
    it("Should login user and return an auth token", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it("Should reject invalid login", (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'invalidPassword'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe("DELETE /users/me/token", ()=>{
    it("Should remove a token", (done) => {
        request(app)
            .delete('/users/me/token')
            .set('X-Auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});