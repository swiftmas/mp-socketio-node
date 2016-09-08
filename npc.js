var globals = require('./globals.js');
var combat = require('./combat.js');
var coredata = globals.coredata;
var collmap = globals.collmap;
///// Exports ///////////////////////////
module.exports = {
  npccontroller: function () {
    npccontroller();
  },
};



///// Controllers ///////
function npccontroller(){
	gn = coredata.npcs
    //// Dead Cleanup 
    for (var npc in gn){
		if (gn.hasOwnProperty(npc)){
            if (gn[npc].state == "dead"){
            		console.log("dead at ", gn[npc].pos)
                gn[npc].pos = gn[npc].origin;
                console.log("spawn at ", gn[npc].pos)
                gn[npc].state = "normal";
            };
        };
    };
    
    
    
    //// Normal Living 
	for (var npc in gn){
		if (gn.hasOwnProperty(npc)){
            if (gn[npc].state == "normal"){
                var closetarget = getSurroundings(npc, 10);
                if (closetarget.length > 0 && closetarget[1] > 1){
                    moveNpcTo(npc, closetarget[0], parseInt(closetarget[2]), parseInt(closetarget[3]), parseInt(closetarget[4]), parseInt(closetarget[5]));
                } else if (closetarget[1] <= 1) {
                    dirToFace = dirToTarget(npc, closetarget[0], parseInt(closetarget[2]), parseInt(closetarget[3]), parseInt(closetarget[4]), parseInt(closetarget[5]));			
                    if (coredata.npcs[npc].dir == dirToFace){
                        combat.attack(npc, "npcs");
                    } else {
                        coredata.npcs[npc].dir = dirToFace;	
                    };
                };
            };
		};
	};
};


//// FUNCTIONS ///////////////////




function getSurroundings(npc, dist) {
    origin = coredata.npcs[npc].pos;
	dist = parseInt(dist);
	surroundings = ["none", dist];
	orig = [origin.split(".")[0], origin.split(".")[1]];
	gp = coredata.players
    for (var player in coredata.players){
    	if (gp.hasOwnProperty(player)) {
    		ppos = [gp[player].pos.split(".")[0], gp[player].pos.split(".")[1]];
    		if (ppos[0] > orig[0] - dist && ppos[0] < parseInt(orig[0]) + dist && ppos[1] > orig[1] - dist && ppos[1] < parseInt(orig[1]) + dist && gp[player].team !== coredata.npcs[npc].team && gp[player].state !== "dead") {
    			aa = Math.abs(ppos[0] - orig[0]);
    			bb = Math.abs(ppos[1] - orig[1]);
    			hypot = Math.sqrt( aa*aa + bb*bb );
    			//console.log(hypot);
    			if (hypot < surroundings[1]){
					surroundings = [player, hypot, ppos[0], ppos[1], orig[0], orig[1]];
				} else if (hypot == surroundings[1] && Math.floor((Math.random()*2)) == 1) {
					surroundings = [player, hypot, ppos[0], ppos[1], orig[0], orig[1]];
				};
    		};
    	};
    };
    gn = coredata.npcs;
    for (var npctar in gn){
    	if (gn.hasOwnProperty(npctar)) {
    		ppos = [gn[npctar].pos.split(".")[0], gn[npctar].pos.split(".")[1]];
    		if (ppos[0] > orig[0] - dist && ppos[0] < parseInt(orig[0]) + dist && ppos[1] > orig[1] - dist && ppos[1] < parseInt(orig[1]) + dist && gn[npctar].team !== coredata.npcs[npc].team && gn[npctar].state !== "dead") {
    			aa = Math.abs(ppos[0] - orig[0]);
    			bb = Math.abs(ppos[1] - orig[1]);
    			hypot = Math.sqrt( aa*aa + bb*bb );
    			//console.log(hypot);
    			if (hypot < surroundings[1]){
					surroundings = [npc, hypot, ppos[0], ppos[1], orig[0], orig[1]];
				} else if (hypot == surroundings[1] && Math.floor((Math.random()*2)) == 1) {
					surroundings = [npc, hypot, ppos[0], ppos[1], orig[0], orig[1]];
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
			coredata.npcs[npc].pos = newcoords;
            coredata.npcs[npc].dir = "left";
			};
		} else if (npcx < tarx) {
			var newcoords = (parseInt(npcx)+1)+"."+npcy;
			if (collmap[newcoords] == 0){
			coredata.npcs[npc].pos = newcoords;
            coredata.npcs[npc].dir = "right";
			};
		};
	} else {
		if (npcy > tary) {
			var newcoords = npcx+"."+(parseInt(npcy)-1);
			if (collmap[newcoords] == 0){
			coredata.npcs[npc].pos = newcoords;
            coredata.npcs[npc].dir = "up";
			};
		} else if (npcy < tary) {
			var newcoords = npcx+"."+(parseInt(npcy)+1);
			if (collmap[newcoords] == 0){
			coredata.npcs[npc].pos = newcoords;
            coredata.npcs[npc].dir = "down";
			};
		};
	};
};


function dirToTarget(npc, tar, tarx, tary, npcx, npcy){
		if (npcx > tarx) {
        	return "left";
		} else if (npcx < tarx) {
            return "right";
		} else if (npcy > tary) {
            return "up";
		} else if (npcy < tary) {
            return "down";
		}else {
			return "up";
		};
};
