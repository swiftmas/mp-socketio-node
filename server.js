var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;

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
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(8080);

///COOL STUFF ///////////////
//var gamedata = {"players": {"p1":{"pos":"2.2", "state":"normal", "team": "red"}, "p2":{"pos":"2.3", "state":"normal", "team": "blue"}, "p3":{"pos":"2.4", "state":"normal", "team": "green"}}};
var gamedata = {"players": {}, "attacks": {}};
var listener = io.listen(server);
listener.sockets.on('connection', function(socket){

///This is basically the update function /////////
  setInterval(function(){
        socket.emit('players', gamedata);
    }, 10); 

// For every Client data event (this is where we recieve movement)////////////
  socket.on('client_data', function(data){
    process.stdout.write(data[1]+" commit to ->");
    console.log(data[0], gamedata.players[data[0]].pos);
    gamedata.players[data[0]].pos = data[1];
    gamedata.players[data[0]].dir = data[2];
  });

// This listens for new players ////////
  socket.on('add_player', function(data){
    console.log(data);
    for (var key in data){
      if (data.hasOwnProperty(key)) {
        gamedata.players[key] = data[key];
      };
    };
  });

// Listens for attacks //////
  socket.on('attacks', function(data) {
    console.log(data[0] + " attacked");
    gamedata.attacks["a" + data[0]] = gamedata.players[data[0]].pos;
    atdir = gamedata.players[data[0]].dir
    atorig = gamedata.players[data[0]].pos.split(".")
    if (atdir == "up"){
    	nx = parseInt(atorig[0]) 
    	ny = parseInt(atorig[1]) - 1 
    	atpos = nx + "." + ny
    } else if (atdir == "down") {
		nx = parseInt(atorig[0]) 
    	ny = parseInt(atorig[1]) + 1
    	atpos = nx + "." + ny
    } else if (atdir == "left") {
    	nx = parseInt(atorig[0]) - 1 
    	ny = parseInt(atorig[1]) 
    	atpos = nx + "." + ny
    } else if (atdir == "right") {
    	nx = parseInt(atorig[0]) + 1 
    	ny = parseInt(atorig[1]) 
    	atpos = nx + "." + ny
    };
    gp = gamedata.players
    for (var key in gamedata.players){
    	if (gp.hasOwnProperty(key)) {
    		if (gp[key].pos == atpos && gp[key].team !== gp[data[0]].team){
				gp[key].pos = "2.2"
				console.log('WORKED!')
    		} else if (gp[key].pos == gp[data[0]].pos && gp[key].team !== gp[data[0]].team) {
				gp[key].pos = "2.2"
    		};
    	};
    };
    console.log(atorig,atdir,atpos, gp);
  });


// Listens for disconnects 
  socket.on('disconnect', function() {
    console.log(this.id + "Disconnected");
    cleanid = this.id.substring(2);
    delete gamedata.players["p" + cleanid];
  }); 
});
