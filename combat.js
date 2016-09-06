var globals = require('./globals.js');
var coredata = globals.coredata;
var collmap = globals.collmap;
///// Exports ///////////////////////////
module.exports = {
  attack: function (attacker, dir) {
    attack(attacker, dir);
  },
};
  

function attack(attacker, npcsORplayers){
    // second argument, npc or player is the attribute of the attacker, not whats being attacked.
    console.log(attacker + " attacked");
    at = coredata[npcsORplayers];
    //coredata.attacks["a" + attacker] = at[attacker].pos;
    atdir = at[attacker].dir;
    atorig = at[attacker].pos.split(".");
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

    db = coredata.players;
    for (var key in db){
    	if (db.hasOwnProperty(key)) {
    		if (db[key].pos == atpos && db[key].team !== at[attacker].team){
				db[key].pos = db[key].origin
				console.log(db[key], ' Deaded!')
    		} else if (db[key].pos == at[attacker].pos && db[key].team !== at[attacker].team) {
				db[key].pos = db[key].origin
				console.log(db[key], ' Deaded!')
    		};
    	};
    };
    
    
    db = coredata.npcs;
    for (var key in db){
    	if (db.hasOwnProperty(key)) {
    		if (db[key].pos == atpos && db[key].team !== at[attacker].team){
				db[key].pos = db[key].origin
				console.log(key, ' Deaded!')
    		} else if (db[key].pos == at[attacker].pos && db[key].team !== at[attacker].team) {
				db[key].pos = db[key].origin
				console.log(key, ' Deaded!')
    		};
    	};
    };
    
    
};