var api_key = 'key-b989c6bf666a6cd4ba2247ec2fb044d6';
var domain = 'sandbox5efa5399f1694d9697066188c00687e7.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 

 


module.exports = {
    sendEmail(from, to, subject, html) {
        var email = {
            from: from,
            to: to,
            subject: subject,
            html: html
          };

          mailgun.messages().send(email, function (error, body) {
            if (error) {
                console.log(error);
            }
          });
    }


}