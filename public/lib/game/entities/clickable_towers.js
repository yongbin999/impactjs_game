ig.module( 
	'game.entities.clickable_towers'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity',
	'game.entities.clickable_entity',
	'game.entities.bullets'
)
.defines(function(){

	EntityClickable_towers = ClickableEntity.extend({

		animSheet: new ig.AnimationSheet('media/umass_library_mini.png', 65, 100),
		attackTimer: new ig.Timer(0.5),
		regenTimer: new ig.Timer(0.5),
		font: new ig.Font('media/font/04b03.font.png'),
		red_subheaderfont: new ig.Font('media/font/red_subheader.font.png'),

		sound: new ig.Sound('media/sound/attack_book.*'),
		offset:{x:0,y:20},
		size: {x: 60, y: 70},

		health: 0,
		maxhealth: 100,
		attack_power: 1,
		defence_power: 1,
		regen_power: 1,

		cattack: 1,
		chealth: 1,
		cregen: 1,

		scale: 40,


		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('default', 1, [0], true);
        	this.addAnim('selected', 1, [1], true);
		
			this.currentAnim = this.anims.default;
		},
		clicked: function() {
			ig.game.selecteditem = true;
			ig.game.selectedtower = this.id;
			this.currentAnim = this.anims.selected;
			console.log("selected tower");
		},
		update: function() {
			this.parent();
			this.checkMouse();

			this.find_attack();
			this.cattack= this.attack_power*200*ig.game.player.costfactor;
			this.chealth= this.maxhealth*1.5*ig.game.player.costfactor;
			
				if (this.health>0 && this.health<=this.maxhealth){
					this.health +=(this.maxhealth-this.health) * this.regen_power/100;
					this.regenTimer.reset();
				}
			
		},

		checkMouse: function() {
			if(ig.input.pressed('click')) {
				if( ((ig.input.mouse.x +ig.game.screen.x) >= this.pos.x) &&
					((ig.input.mouse.x +ig.game.screen.x)<= (this.pos.x + this.size.x)) &&
					((ig.input.mouse.y +ig.game.screen.y)>= this.pos.y) &&
					((ig.input.mouse.y +ig.game.screen.y)<= (this.pos.y + this.size.y)))
				{
					this.clicked();
				}
			}
		},

		draw: function() {

			//cheange to not select
			if (ig.game.selectedtower != this.id){
				this.currentAnim = this.anims.default;
			}
			// stay on the map layer
			if( this.currentAnim ) {
			this.currentAnim.draw(
				this.pos.x - this.offset.x - ig.game._rscreen.x,
				this.pos.y - this.offset.y - ig.game._rscreen.y
			);

			var xpos = this.pos.x- ig.game._rscreen.x + 15;
			var ypos = this.pos.y- ig.game._rscreen.y 

	        ig.system.context.fillStyle = "rgb(0,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(xpos-2.5,ypos-2.5,
	        						 this.scale+5, this.scale/10+5);
	        ig.system.context.closePath();
	        ig.system.context.fill(); 

			//full green
			ig.system.context.fillStyle = "rgb(192,192,192)";
	        ig.system.context.lineWidth = 3;
	        ig.system.context.beginPath();
	        ig.system.context.rect(xpos, ypos,
	        						this.scale, this.scale/10);
	        ig.system.context.closePath();
	        ig.system.context.fill();      
	                
	        //current red
	        ig.system.context.fillStyle = "rgb(255,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(xpos,ypos,
	        						 this.health/this.maxhealth*this.scale, this.scale/10);
	        ig.system.context.closePath();
	        ig.system.context.fill();	

	        if (this.health <=0){
			this.red_subheaderfont.draw( "buy",xpos,ypos-25,ig.Font.ALIGN.center );
			this.red_subheaderfont.draw( "health",xpos-15,ypos-0,ig.Font.ALIGN.center );
	        }
	        
	        this.font.draw( Math.round(this.health) + "/"+ Math.round(this.maxhealth),
	        						 xpos,ypos, ig.Font.ALIGN.Left );
	    	
		}
	},

	findNearestEntity: function() {
    var nearestDistance = Infinity;
    var nearestEntity = null;
    var ent = ig.game.getEntitiesByType('monster');
    for( var i = 0; i < ent.length; i++ ) {
        var distance = this.distanceTo( ent[i] );
        if( distance < nearestDistance ) {
            nearestDistance = distance;
	            nearestEntity = ent[i];
        }
    }
    return nearestEntity;
	},

	find_attack: function() {
		var vector = [0,0];
		var monster =  this.findNearestEntity();

		if (monster !== null){
			if ((this.health>0)&&(this.attackTimer.delta() >=0)&&(this.distanceTo(monster)<=150) ){
				angle = this.angleTo(monster);
				magnitude = 300;
				vector[0] = magnitude * Math.cos(angle);
				vector[1] = magnitude * Math.sin(angle);

				var settings = {damage: this.attack_power ,vel: {x: vector[0], y: vector[1]}};
				ig.game.spawnEntity(bullets, this.pos.x+15, this.pos.y, settings);
				this.attackTimer.reset();
				this.sound.play();
			}
		}
	},
	});


});