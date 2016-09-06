//// SETUP VARS ////////////////////////////
var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var npcs = require('./npc.js');
var globals = require('./globals.js');
var combat = require('./combat.js');


var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    // STATIC STUFF ///////////////////
    if (path.substring(0, 8) == "/static/" ) {
        fs.readFile(__dirname + path, function(error, data){
            if (error){
                response.writeHead(404);
                response.write("o0ps this doesn't exist - 404");
                response.end();
            }
            else{
                if (path.slice(-3) == "png"){
                    response.writeHead(200, {"Content-Type": "image/png"});
                };
                if (path.slice(-3) == "jpg"){
                    response.writeHead(200, {"Content-Type": "image/jpg"});
                };
                if (path.slice(-2) == "js"){
                    response.writeHead(200, {"Content-Type": "text/html"});
                };
                response.write(data, "utf8");
                response.end();
            }
        });
    } else {
    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello world');
            response.end();
            break;
        case '/socket.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
	case '/session.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
	case '/main.js':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
	case '/40x40collmap.jpg':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "image/jpg"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
    };
});

server.listen(8080);





///COOL STUFF ///////////////
////VARS////
var coredata = globals.coredata;
var collmap = globals.collmap;



//// INIT ///////



//// MAIN UPDATE ///////////
setInterval(function() {
    oldtime = (new Date).getTime();
	npcs.npccontroller();
    console.log("clientdatatime = ", oldtime - (new Date).getTime());
}, 512)


///// LISTENERS ////// NEEDS CLEANED ////////////////
var listener = io.listen(server);
listener.sockets.on('connection', function(socket){

////// INIT ////////////
  socket.emit('collmap', collmap);



///This is basically the update function /////////
  setInterval(function(){
        socket.emit('players', coredata);      
    }, 16); 

// For every Client data event (this is where we recieve movement)////////////
  socket.on('client_data', function(data){
    process.stdout.write(data[1]+" commit to ->");
    console.log(data[0], coredata.players[data[0]].pos);
    coredata.players[data[0]].pos = data[1];
    coredata.players[data[0]].dir = data[2];
  });

// This listens for new players ////////
  socket.on('add_player', function(data){
    console.log(data);
    for (var key in data){
      if (data.hasOwnProperty(key)) {
        coredata.players[key] = data[key];
        console.log(coredata.players[key])
      };
    };
  });

// Listens for attacks ////// !!!!!! NEEDS FUNCTION OUSIDE OF LISTENER  !!!!!!!!///////////////////////////
  socket.on('attacks', function(data) {
    combat.attack(data[0], "players");
    
  });
// Listens for disconnects 
  socket.on('disconnect', function() {
    console.log(this.id + "Disconnected");
    var cleanid = this.id.substring(2);
    if (typeof coredata.players["p"+cleanid] !== undefined){
        delete coredata.players["p" + cleanid];
    };
  }); 
});
