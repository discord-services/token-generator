

const fs = require('fs');
fs.readFile("1234.txt", "utf8", function (error, data) {
ckey = data;
fs.readFile("../verify.txt", "utf8", function (error, data) {
token = data;
var poll = {"token":token,"captcha_key":ckey};
var url = 'https://discordapp.com/api/v6/auth/verify'

var request = require('request');

request.post({
  url: url,
  followAllRedirects: true, // <----
  body: poll,
  json: true
},
    function (error, response, body) {
            console.log(body);
			fs.appendFileSync('../tokens.txt', JSON.stringify(body), encoding='utf8');
    }
);

});
});
