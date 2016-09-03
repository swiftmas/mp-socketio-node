//VARS -------//////////////////////////////////////////////////////////
var json = {};
var map = document.getElementById("map");
var ctx = map.getContext("2d");
var socket = io.connect();
var xwin = window.innerWidth / 2;
var ywin = window.innerHeight / 2;
var userplayer = null;

//// THROTTLES ////////
var throttlekeys = 0 //// user keyboard input

//Utility Functoins //////////////////////////////////////////

function rco(j) {
	return (j * 16) - 16;
};

function aco(axis, location) {
	if (axis == "y"){
	return ((location * 16) - 16 + document.getElementById("map").offsetTop);
	} else if (axis == "x"){
	return ((location * 16) - 16 + document.getElementById("map").offsetLeft);
	};
};

function cco(axis, location){
	if (axis == "y"){
	return Math.ceil((location - document.getElementById("map").offsetTop)/16);
	} else if (axis == "x"){
	return Math.ceil((location - document.getElementById("map").offsetLeft)/16);
	};
};




///// METHODS ///////////////////////////

function add_player(team){
	playername = "p" + socket.io.engine.id;
	newplayerdata = {};
	newplayerdata[playername] = {"pos":"2.2", "dir": "up", "state":"normal", "team": team};
	console.log(newplayerdata);
	userplayer = playername;
	elem = document.getElementById("chooseteam");
	elem.parentNode.removeChild(elem);
        socket.emit('add_player', newplayerdata);

};

function drawmap(){
	collElements = [];
	for (var key in json) {
		if (json[key] == 1){
			collElements.push(key);
		};
	};
	for (var i = 0; i < collElements.length; i++) {
		ctx.fillStyle = "#e3e3e3";
		ctx.fillRect(rco(collElements[i].split('.')[0]), rco(collElements[i].split('.')[1]), 16, 16);
	};
};


function makePlayer(player, team, x, y) {
	var newplayer = document.createElement('div');
	newplayer.id = player;
	newplayer.style.position = 'absolute';
	newplayer.style.left = aco('x', x)+ 1 + "px";
	newplayer.style.top = aco('y', y)+ 1 + "px";
	newplayer.style.width = '10px';
	newplayer.style.height = '10px';
	newplayer.style.borderStyle = 'solid';
	newplayer.style.borderColor = 'black';
	newplayer.style.borderWidth = '2px 2px 2px 2px';
	newplayer.style.backgroundColor = team;
	document.body.appendChild(newplayer);
};

function makeNpc(npc, team, x, y) {
	var newnpc = document.createElement('div');
	newnpc.id = npc;
	newnpc.style.position = 'absolute';
	newnpc.style.left = aco('x', x)+ 1 + "px";
	newnpc.style.top = aco('y', y)+ 1 + "px";
	newnpc.style.width = '15px';
	newnpc.style.height = '15px';
	newnpc.style.backgroundColor = team;
	document.body.appendChild(newnpc);
};

//mOVEMENT /////////////////////////////////////////

function getinput(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
        move('up', userplayer)
    }
    else if (e.keyCode == '78') {
    	pattack = [userplayer]; 
		socket.emit('attacks', pattack);
    }
    else if (e.keyCode == '83') {
        move('down', userplayer)
    }
    else if (e.keyCode == '65') {
       move('left', userplayer)
    }
    else if (e.keyCode == '68') {
       move('right', userplayer)
    }

};

function move(dir, playername) {
	if (dir == "up"){
		x = cco('x', document.getElementById(playername).offsetLeft) 
		y = cco('y', document.getElementById(playername).offsetTop) - 1
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
				plocation = [playername, cellname, dir]
				document.getElementById(playername).style.borderWidth = "0px 2px 2px 2px";
            	socket.emit('client_data', plocation);
		};
	};
	if (dir == "down"){
		x = cco('x', document.getElementById(playername).offsetLeft) 
		y = cco('y', document.getElementById(playername).offsetTop) + 1
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
			//document.getElementById(playername).style.top = parseInt(document.getElementById(playername).style.top) + 16 + "px";
            		plocation = [playername, cellname, dir]
            		document.getElementById(playername).style.borderWidth = "2px 2px 0px 2px";
            		socket.emit('client_data', plocation);
		};
	};
	if (dir == "left"){
		x = cco('x', document.getElementById(playername).offsetLeft) - 1 
		y = cco('y', document.getElementById(playername).offsetTop) 
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
			//document.getElementById(playername).style.left = parseInt(document.getElementById(playername).style.left) - 16 + "px";
            		plocation = [playername, cellname, dir]
            		document.getElementById(playername).style.borderWidth = "2px 2px 2px 0px";
            		socket.emit('client_data', plocation);
		};
	};
	if (dir == "right"){
		x = cco('x', document.getElementById(playername).offsetLeft) + 1 
		y = cco('y', document.getElementById(playername).offsetTop) 
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
            		plocation = [playername, cellname, dir]
					document.getElementById(playername).style.borderWidth = "2px 0px 2px 2px";
            		socket.emit('client_data', plocation);
		};
	};	

};


