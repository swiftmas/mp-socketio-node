///VARS -------//////////////////////////////////////////////////////////
var json = {};
var map = document.getElementById("map");
var ctx = map.getContext("2d");
var socket = io.connect();
var xwin = window.innerWidth / 2;
var ywin = window.innerHeight / 2;
var userplayer = null;
var coredata = {};
var touchdir = ["none", 0];
var touchtimer = 0;

//// IMG ////////
var redknightup = document.getElementById("rkup");
var redknightdown = document.getElementById("rkdown");
var redknightleft = document.getElementById("rkleft");
var redknightright = document.getElementById("rkright");

var charsprites = new Image();
charsprites.src = '/static/charsprites.png';
var chars = {};
chars.blueKnight = {};
chars.blueKnight.up = [charsprites, 0, 16, 16, 16];
chars.blueKnight.down = [charsprites, 16, 16, 16, 16];
chars.blueKnight.left = [charsprites, 32, 16, 16, 16];
chars.blueKnight.right = [charsprites, 48, 16, 16, 16];
chars.redKnight = {};
chars.redKnight.up = [charsprites, 0, 0, 16, 16];
chars.redKnight.down = [charsprites, 16, 0, 16, 16];
chars.redKnight.left = [charsprites, 32, 0, 16, 16];
chars.redKnight.right = [charsprites, 48, 0, 16, 16];
chars.greenKnight = {};
chars.greenKnight.up = [charsprites, 0, 32, 16, 16];
chars.greenKnight.down = [charsprites, 16, 32, 16, 16];
chars.greenKnight.left = [charsprites, 32, 32, 16, 16];
chars.greenKnight.right = [charsprites, 48, 32, 16, 16];
chars.goldKnight = {};
chars.goldKnight.up = [charsprites, 0, 48, 16, 16];
chars.goldKnight.down = [charsprites, 16, 48, 16, 16];
chars.goldKnight.left = [charsprites, 32, 48, 16, 16];
chars.goldKnight.right = [charsprites, 48, 48, 16, 16];
chars.duane = {};
chars.duane.up = [charsprites, 0, 64, 16, 16];
chars.duane.down = [charsprites, 16, 64, 16, 16];
chars.duane.left = [charsprites, 32, 64, 16, 16];
chars.duane.right = [charsprites, 48, 64, 16, 16];
console.log(chars)
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
	newplayerdata[playername] = {"pos":"2.2", "dir": "up", "state":"normal", "health": 100, "alerttimer": 0, "team": team, "skin": "duane", "origin": "2.2"};
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
	var sprite = [];
	if (dn.hasOwnProperty(npc)){
            if (dn[npc].state == "normal"){
                var dir = dn[npc].dir;
		var skin = dn[npc].skin;
                switch(dir){
                    case 'up':
                        sprite = chars[skin].up.slice(0, 5); 
                        break;
                    case 'down': 
			sprite = chars[skin].down.slice(0, 5);
                        break;
                    case 'left': 
                        sprite = chars[skin].left.slice(0, 5); 
                        break;    
                    case 'right': 
                        sprite = chars[skin].right.slice(0, 5); 
                        break;
                };
		sprite.push(aco('x', dn[npc].pos.split('.')[0]), aco('y', dn[npc].pos.split('.')[1]), 16, 16)
		var sp = sprite 
                ctx.drawImage(sp[0],sp[1],sp[2],sp[3],sp[4],sp[5],sp[6],sp[7],sp[8]);
                ctx.fillStyle = dn[npc].team;
                ctx.fillRect(aco('x', dn[npc].pos.split('.')[0]) +5, aco('y', dn[npc].pos.split('.')[1]) +6, 4, 4);
            };
	};
    };
    dp = data.players;
    for (player in dp){
	var sprite = [];
	if (dp.hasOwnProperty(player)){
	    if (dp[player].state == "normal"){
                var dir = dp[player].dir;
                var skin = dp[player].skin;
                switch(dir){
                    case 'up':
                        sprite = chars[skin].up.slice(0, 5);
                        break;
                    case 'down':
                        sprite = chars[skin].down.slice(0, 5);
                        break;
                    case 'left':
                        sprite = chars[skin].left.slice(0, 5);
                        break;
                    case 'right':
                        sprite = chars[skin].right.slice(0, 5);
                        break;
                };
                sprite.push(aco('x', dp[player].pos.split('.')[0]), aco('y', dp[player].pos.split('.')[1]), 16, 16)
                var sp = sprite
                ctx.drawImage(sp[0],sp[1],sp[2],sp[3],sp[4],sp[5],sp[6],sp[7],sp[8]);
         	ctx.fillStyle = dp[player].team;
         	ctx.fillRect(aco('x', dp[player].pos.split('.')[0]) + 6, aco('y', dp[player].pos.split('.')[1]) + 6, 4, 4);
	    };
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
		plocation = [playername, cellname, dir]
            	socket.emit('client_data', plocation);
	};
	if (dir == "down"){
		x = parseInt(coredata.players[playername].pos.split(".")[0]) 
		y = parseInt(coredata.players[playername].pos.split(".")[1]) + 1
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
            	plocation = [playername, cellname, dir]
            	socket.emit('client_data', plocation);
	};
	if (dir == "left"){
		x = parseInt(coredata.players[playername].pos.split(".")[0]) - 1
		y = parseInt(coredata.players[playername].pos.split(".")[1])
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
            	plocation = [playername, cellname, dir]
            	socket.emit('client_data', plocation);
	};
	if (dir == "right"){
		x = parseInt(coredata.players[playername].pos.split(".")[0]) + 1
		y = parseInt(coredata.players[playername].pos.split(".")[1])
		cellname = ''+x+'.'+y+''
		console.log(x,y,cellname,json[cellname])
            	plocation = [playername, cellname, dir]
            	socket.emit('client_data', plocation);
	};	

};

