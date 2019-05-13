const qs = require("querystring");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const axios = require('axios');

module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const formValues = qs.parse(req.body);

  const twiml = new MessagingResponse();
  var posterCountry = formValues.FromCountry;
  var posterMessage = formValues.Body.trim();

  context.log("Body : " + formValues.Body);
  context.log('SMS From : ' + posterCountry);

  

    // Check if the message is what we want
    if (posterMessage.length > 1) {
        console.log('Received Length is more than 1');
        twiml.message('Please enter only A,B,C or D');
        context.res = {
            status: 200,
            body: twiml.toString(),
            headers: { 'Content-Type': 'application/xml' },
            isRaw: true
        };
        
        context.done();
    }

    else if (posterMessage.length === 1) {
        posterMessage = posterMessage.toUpperCase();

        if ((posterMessage !== 'A') && (posterMessage !== 'B') && (posterMessage !== 'C') && (posterMessage !== 'D')){
            twiml.message('Please enter only A,B,C or D');
            context.res = {
                status: 200,
                body: twiml.toString(),
                headers: { 'Content-Type': 'application/xml' },
                isRaw: true
            };
            
            context.done();
        }

        else{
            axios.post("https://firestore.googleapis.com/v1/projects/smsvote/databases/(default)/documents/Votes",
            {
                fields:{
                    choice: {stringValue: posterMessage},
                    createdAt: {timestampValue: new Date()},
                    location: {stringValue: posterCountry}
                } 
            }).then(res => {
                twiml.message('You have voted ' + posterMessage + '. Thank you.');
                context.res = {
                    status: 200,
                    body: twiml.toString(),
                    headers: { 'Content-Type': 'application/xml' },
                    isRaw: true
                };
                
                context.done();
            })
            
            
        }
    }
};