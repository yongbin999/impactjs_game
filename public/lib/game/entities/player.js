ig.module( 
	'game.entities.player'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity',
	'game.entities.clickable_entity',
	'game.entities.bullets'

)
.defines(function(){

EntityPlayer = ClickableEntity.extend({
	zIndex:10,
	
	font: new ig.Font('media/font/04b03.font.png'),
	animSheet: new ig.AnimationSheet('media/MotherXP_Hero.png',  768/16,512/8),
	offset: {x:5, y:15},
	size: {x:35, y:45},
	maxVel: {x: 200, y:200},

	attackTimer: new ig.Timer(0.5),

	health: 80,
	maxhealth: 100,
	attack_power: 1,
	defence_power: 1,
	regen_power: 1,

	cattack: 1,
	cdefence: 1,
	chealth: 1,
	cregen: 1,
	
	costfactor:1,
	classath:1,
	classbio:1,
	classcs:1,
	scale:0, //12,8,0


	//movement
	target: {x: 100, y: 100},

	
	init: function(x, y, settings) {
		this.parent(x, y, settings);
        if(ig.game.playclass=='ATH'){
        	this.maxhealth *=1.5;
        	this.classath = 1.5;
        	this.scale = 12;
        }
        else if(ig.game.playclass=='BIO'){
        	this.attack_power *=1.5;
        	this.classbio = 1.5;
        	this.scale = 8;
        } 
        else if(ig.game.playclass=='CS'){
        	this.costfactor =0.75;
        	this.scale = 0;
        }
        
        this.addAnim('idle', 1, [0+this.scale], true);
        this.addAnim('movedown', 0.25, [0+this.scale, 1+this.scale, 2+this.scale, 3+this.scale], false);
        this.addAnim('moveleft', 0.25, [16+this.scale, 17+this.scale, 18+this.scale, 19+this.scale], false);
        this.addAnim('moveright', 0.25, [32+this.scale, 33+this.scale, 34+this.scale, 35+this.scale], false);
        this.addAnim('moveup', 0.25, [48+this.scale, 49+this.scale, 50+this.scale, 51+this.scale], false);
		

		this.currentAnim = this.anims.idle;
	},
	
	update: function() {
		this.checkMouse();
		this.goto_target();
		this.find_attack();
		this.updateAnims();

		this.cattack= this.attack_power*50*this.costfactor;
		this.cdefence= this.defence_power*100*this.costfactor;
		this.chealth= this.maxhealth*0.75*this.costfactor;
		this.cregen= this.regen_power*200*this.costfactor;
	
		this.health +=this.regen_power*(this.maxhealth-this.health)/100;



		if (this.attackTimer.delta() >= 0){

		}


		if (this.health <= 0){
			this.kill();
			ig.game.state = ig.game.GAME_OVER;
			ig.game.starting = 'lose';
			console.log("lose");
		}
		this.parent();
	},

	checkMouse: function() {
		//fill me in!

		if (this.currentAnim == this.anims.idle){
		var horizontal = ig.input.mouse.x - this.pos.x;
		var vertical = ig.input.mouse.y - this.pos.y;

		var center = this.getCenter();
		var angle = Math.atan2(center.y - ig.input.mouse.y - ig.game.screen.y,
			center.x - ig.input.mouse.x - ig.game.screen.x);

		//turn 360 deleted
		}		

		//if not clicked on  abuilding 
		if(ig.input.mouse.x >190 && (ig.input.pressed('click') ||ig.input.state('click'))){

			if (ig.game.selecteditem !=true){
				this.target = this.gettarget();
				this.goto_target();
			}

		}
	},

	goto_target: function(){
		if ((this.pos != this.target) && (this.target.x >175)){
			this.vel.y = (this.target.y -this.getCenter().y) * 5;
			this.vel.x = (this.target.x -this.getCenter().x) * 5;
		}

	},

	gettarget: function() {
		return {x: ig.input.mouse.x+ig.game.screen.x, y: ig.input.mouse.y+ig.game.screen.y};
	},

	getCenter: function() {
		return {x: this.pos.x + this.size.x / 2, y: this.pos.y + this.size.y / 2};
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
			if ((this.attackTimer.delta() >=0)&&(this.distanceTo(monster)<=200) ){
				//angle = this.angleTo(monster);
				magnitude = 300;
				angle = Math.atan2(monster.pos.y-this.getCenter().y ,monster.pos.x-this.getCenter().x )
				vector[0] = magnitude * Math.cos(angle);
				vector[1] = magnitude * Math.sin(angle);

				var settings = {damage: this.attack_power ,vel: {x: vector[0], y: vector[1]}};

				if (ig.game.playclass =='ATH'){
					ig.game.spawnEntity(shoot_balls, this.getCenter().x, this.getCenter().y, settings);
				}
				else if (ig.game.playclass =='BIO'){
					ig.game.spawnEntity(shoot_chems, this.getCenter().x, this.getCenter().y, settings);
				}
				else if (ig.game.playclass =='CS'){
					ig.game.spawnEntity(shoot_codes, this.getCenter().x, this.getCenter().y, settings);
				}
				this.attackTimer.reset();
			}
		}
	},

	updateAnims: function() {
		flipped = this.currentAnim.flip.x;
		
		if(this.vel.x > 5 && Math.abs(this.vel.y) < 15) {
			this.currentAnim = this.anims.moveright;
			//flipped = false;
		}
		else if(this.vel.x < -5 && this.vel.y > 15) {
			this.currentAnim = this.anims.moveleft;
			//flipped = false;
		}
		else if(this.vel.y < -5) {
			this.currentAnim = this.anims.moveup;
			//flipped = true;
		}
		else if( this.vel.y > 5) {
			this.currentAnim = this.anims.movedown;
			//flipped = true;
		}
		else
			this.currentAnim = this.anims.idle;
			
		this.currentAnim.flip.x = flipped;
	},
	
	draw: function() {
		for(var i = 0; i < this.health; i++) {
			var center = this.getCenter();

	        //border black
	        ig.system.context.fillStyle = "rgb(0,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(center.x- ig.game._rscreen.x-42,
	        						 center.y -ig.game._rscreen.y-42,
	        						 79, 14);
	        ig.system.context.closePath();
	        ig.system.context.fill(); 

			ig.system.context.fillStyle = "rgb(192,192,192)";
	        ig.system.context.lineWidth = 3;
	        ig.system.context.beginPath();
	        ig.system.context.rect(center.x-ig.game._rscreen.x-40, 
	        						center.y-ig.game._rscreen.y-40,
	        						75, 10);
	        ig.system.context.closePath();
	        ig.system.context.fill();      
	                
	        //current red
	        ig.system.context.fillStyle = "rgb(255,0,0)";
	        ig.system.context.beginPath();
	        ig.system.context.rect(center.x- ig.game._rscreen.x-40,
	        						 center.y -ig.game._rscreen.y-40,
	        						 this.health/this.maxhealth*75, 10);
	        ig.system.context.closePath();
	        ig.system.context.fill();	

	        /*
	        this.font.draw( "Health: "+Math.round(this.health) + "/"+ this.maxhealth,
	        						 center.x- ig.game._rscreen.x-40,
	        						 center.y -ig.game._rscreen.y-40+2.5,
	        						  ig.Font.ALIGN.Left );
	       	*/
		}
		this.parent();
	},
});

});