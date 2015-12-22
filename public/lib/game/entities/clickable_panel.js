ig.module( 
	'game.entities.clickable_panel'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity',
	'game.entities.clickable_entity'
)
.defines(function(){

	panel = ig.Entity.extend({
		zIndex: 10,

		draw: function() {
			ig.system.context.fillStyle = "rgb(0,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(0,0,200,400);
	        ig.system.context.closePath();
	        ig.system.context.fill();	
	},
	
	});
	avatar = ig.Entity.extend({
		zIndex: 15,
		alpha:0.1,

		pic: new ig.Image('media/avatar.png'),
		draw: function() {

    		ig.system.context.globalAlpha = this.alpha;
			ig.system.context.fillStyle = "rgb(256,256,256)";//"rgb(136,28,28)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(this.pos.x,this.pos.y,85,85);
	        ig.system.context.closePath();
	        ig.system.context.fill();
	        ig.system.context.alpha = 0.25;
    		ig.system.context.globalAlpha = 1;

			this.pic.draw(this.pos.x+5, this.pos.y+5);
		},
		update: function(){

		}
	});



	upgrade_player_attack = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 100, y: 20},
		build_error: new ig.Sound('media/sound/build_error.*'),
		build_success: new ig.Sound('media/sound/build_success.*'),
		draw: function() {
			ig.game.font.draw( "upgrade attack",110,165);
			this.pos.x = 110+ig.game._rscreen.x;
			this.pos.y = 165+ig.game._rscreen.y;
		},
		clicked: function() {
			if (ig.game.energy - ig.game.player.cattack >=0){
			console.log("clicked upgrade attack");
			ig.game.player.attack_power +=1*ig.game.player.classbio;
			ig.game.energy -= ig.game.player.cattack;
			this.build_success.play();
			}
			else{
				this.build_error.play();
			}

		}
	});
	upgrade_player_defence = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 100, y: 20},
		build_error: new ig.Sound('media/sound/build_error.*'),
		build_success: new ig.Sound('media/sound/build_success.*'),
		draw: function() {
			ig.game.font.draw( "upgrade defence",110, 215);
			this.pos.x = 110+ig.game._rscreen.x;
			this.pos.y = 215+ig.game._rscreen.y;
		},
		clicked: function() {
			if (ig.game.energy - ig.game.player.cdefence >=0){
			console.log("clicked upgrade defencce");
			ig.game.player.defence_power +=1;
			ig.game.energy -= ig.game.player.cdefence;
			this.build_success.play();
			}
			else{
				this.build_error.play();
			}

		}
	});
	upgrade_player_health = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 100, y: 20},
		build_error: new ig.Sound('media/sound/build_error.*'),
		build_success: new ig.Sound('media/sound/build_success.*'),
		draw: function() {
			ig.game.font.draw( "upgrade health",10, 165);
			this.pos.x = 10+ig.game._rscreen.x;
			this.pos.y = 165+ig.game._rscreen.y;
		},
		clicked: function() {
			if (ig.game.energy - ig.game.player.chealth >=0){
			console.log("clicked upgrade health");
			ig.game.player.health +=10*ig.game.player.classath;
			ig.game.player.maxhealth +=10*ig.game.player.classath;
			ig.game.energy -= ig.game.player.chealth;
			this.build_success.play();
			}
			else{
				this.build_error.play();
			}

		}
	});	
	upgrade_player_regen = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 100, y: 20},
		build_error: new ig.Sound('media/sound/build_error.*'),
		build_success: new ig.Sound('media/sound/build_success.*'),
		draw: function() {
			ig.game.font.draw( "upgrade regen",10, 215);
			this.pos.x = 10+ig.game._rscreen.x;
			this.pos.y = 215+ig.game._rscreen.y;
		},
		clicked: function() {
			if (ig.game.energy - ig.game.player.cregen >=0){
			console.log("clicked upgrade regen");
			ig.game.player.regen_power +=1;
			ig.game.energy -= ig.game.player.cregen;
			this.build_success.play();
			}
			else{
				this.build_error.play();
			}

		}
	});
	upgrade_tower_attack = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 100, y: 20},
		build_error: new ig.Sound('media/sound/build_error.*'),
		build_success: new ig.Sound('media/sound/build_success.*'),
		draw: function() {
			ig.game.font.draw( "upgrade attack",10, 300);
			this.pos.x = 10+ig.game._rscreen.x;
			this.pos.y = 300+ig.game._rscreen.y;
		},
		clicked: function() {
			if (ig.game.energy - towers[pos].cattack >=0){
				towers = ig.game.getEntitiesByType('EntityClickable_towers');
				tower_id = ig.game.selectedtower;
				pos = tower_id;
				for(var i=0; i<towers.length; i++) {
					if(towers[i].id == tower_id) {
						pos = i;
						towers[pos].attack_power +=2;
						ig.game.energy -= towers[pos].cattack;
						this.build_success.play();
						console.log("clicked upgrade attac");
						break;
					}
				}
			}
			else{
				this.build_error.play();
			}

		}
	});
	upgrade_tower_health = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 100, y: 20},
		build_error: new ig.Sound('media/sound/build_error.*'),
		build_success: new ig.Sound('media/sound/build_success.*'),
		draw: function() {
			ig.game.font.draw( "upgrade health",110, 300);
			this.pos.x = 110+ig.game._rscreen.x;
			this.pos.y = 300+ig.game._rscreen.y;
		},
		clicked: function() {

			if (ig.game.energy - towers[pos].chealth >=0){
				towers = ig.game.getEntitiesByType('EntityClickable_towers');
				tower_id = ig.game.selectedtower;
				pos = tower_id;
				for(var i=0; i<towers.length; i++) {
					if(towers[i].id == tower_id) {
						pos = i;
						towers[pos].health +=50;
						towers[pos].maxhealth +=50;
						ig.game.energy -= towers[pos].chealth;
						this.build_success.play();
						console.log("clicked upgrade health");

						ig.game.spawnnow(towers[pos].pos.x, towers[pos].pos.y);
						break;
					}
				}
			}
			else{
				this.build_error.play();
			}


		}
	});



});