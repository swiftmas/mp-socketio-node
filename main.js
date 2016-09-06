//VARS -------//////////////////////////////////////////////////////////
var json = {};
var map = document.getElementById("map");
var ctx = map.getContext("2d");
var socket = io.connect();
var xwin = window.innerWidth / 2;
var ywin = window.innerHeight / 2;
var userplayer = null;
var coredata = {};

//// THROTTLES ////////
var redknightup = new Image();
redknightup.src = "/static/red-knight-up.png";
var redknightdown = new Image();
redknightdown.src = "/static/red-knight-down.png";
var redknightleft = new Image();
redknightleft.src = "/static/red-knight-left.png";
var redknightright = new Image();
redknightright.src = "/static/red-knight-right.png";



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
	newplayerdata[playername] = {"pos":"2.2", "dir": "up", "state":"normal", "team": team, "origin": "2.2"};
	console.log(newplayerdata);
	userplayer = playername;
	elem = document.getElementById("chooseteam");
	elem.parentNode.removeChild(elem);
        socket.emit('add_player', newplayerdata);

};

function drawplayers(data){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    dn = data.npcs;
    for (npc in dn){
		if (dn.hasOwnProperty(npc)){
            var dir = dn[npc].dir;
            switch(dir){
                case 'up': 
                    console.log(dir)
                    var redknight = redknightup; 
                    break;
                case 'down': 
                    console.log(dir)
                    var redknight = redknightdown; 
                    break;
                case 'left': 
                    console.log(dir)
                    var redknight = redknightleft; 
                    break;    
                case 'right': 
                    console.log(dir)
                    var redknight = redknightright; 
                    break;
            };       
            ctx.drawImage(redknight, aco('x', dn[npc].pos.split('.')[0]) -8, aco('y', dn[npc].pos.split('.')[1]) -8);
            ctx.fillStyle = dn[npc].team;
            ctx.fillRect(aco('x', dn[npc].pos.split('.')[0]) -3, aco('y', dn[npc].pos.split('.')[1]) -3, 6, 6);
		};
	};
    dp = data.players;
    for (player in dp){
		if (dp.hasOwnProperty(player)){
            ctx.fillStyle = dp[player].team;
            ctx.fillRect(aco('x', dp[player].pos.split('.')[0]) -8, aco('y', dp[player].pos.split('.')[1]) -8, 16, 16);
		};
	};
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
    else if (e.keyCode == '192') {
    	console.log(coredata);
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
		x = parseInt(coredata.players[playername].pos.split(".")[0])
		y = parseInt(coredata.players[playername].pos.split(".")[1]) - 1 
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
				plocation = [playername, cellname, dir]
            	socket.emit('client_data', plocation);
		};
	};
	if (dir == "down"){
		x = parseInt(coredata.players[playername].pos.split(".")[0]) 
		y = parseInt(coredata.players[playername].pos.split(".")[1]) + 1
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
            		plocation = [playername, cellname, dir]
            		socket.emit('client_data', plocation);
		};
	};
	if (dir == "left"){
		x = parseInt(coredata.players[playername].pos.split(".")[0]) - 1
		y = parseInt(coredata.players[playername].pos.split(".")[1])
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
            		plocation = [playername, cellname, dir]
            		socket.emit('client_data', plocation);
		};
	};
	if (dir == "right"){
		x = parseInt(coredata.players[playername].pos.split(".")[0]) + 1
		y = parseInt(coredata.players[playername].pos.split(".")[1])
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
		if (json[cellname] == 1) {
			console.log('no go')
		} else {
            		plocation = [playername, cellname, dir]
            		socket.emit('client_data', plocation);
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


// old :( dont use, remove when ready
function startup(){
	socket.on('collmap', function(data){
		json = data;
	});
};


///// GET PLAYER TEAM AND STUFF ////
document.getElementById("selBlue").addEventListener("click", function(event) { add_player("blue"); });
document.getElementById("selGreen").addEventListener("click", function(event) { add_player("green"); });
document.getElementById("selRed").addEventListener("click", function(event) { add_player("red"); });
document.getElementById("selGold").addEventListener("click", function(event) { add_player("gold"); });



///// USER INPUT for player movement  ////////////////////////////
document.body.addEventListener("keydown", function(event) {
	if (userplayer !== null){
		getinput(event);
	};
});

////// GET player movement data //////////////
socket.on('players', function(data){
	coredata = data;
	//moveplayers(data.players);
	drawplayers(data);
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