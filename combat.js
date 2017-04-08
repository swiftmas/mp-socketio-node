var globals = require('./globals.js');
var coredata = globals.coredata;
var collmap = globals.collmap;
var mapchange = globals.mapchange;
var attackQueue = globals.attackQueue;

///// Exports ///////////////////////////
module.exports = {
  bombcontroller: function () {
    bombcontroller();
  },
  attack: function (attacker, dir) {
    attack(attacker, dir);
  },
  explode: function (bombNumber) {
    explode(bombNumber);
  },
  processBombs: function () {
    processBombs();
  },
};

function bombcontroller(){
    db = coredata.bombs;
    removes = [];
    for (var bomb = 0; bomb < db.length; bomb++){
      if (db[bomb].state < -1){ removes.push(bomb); break};
      db[bomb].state -= 1;
      if (db[bomb].state < 1){
        explode(bomb);
      };
    };
    for (var bomb in removes){
      db.splice(bomb, 1)
    }
}

function processBombs(){
  for (var inst in attackQueue){
    attack(attackQueue[inst][0], attackQueue[inst][1])
    delete attackQueue[inst];
  }
  //attackQueue = {};
}

function attack(attacker, npcsORplayers){
    // second argument, npc or player is the attribute of the attacker, not whats being attacked.
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
    if (collmap[atpos] == 0) {
      for (var bomb = coredata.bombs.length -1; bomb >= 0; bomb--){
        if (coredata.bombs[bomb].pos == atpos){
          return;
        }
      };

      coredata.bombs.push({"pos": atpos, "state": "20", "owner": attacker});
      console.log(attacker + " placed bomb");

    };

};

function explode(bomb) {
    var radius = 4;
    dbomb = coredata.bombs[bomb];
    posx = parseInt(dbomb.pos.split(".")[0]);
    posy = parseInt(dbomb.pos.split(".")[1]);
    console.log("boom @ " + dbomb.pos, posx, posy)
    dodamage(dbomb.pos)
    bombAffect = [];
    //x
      //left
      for (var lx = posx -1; lx >= posx-radius; lx--){
        var atpos = lx + "." + posy
        if (collmap[atpos] !== 1){
          if (collmap[atpos] > 1){
            collmap[atpos] = 0;
            mapchange = true;
            break;
          } else {
            dodamage(atpos);
          };
          if (lx !== posx - 3){
            coredata.effects.push([atpos, "yellow"]);
          } else {coredata.effects.push([atpos, "orange"]);};
        } else {
          break;
        };
      };
      //right
      for (var rx = posx + 1 ; rx <= posx + radius; rx++) {
        atpos = rx + "." + posy
        if (collmap[atpos] !== 1){
          if (collmap[atpos] == 2){
            collmap[atpos] = 0;
            mapchange = true;
            break;
          } else {
            dodamage(atpos);
          };
          if (rx !== posx + 3){
            coredata.effects.push([atpos, "yellow"]);
          } else {coredata.effects.push([atpos, "orange"]);};
        } else {
          break;
        };
      };
    //y
      //up
      for (var uy = posy -1; uy >= posy-radius; uy--){
        var atpos = posx + "." + uy
        if (collmap[atpos] !== 1){
          if (collmap[atpos] == 2){
            collmap[atpos] = 0;
            mapchange = true;
            break;
          } else {
            dodamage(atpos);
          };
          if (uy !== posy - 3){
            coredata.effects.push([atpos, "yellow"]);
          } else {coredata.effects.push([atpos, "orange"]);};
        } else {
          break;
        };
      };
      //down
      for (var dy = posy + 1 ; dy <= posy + radius; dy++) {
        atpos = posx + "." + dy
        if (collmap[atpos] !== 1){
          if (collmap[atpos] == 2){
            collmap[atpos] = 0;
            mapchange = true;
            break;
          } else {
            dodamage(atpos);
          };
          if (dy !== posy + 3){
            coredata.effects.push([atpos, "yellow"]);
          } else {coredata.effects.push([atpos, "orange"]);};
        } else {
          break;
        };
      };
};

function dodamage(atpos){
  db = coredata.players;
  damage = 100;
  for (var key in db){
    if (db.hasOwnProperty(key)) {
      if (db[key].pos == atpos) {
        db[key].health = db[key].health - damage;
        if (db[key].health <= 0){
          db[key].pos = db[key].origin;
          db[key].health = 100;
          console.log(db[key], ' killed at ', atpos)
        };
      } ;
    };
  };


  db = coredata.npcs;
  for (var key in db){
    if (db.hasOwnProperty(key)) {
      if (db[key].pos == atpos){
        db[key].health = db[key].health - damage;
        if (db[key].health <= 0){
          db[key].state = "dead";
          console.log(db[key], ' killed at ', atpos)
        };
      }
    };
  };
};
