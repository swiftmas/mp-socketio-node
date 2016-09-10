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
    var damage = 50;
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
			db[key].health = db[key].health - damage;
			if (db[key].health <= 0){	
				db[key].pos = db[key].origin;
				db[key].health = 100;
				console.log(db[key], ' killed at ', atpos)
			};
    		} else if (db[key].pos == at[attacker].pos && db[key].team !== at[attacker].team) {
			db[key].health = db[key].health - damage; 
                        if (db[key].health <= 0){
                                db[key].pos = db[key].origin;
                                db[key].health = 100;
                                console.log(db[key], ' killed at ', atpos)
                        };
    		};
    	};
    };
    
    
    db = coredata.npcs;
    for (var key in db){
    	if (db.hasOwnProperty(key)) {
    		if (db[key].pos == atpos && db[key].team !== at[attacker].team){
			db[key].health = db[key].health - damage;
                        if (db[key].health <= 0){
				db[key].state = "dead";
				console.log(db[key], ' killed at ', atpos)
			};
    		} else if (db[key].pos == at[attacker].pos && db[key].team !== at[attacker].team) {
			db[key].health = db[key].health - damage;
                        if (db[key].health <= 0){
                                db[key].state = "dead";
                                console.log(db[key], ' killed at ', atpos)
                        };
    		};
    	};
    };
};
