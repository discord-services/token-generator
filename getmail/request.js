

const fs = require('fs');
const randomstring = require('randomstring');
var emailtosend = (randomstring.generate(7) + "@youremailextens.ion");
console.log(emailtosend);
var names = [
"your",
"bot",
"names"
]
var name = (names[Math.floor(Math.random() * names.length)]);
console.log(name);

fs.readFile("1234.txt", "utf8", function (error, data) {

	ckey = data;

var poll = {"email":emailtosend,"username":name,"password":"goodpassword","invite":null,"captcha_key":ckey};
var url = 'https://discordapp.com/api/v6/auth/register'

var request = require('request');

request.post({
  url: url,
  followAllRedirects: true, // <----
  body: poll,
  json: true
},
    function (error, response, body) {
            console.log(body)
    }
);

});
