var express    = require('express');
var bodyParser = require('body-parser');
var request    = require('request');

var app        = express();

app.use(bodyParser.json());

var token = process.env.ACCESS_TOKEN;

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function sendVR(sender) {
  messageData = {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "generic",
              "elements": [{
                  "title": "Oculus Rift",
                  "subtitle": "Facebook's VR headset",
                  "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                  "buttons": [{
                      "type": "web_url",
                      "url": "https://www.oculus.com/",
                      "title": "Oculus Website"
                  }, {
                      "type": "postback",
                      "title": "More info",
                      "payload": "Oculus is making it possible to experience anything, anywhere, through the power of virtual reality.",
                  }],
              },{
                  "title": "Gear VR",
                  "subtitle": "Built for Samsung phones, standalone seadset",
                  "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                  "buttons": [{
                      "type": "web_url",
                      "url": "https://www.oculus.com/en-us/gear-vr/",
                      "title": "Gear VR Website"
                  }, {
                      "type": "postback",
                      "title": "More info",
                      "payload": "Whenever you want to enter virtual reality, just take your GALAXY smartphone, slide it in the Gear VR, and you're in. It's that simple.",
                  }],
              }]
          }
      }
  };
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
  });
}

// verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// receiving text
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      console.log(text);
      sendTextMessage(sender, "Text received, echo: "+ text);

      if (text === 'VR') {
        sendVR(sender);
        continue;
      }

    }
    if (event.postback) {
      text = JSON.stringify(event.postback.payload);
      sendTextMessage(sender, text, token);
      continue;
    }
  }
  res.sendStatus(200);
});

app.get('/hello', function (req, res) {
  res.send('world');
});

app.listen(process.env.PORT || 3000);
