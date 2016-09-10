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

//// THROTTLES ////////
var redknightup = document.getElementById("rkup");
var redknightdown = document.getElementById("rkdown");
var redknightleft = document.getElementById("rkleft");
var redknightright = document.getElementById("rkright");



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
	newplayerdata[playername] = {"pos":"2.2", "dir": "up", "state":"normal", "health": 100, "alerttimer": 0, "team": team, "origin": "2.2"};
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
            if (dn[npc].state == "normal"){
                var dir = dn[npc].dir;
                switch(dir){
                    case 'up': 
                        var redknight = redknightup; 
                        break;
                    case 'down': 
                        var redknight = redknightdown; 
                        break;
                    case 'left': 
                        var redknight = redknightleft; 
                        break;    
                    case 'right': 
                        var redknight = redknightright; 
                        break;
                };       
                ctx.drawImage(redknight, aco('x', dn[npc].pos.split('.')[0]) -8, aco('y', dn[npc].pos.split('.')[1]) -8);
                ctx.fillStyle = dn[npc].team;
                ctx.fillRect(aco('x', dn[npc].pos.split('.')[0]) -3, aco('y', dn[npc].pos.split('.')[1]) -3, 6, 6);
            };
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
	if (userplayer !== null){
		var dn = data.players[userplayer].pos.split('.');
		var winw = parseInt(window.innerWidth) / 2;
		var winh = parseInt(window.innerHeight) / 2;
		window.scrollTo(aco('x', dn[0]) - winw, aco('y', dn[1]) - winh);
	};
});





////// UTILITY EVENTS //////////////////////////


///// Touch device controlls ///////////////////////
document.getElementById("map").addEventListener("touchstart", function(event) {
	//event.preventDefault();
	var pattack = [userplayer]; 
	socket.emit('attacks', pattack);
	tstarx = Math.ceil((event.pageX));
 	tstary = Math.ceil((event.pageY));
	touchdown = true;
	initialtouch = true;
	document.getElementById("logger").innerHTML = initialtouch
}, false);

//document.ontouchmove = function(event){event.preventDefault();};

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