function moveplayers(data){
	for (player in data){
		if (data.hasOwnProperty(player)){
			if (document.getElementById(player) === null) {
				makePlayer(player, data[player].team, data[player].pos.split('.')[0], data[player].pos.split('.')[1]);
			} else {
			//	console.log(player, data[player].pos);
				document.getElementById(player).style.left = aco('x', data[player].pos.split('.')[0]) + 1 + "px";
            			document.getElementById(player).style.top = aco('y', data[player].pos.split('.')[1]) + 1 + "px";
			};
			if (document.getElementById(userplayer) !== null){
				window.scrollTo(parseInt(document.getElementById(userplayer).style.left) - xwin, parseInt(document.getElementById(userplayer).style.top) - ywin)
			};
		};
	};
};

function movenpcs(data){
	for (npc in data){
		if (data.hasOwnProperty(npc)){
			if (document.getElementById(npc) === null) {
				makeNpc(npc, data[npc].team, data[npc].pos.split('.')[0], data[npc].pos.split('.')[1]);
			} else {
			//	console.log(npc, data[npc].pos);
				document.getElementById(npc).style.left = aco('x', data[npc].pos.split('.')[0]) + 1 + "px";
            			document.getElementById(npc).style.top = aco('y', data[npc].pos.split('.')[1]) + 1 + "px";
			};
		};
	};
};




// document.getElementById(npc).style.left = parseInt(document.getElementById(npc).style.left) - 16 + "px";
///////// EVENTS /////////////////////////////////////////////////
//// STARTUP //////////////////////
if(window.addEventListener){
    window.addEventListener('load',startup,false); //W3C
}
else{
    window.attachEvent('onload',startup); //IE
};

function startup(){
	socket.on('collmap', function(data){
		json = data;
		drawmap();
	});
};


///// GET PLAYER TEAM AND STUFF ////
document.getElementById("selBlue").addEventListener("click", function(event) { add_player("blue"); });
document.getElementById("selGreen").addEventListener("click", function(event) { add_player("Green"); });
document.getElementById("selRed").addEventListener("click", function(event) { add_player("Red"); });
document.getElementById("selGold").addEventListener("click", function(event) { add_player("Gold"); });



///// USER INPUT for player movement  ////////////////////////////
document.body.addEventListener("keydown", function(event) {
	if (userplayer !== null){
		getinput(event);
	};
});

////// GET player movement data //////////////
socket.on('players', function(data){
	//console.log(data.npcs);
	moveplayers(data.players);
	movenpcs(data.npcs);
});





////// UTILITY EVENTS //////////////////////////
document.ontouchmove = function(event){
    event.preventDefault();
}

///// Touch device controlls ///////////////////////
document.getElementById("map").addEventListener("touchstart", function(event) {
	pattack = [userplayer]; 
	socket.emit('attacks', pattack);
});
document.getElementById("map").addEventListener("touchmove", function(event) {
  var x = Math.ceil((event.pageX - document.getElementById("map").offsetLeft) / 16);
  var y = Math.ceil((event.pageY - document.getElementById("map").offsetTop) / 16);
    if (y < 10){move('up',userplayer)
    } else if (y > 30){move('down',userplayer)};
    if (x > 30){move('right',userplayer)
    } else if (x < 10){move('left',userplayer)};
  var coor = "Coordinates: (" + x + "," + y + ")";
  document.getElementById("coor").innerHTML = coor;;
});
