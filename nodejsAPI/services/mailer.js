var api_key = process.env.MAILGUN_APIKEY;
var domain = process.env.MAILGUN_DOMAIN;
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