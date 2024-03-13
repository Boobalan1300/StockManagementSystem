
const jwt = require('jsonwebtoken');

function generateToken(payload) {
    const token = jwt.sign(payload, '12345');
    return token;
}

module.exports = generateToken;

