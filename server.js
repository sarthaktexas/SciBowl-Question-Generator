//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var favicon = require('serve-favicon');
router.use(favicon(__dirname + '/client/img/favicon.ico'));

var fs = require('fs');
var questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
var questionsKeys = Object.keys(questions);

var numQuestions = 0;
questionsKeys.forEach(function(x) {
  numQuestions+=questions[x].length;
});

router.use(express.static(path.resolve(__dirname, 'client')));

io.on('connection', function (socket) {
    /*messages.forEach(function (data) {
      //socket.emit('message', data);
    });*/


    socket.on('disconnect', function () {

    });
    
    socket.on('getQuestion', function(options) {
         //select normally
        var matchedQuestions = [];
        var categoryMap = [];
        for(var category in questions) {
          var qcate = questions[category];
          for(var i=0;i<qcate.length;i++) {
            var q = qcate[i];
            if((category==="Chemistry" && options.categories.chemistry) ||
              (category==="Energy" && options.categories.energy) ||
              (category==="Earth and Space Science" && options.categories.earthspace) ||
              (category==="General Science" && options.categories.general) ||
              (category==="Life Science" && options.categories.biology) ||
              (category==="Math" && options.categories.math) ||
              (category==="Physical Science" && options.categories.physics)) {
                
                if((options.difficulties.HS && q.difficulty==="HS") || (options.difficulties.MS && q.difficulty==="MS")) {
                  if((options.types.multiple_choice && q.hasOwnProperty("multiple_choice")) || (options.types.short_answer && !q.hasOwnProperty("multiple_choice"))) {
                    matchedQuestions.push(q);
                    categoryMap.push(category);
                  }
                }
            }
            
          }
        }
        
        if(matchedQuestions.length>0) {
          var idx = Math.floor(Math.random()*matchedQuestions.length);
          var q2 = matchedQuestions[idx];
          var category2 = categoryMap[idx];
          socket.emit('sendQuestion', {category: category2, question: q2});
        }
        else {
          //console.log("No questions matched!");
          socket.emit('error', "No questions matched!");
        }
    });
    
    socket.on('getNumQuestions', function() {
      //console.log("Sending number of questions...");
      socket.emit("numQuestions", numQuestions);
    });
  });

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
