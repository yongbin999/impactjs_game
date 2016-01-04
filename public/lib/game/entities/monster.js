ig.module( 
	'game.entities.monster'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity',
	'game.entities.clickable_entity'

)
.defines(function(){

monster = ClickableEntity.extend({
	zIndex:1,

	maxhealth: 10,		
	health: 10,
	damage: 0.1,

	type: ig.Entity.TYPE.A,
	collides : ig.Entity.COLLIDES.ACTIVE,

	sound: new ig.Sound('media/sound/monster_hit.*'),
	under_attack: new ig.Sound('media/sound/under_attack.*'),
	font: new ig.Font('media/font/04b03.font.png'),
	animSheet: new ig.AnimationSheet('media/lilyeti.png',  50,50),


	soundTimer: new ig.Timer(0.5),
	under_attackTimer: new ig.Timer(10),

	attackTimer: new ig.Timer(0.5),
	selectedTimer: new ig.Timer(2),
	select_id: -1,

	target: {x: 100, y: 100},

	offset: {x:0, y:0},
	size: {x:50, y:50},
	maxVel: {x: 100, y:100},

	init: function(x, y, settings) {
		this.parent(x, y, settings);

        this.addAnim('idle', 0.1, [0,1,2,3,4,5,6,7,8,9,10,11], true);
        this.addAnim('moving', 0.1, [16,17,18,19,20,21,22,23], false);
        this.addAnim('attacking', 0.25, [24,25,26,27], false);
        this.addAnim('select', 0.1, [32,33,34,35], false);
        this.addAnim('die', 0.1, [32,33,34,35,36,37,38,39], false);
        
        this.maxhealth= 10+Math.round(Math.random()*ig.game.difficulty);
		this.health= this.maxhealth;
		this.currentAnim = this.anims.idle;
	},
	reset: function( x, y, settings ) {
        // This function is called when an instance of this class is
        // resurrected from the entity pool.
        // The parent implementation of reset() will reset the .pos to 
        // the given x, y and will reset the .vel, .accel, .health and 
        // some other properties.
        this.parent( x, y, settings );
        
        // Play the shoot sound again. Remember, init() is never called 
        // when the entity is revived from the pool.
        this.maxhealth= 10+Math.round(Math.random()*ig.game.difficulty);
		this.health= this.maxhealth;
    },
	
	update: function() {
		this.detecttarget();
		this.updateAnims();
		this.damage=  ig.game.difficulty;
		//select monster stun
		if (this.select_id != -1  && this.selectedTimer.delta() >=0) {
			this.selectedTimer.reset();
		}
		else if (this.selectedTimer.delta() >=-0.1 && this.selectedTimer.delta() <=0){
			this.select_id = -1;
		}

		if (this.health <=0){

			this.kill();
			//ig.game.spawnEntity(EntityPickup, this.pos.x, this.pos.y)
			ig.game.tealfont.draw(' + ' +ig.game.difficulty*3, this.pos.x, this.pos.y);
			ig.game.currentmonstercount -=1;
			ig.game.kills +=1;
			ig.game.score += ig.game.difficulty*10;
			ig.game.energy += ig.game.difficulty*3;
		}

		this.parent();
	},

	draw: function() {
			this.currentAnim.draw(
				this.pos.x - this.offset.x - ig.game._rscreen.x,
				this.pos.y - this.offset.y - ig.game._rscreen.y
			);

		for(var i = 0; i < this.health; i++) {

	        //border black
	        ig.system.context.fillStyle = "rgb(0,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(this.pos.x- ig.game._rscreen.x-2,
	        						 this.pos.y -ig.game._rscreen.y-2,
	        						 54, 11);
	        ig.system.context.closePath();
	        ig.system.context.fill(); 

			ig.system.context.fillStyle = "rgb(192,192,192)";
	        ig.system.context.lineWidth = 3;
	        ig.system.context.beginPath();
	        ig.system.context.rect(this.pos.x-ig.game._rscreen.x, 
	        						this.pos.y-ig.game._rscreen.y,
	        						50, 7);
	        ig.system.context.closePath();
	        ig.system.context.fill();      
	                
	        //current red
	        ig.system.context.fillStyle = "rgb(255,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(this.pos.x- ig.game._rscreen.x,
	        						 this.pos.y -ig.game._rscreen.y,
	        						 this.health/this.maxhealth*50, 7);
	        ig.system.context.closePath();
	        ig.system.context.fill();	


	        this.font.draw( "HP: "+this.health + "/"+ this.maxhealth,
	        						 this.pos.x- ig.game._rscreen.x,
	        						 this.pos.y -ig.game._rscreen.y+2.5,
	        						  ig.Font.ALIGN.Left );
		}
		this.parent();
	},
	detecttarget: function() {
		//fill this method in

		var player =  ig.game.getEntitiesByType('EntityPlayer');
		var towers =  ig.game.getEntitiesByType('EntityClickable_towers');
		if ( this.id == this.select_id  && this.selectedTimer.delta() <=0 ) {

			this.currentAnim = this.anims.select;
		}
		else{

			//find player near
			r = this.distanceTo(player[0]);
			angle = this.angleTo(player[0]);
			magnitude = r

			//attack player
			if ((r <50)){
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.attacking;
				var dam_afterdefence = this.damage - ig.game.player.defence_power;
				if (dam_afterdefence <0){
					dam_afterdefence = this.damage /ig.game.player.defence_power;
				}
				if ((this.attackTimer.delta()>=0)){
				player[0].health-= dam_afterdefence;
				this.attackTimer.reset();
				}

				if ( this.soundTimer.delta() >=0 ) {
					this.sound.play();
					this.soundTimer.reset();
				}
			}
			//followers
			else if (r <175){
				horizontal = magnitude * Math.cos(angle);
				vertical = magnitude * Math.sin(angle);
				this.vel.x = horizontal;
				this.vel.y = vertical;
				this.currentAnim = this.anims.moving;
			}
			//stops where too far
			else if (r >150){
				this.vel.x = 0;
				this.vel.y = 0;
				this.currentAnim = this.anims.idle;
			}


		//find towers
		for (var j = 0; j <towers.length ;j++){
			//only attack active towers
			if (towers[j].health >0){
				r = this.distanceTo(towers[j]);
				angle = this.angleTo(towers[j]);
				magnitude = r

				if ((r <50)){
					this.vel.x = 0;
					this.vel.y = 0;
					this.currentAnim = this.anims.attacking;

					if ((this.attackTimer.delta()>=0)){
						towers[j].health-= this.damage;
						this.sound.play();
						this.attackTimer.reset();
					}
					if ((this.under_attackTimer.delta()>=0)){
						this.under_attack.play();
						this.under_attackTimer.reset();
					}
				}
				else if (r <150){
					horizontal = magnitude * Math.cos(angle);
					vertical = magnitude * Math.sin(angle);
					this.vel.x = horizontal;
					this.vel.y = vertical;
					this.currentAnim = this.anims.moving;
				}
			}
		}

	}
},

	getCenter: function() {
		return {x: this.pos.x + this.size.x / 2, y: this.pos.y + this.size.y / 2};
	},

	updateAnims: function() {
		flipped = this.currentAnim.flip.x;
		
		player = ig.game.getEntitiesByType('EntityPlayer');
		angle = this.angleTo(player[0]);
		//console.log(angle*90)

		if( Math.abs(angle*90) <90) 
			flipped = true;
		else
			flipped = false;
			
		this.currentAnim.flip.x = flipped;
	},
	clicked: function(){
			ig.game.selecteditem = true;
			this.select_id =this.id;
			console.log("selected monster" + this.id);
	}
	
	


});
	

});