const jwt = require('jsonwebtoken');
let secret = '#%%!#@';
module.exports = {
	getToken: function(data, exp){
		let now = Math.floor(Date.now() / 1000);
		return jwt.sign({
			iat: now,
			exp: now + 24 * 3600 * exp,
			data: data
		}, secret);
	},
	checkToken: function(token){
		try {
		  let decoded = jwt.verify(token, secret);
		  return decoded;
		} catch(err) {
			return false;
		}
	}
}