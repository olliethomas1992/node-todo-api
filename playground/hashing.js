const { SHA256 } = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'somepassword';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })   
// });

var hashedPassword = '$2a$10$EvEUoMJOA76qvJ.8b3uxmumkZkDCCnJKgaihLpn/PTMtjBPIkMXu2';

bcrypt.compare(password, hashedPassword, (err, res) => {
   console.log('res', res);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id : 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'someSecretSalt').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash =  SHA256(JSON.stringify(token.data) + 'someSecretSalt').toString();
// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('WARNING: Data was changed. Do not trust!!');
// }