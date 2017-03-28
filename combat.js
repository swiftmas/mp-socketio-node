var globals = require('./globals.js');
var coredata = globals.coredata;
var collmap = globals.collmap;
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
};

function bombcontroller(){
    db = coredata.bombs;
    for (var bomb = 0; bomb < db.length; bomb++){
      if (db[bomb].state < -1){ db.splice(bomb, 1); break};
      db[bomb].state -= 1;
      console.log(db[bomb].state)
      if (db[bomb].state < 1){
        explode(bomb);
      };
    }
}

function attack(attacker, npcsORplayers){
    // second argument, npc or player is the attribute of the attacker, not whats being attacked.
    console.log(attacker + " placed bomb");
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
    if (collmap[atpos] !== 1) {
      coredata.bombs.push({"pos": atpos, "state": "28", "owner": attacker});
    };

};

function explode(bomb) {
    var radius = 4;
    dbomb = coredata.bombs[bomb];
    posx = parseInt(dbomb.pos.split(".")[0]);
    posy = parseInt(dbomb.pos.split(".")[1]);
    console.log("boom @ " + dbomb.pos, posx, posy)
    dodamage(dbomb.pos)
    //x
      //left
      for (var x = posx -1; x >= posx-radius; x--){
        var atpos = x + "." + posy
        if (collmap[atpos] !== 1){
          dodamage(atpos);
        } else {
          break;
        };
      };
      //right
      for (var x = posx + 1 ; x <= posx + radius; x++) {
        atpos = x + "." + posy
        if (collmap[atpos] !== 1){
          dodamage(atpos);
        } else {
          break;
        };
      };
    //y
      //up
      for (var y = posy -1; y >= posy-radius; y--){
        var atpos = posx + "." + y
        if (collmap[atpos] !== 1){
          dodamage(atpos);
        } else {
          break;
        };
      };
      //down
      for (var y = posy + 1 ; y <= posy + radius; y++) {
        atpos = posx + "." + y
        if (collmap[atpos] !== 1){
          dodamage(atpos);
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
