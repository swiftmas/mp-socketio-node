var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var collmap = require("./coll.json");

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
////VARS////
var gamedata = {"players": {}, "attacks": {}, "enemies": {"enemy1": {"pos": "20.2", "team": "blue"}}};

///// Functions ////////
function getSurroundings(origin, dist) {
	dist = parseInt(dist);
	surroundings = ["none", dist];
	orig = [origin.split(".")[0], origin.split(".")[1]];
	gp = gamedata.players
    for (var player in gamedata.players){
    	if (gp.hasOwnProperty(player)) {
    		ppos = [gp[player].pos.split(".")[0], gp[player].pos.split(".")[1]];
    		if (ppos[0] > orig[0] - dist && ppos[0] < parseInt(orig[0]) + dist && ppos[1] > orig[1] - dist && ppos[1] < parseInt(orig[1]) + dist) {
    			aa = Math.abs(ppos[0] - orig[0]);
    			bb = Math.abs(ppos[1] - orig[1]);
    			hypot = Math.sqrt( aa*aa + bb*bb );
    			console.log(hypot);
    			if (hypot < surroundings[1]){
					surroundings = [player, hypot, ppos[0], ppos[1], orig[0], orig[1]];
				} else if (hypot == surroundings[1] && Math.floor((Math.random()*2)) == 1) {
					surroundings = [player, hypot, ppos[0], ppos[1], orig[0], orig[1]];
				};
    		};
    	};
    };
    if (surroundings[0] == "none"){ surroundings = []; };
    return surroundings;
};

function moveNpcTo(npc, tar, tarx, tary, npcx, npcy){
	if (npcx == tarx){
		var heading = 0;
	} else if (npcy == tary) {
		var heading = 1;
	} else {
		var heading = Math.floor((Math.random() * 2));
	}
	
	if (heading == 1){
		if (npcx > tarx) {
			var newcoords = (parseInt(npcx)-1)+"."+npcy;
			if (collmap[newcoords] == 0){
			gamedata.enemies[npc].pos = newcoords;
			};
		} else if (npcx < tarx) {
			var newcoords = (parseInt(npcx)+1)+"."+npcy;
			if (collmap[newcoords] == 0){
			gamedata.enemies[npc].pos = newcoords;
			};
		};
	} else {
		if (npcy > tary) {
			var newcoords = npcx+"."+(parseInt(npcy)-1);
			if (collmap[newcoords] == 0){
			gamedata.enemies[npc].pos = newcoords;
			};
		} else if (npcy < tary) {
			var newcoords = npcx+"."+(parseInt(npcy)+1);
			if (collmap[newcoords] == 0){
			gamedata.enemies[npc].pos = newcoords;
			};
		};
	};
};

///// Controllers ///////
function enemycontroller(){
	ge = gamedata.enemies
	for (var enemy in ge){
		if (ge.hasOwnProperty(enemy)){
			closetarget = getSurroundings(ge[enemy].pos, 10);
			if (closetarget.length > 0 && closetarget[1] > 1){
				moveNpcTo(enemy, closetarget[0], parseInt(closetarget[2]), parseInt(closetarget[3]), parseInt(closetarget[4]), parseInt(closetarget[5]));
			};
		};
	};
};

//// INIT ///////



//// MAIN UPDATE ///////////
setInterval(function() {
	enemycontroller();
}, 600)


///// LISTENERS ////// NEEDS CLEANED ////////////////
var listener = io.listen(server);
listener.sockets.on('connection', function(socket){

////// INIT ////////////
  socket.emit('collmap', collmap);



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

// Listens for attacks ////// !!!!!! NEEDS FUNCTION OUSIDE OF LISTENER  !!!!!!!!///////////////////////////
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