function updatehud() {
	if (userplayer !== null){
		document.getElementById("tophud").innerHTML = coredata.players[userplayer].pos + " - " + coredata.players[userplayer].alerttimer;
		document.getElementById("bothud").innerHTML = coredata.players[userplayer].health;
	};
}



///////// EVENTS /////////////////////////////////////////////////
//// STARTUP //////////////////////
//if(window.addEventListener){
//    window.addEventListener('load',setwindow,false); //W3C
//}
//else{
//   window.attachEvent('onload',setwindow); //IE
//};

//function setwindow(){
//	window.scrollTo(0,0);
//};


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
	updatehud();
	//moveplayers(data.players);
	drawplayers(data);
	if (userplayer !== null){
		var dn = data.players[userplayer].pos.split('.');
		var winw = parseInt(window.innerWidth) / 2;
		var winh = parseInt(window.innerHeight) / 2;
		window.scrollTo(aco('x', dn[0]) - winw, aco('y', dn[1]) - winh);
	};
});





////// UTILITY EVENTS //////////////////////////


///// Touch device controlls ///////////////////////
document.getElementById("maptop").addEventListener("touchstart", function(event) {
	event.preventDefault();
	var pattack = [userplayer]; 
	socket.emit('attacks', pattack);
	tstarx = Math.ceil((event.pageX));
 	tstary = Math.ceil((event.pageY));
	touchdown = true;
	initialtouch = true;
	document.getElementById("logger").innerHTML = initialtouch
}, false);


document.addEventListener("touchmove", function(event) {	
	event.preventDefault();
	tmovx = Math.ceil((event.pageX));
 	tmovy = Math.ceil((event.pageY));
 	if (initialtouch == true){
 		getswipedir(tmovx, tmovy);
 		initialtouch = false;
 		document.getElementById("logger").innerHTML = initialtouch
 	};
 	if (Date.now() > touchtimer + 200){
		getswipedir(tmovx, tmovy);
		touchtimer = Date.now();
	};
}, false);


function getswipedir(x, y) {
	var dirlength = [];
    if (y > tstary + 2){ 
    	var ddist = y - tstary;
    	dirlength.push(["down", ddist])
    };
    if (y < tstary - 2){
    	var udist = tstary - y;
    	dirlength.push(["up", udist])
    };
    if (x > tstarx + 2){
    	var rdist = x - tstarx;
    	dirlength.push(["right", rdist])
    };
    if (x < tstarx - 2){
    	var ldist = tstarx - x;
    	dirlength.push(["left", ldist])
    };
    var top = ["none", 0]; 
    if (dirlength.length > 1){
    	for (var i = 0; i < dirlength.length; i++ ){
    		if (dirlength[i][1] > top[1]){
    			top = dirlength[i];
    			touchdir = top[0];
    		};
    	};
    	move(top[0], userplayer);
    } else if (dirlength.length == 1) {
    	top = dirlength[0];
    	touchdir = top[0]
    	move(top[0], userplayer);
    };
  
  	//var coor = "Coordinates: (" + top[0] + ")";
  	document.getElementById("coor").innerHTML = touchdir;
};
