module.exports = {
  npccontroller: function () {
    npccontroller();
  },
};


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
			gamedata.npcs[npc].pos = newcoords;
			};
		} else if (npcx < tarx) {
			var newcoords = (parseInt(npcx)+1)+"."+npcy;
			if (collmap[newcoords] == 0){
			gamedata.npcs[npc].pos = newcoords;
			};
		};
	} else {
		if (npcy > tary) {
			var newcoords = npcx+"."+(parseInt(npcy)-1);
			if (collmap[newcoords] == 0){
			gamedata.npcs[npc].pos = newcoords;
			};
		} else if (npcy < tary) {
			var newcoords = npcx+"."+(parseInt(npcy)+1);
			if (collmap[newcoords] == 0){
			gamedata.npcs[npc].pos = newcoords;
			};
		};
	};
};

///// Controllers ///////
function npccontroller(){
	gn = gamedata.npcs
	for (var npc in gn){
		if (gn.hasOwnProperty(npc)){
			closetarget = getSurroundings(gn[npc].pos, 10);
			if (closetarget.length > 0 && closetarget[1] > 1){
				moveNpcTo(npc, closetarget[0], parseInt(closetarget[2]), parseInt(closetarget[3]), parseInt(closetarget[4]), parseInt(closetarget[5]));
			};
		};
	};
};