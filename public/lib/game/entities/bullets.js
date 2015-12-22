ig.module( 
	'game.entities.bullets'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity',
	'game.entities.monster'
)
.defines(function(){

bullets = ig.Entity.extend({
	zIndex:9,
	damage: 1,

	soundTimer: new ig.Timer(0.5),

	font: new ig.Font('media/font/04b03.font.png'),
	animSheet: new ig.AnimationSheet('media/bullets_shrinked.png',  20,20),
	offset: {x:5, y:5},
	size: {x:15, y:15},

 	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A, // this gets called

	collides : ig.Entity.COLLIDES.ACTIVE,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

        this.addAnim('default', 0.1, [2,11,3,15,9,10,11], false);
		this.currentAnim = this.anims.default;
	},
	
	update: function() {
			if(this.pos.x < 215 || this.pos.x >1170|| this.pos.y <15 || this.pos.y> 585){
				this.kill();
		}
			this.parent();
	},
	updateAnims: function() {
		flipped = this.currentAnim.flip.x;
		if(this.vel.x < 15) {
			flipped = false;
		}
		else if(this.vel.x < -15) {
			flipped = true;
		}
		
		this.currentAnim.flip.x = flipped;
	},
	check: function(other) {
		if(other instanceof monster) {
			//this.collect.play();
			other.health -=this.damage;
			ig.game.score += 10;
			this.kill();
		}
	},
	handleMovementTrace: function( res ) {
    // This completely ignores the trace result (res) and always
    // moves the entity according to its velocity
    this.pos.x += this.vel.x * ig.system.tick;
    this.pos.y += this.vel.y * ig.system.tick;
	}
});

shoot_balls = ig.Entity.extend({
	zIndex:9,
	font: new ig.Font('media/font/04b03.font.png'),
	animSheet: new ig.AnimationSheet('media/bullets_balls.png',  20,20),

	soundTimer: new ig.Timer(0.5),
	spinTimer: new ig.Timer(0.1),

	offset: {x:5, y:5},
	size: {x:15, y:15},

 	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A, // this gets called

	collides : ig.Entity.COLLIDES.ACTIVE,

	damage: 1,
	attack_level:0,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.attack_level = this.damage%9;

        this.addAnim('default', 0.1, [this.attack_level], false);
		this.currentAnim = this.anims.default;
	},
	
	update: function() {
		if(this.pos.x < 215 || this.pos.x >1170|| this.pos.y <15 || this.pos.y> 585){
				this.kill();
		}
		if (this.spinTimer.delta() >=0){
			this.updateAnims();
			this.spinTimer.reset();
		}

			this.parent();
	},
	updateAnims: function() {
		flipped = this.currentAnim.flip.x;
		if(flipped != false) { 
			flipped = false;
		}
		else {
			if (this.vel.x <0){
			 this.currentAnim.angle = 45;

				if (this.vel.y <0){
				 this.currentAnim.angle = 45+90;
				}
			}
			if(this.vel.x >0){
			 this.currentAnim.angle = 45+180;

			 	if (this.vel.y >0){
				 this.currentAnim.angle = 45+90+180;
				}
			}
			flipped = true;
		}
		this.currentAnim.flip.x = flipped;
	},
	check: function(other) {
		if(other instanceof monster) {
			//this.collect.play();
			other.health -=this.damage;
			ig.game.score += 10;
			this.kill();
		}
	},
	handleMovementTrace: function( res ) {
    // This completely ignores the trace result (res) and always
    // moves the entity according to its velocity
    this.pos.x += this.vel.x * ig.system.tick;
    this.pos.y += this.vel.y * ig.system.tick;
	}
});
	

shoot_chems = ig.Entity.extend({
	zIndex:9,
	font: new ig.Font('media/font/04b03.font.png'),
	animSheet: new ig.AnimationSheet('media/bullets_chem.png',  20,37),

	soundTimer: new ig.Timer(0.5),
	spinTimer: new ig.Timer(0.1),

	offset: {x:0, y:10},
	size: {x:20, y:20},

 	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A, // this gets called

	collides : ig.Entity.COLLIDES.ACTIVE,

	damage: 1,
	attack_level:0,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.attack_level = (1+this.damage/1.5)%5;

        this.addAnim('default', 0.1, [this.attack_level], false);
		this.currentAnim = this.anims.default;
	},
	
	update: function() {
		if(this.pos.x < 215 || this.pos.x >1170|| this.pos.y <15 || this.pos.y> 585){
				this.kill();
		}
		if (this.spinTimer.delta() >=0){
			this.updateAnims();
			this.spinTimer.reset();
		}

			this.parent();
	},
	updateAnims: function() {
		flipped = this.currentAnim.flip.x;
		if(flipped != false) { 
			flipped = false;
		}
		else {
			if (this.vel.x <0){
			 this.currentAnim.angle = 45;

				if (this.vel.y <0){
				 this.currentAnim.angle = 45+90;
				}
			}
			if(this.vel.x >0){
			 this.currentAnim.angle = 45+180;

			 	if (this.vel.y >0){
				 this.currentAnim.angle = 45+90+180;
				}
			}
			flipped = true;
		}
		this.currentAnim.flip.x = flipped;
	},
	check: function(other) {
		if(other instanceof monster) {
			//this.collect.play();
			other.health -=this.damage;
			ig.game.score += 10;
			this.kill();
		}
	},
	handleMovementTrace: function( res ) {
    // This completely ignores the trace result (res) and always
    // moves the entity according to its velocity
    this.pos.x += this.vel.x * ig.system.tick;
    this.pos.y += this.vel.y * ig.system.tick;
	}
});


shoot_codes = ig.Entity.extend({
	zIndex:9,

	font: new ig.Font('media/font/04b03.font.png'),
	animSheet: new ig.AnimationSheet('media/bullets_code.png',  40,30),
	soundTimer: new ig.Timer(0.5),
	spinTimer: new ig.Timer(0.1),

	offset: {x:0, y:1},
	size: {x:15, y:15},

 	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A, // this gets called

	collides : ig.Entity.COLLIDES.ACTIVE,

	damage: 1,
	attack_level:0,

	init: function(x, y, settings) {
		this.parent(x, y, settings);

		this.attack_level = this.damage%24;

        this.addAnim('default', 0.1, [this.attack_level], false);
		this.currentAnim = this.anims.default;
	},
	
	update: function() {
		if(this.pos.x < 215 || this.pos.x >1170|| this.pos.y <15 || this.pos.y> 585){
				this.kill();
		}
		if (this.spinTimer.delta() >=0){
			this.updateAnims();
			this.spinTimer.reset();
		}
			this.parent();
	},
	updateAnims: function() {
		flipped = this.currentAnim.flip.x;
		if(flipped != false) {
			flipped = false;
		}
		else {
			flipped = true;
		}
		this.currentAnim.flip.x = flipped;
	},
	check: function(other) {
		if(other instanceof monster) {
			//this.collect.play();
			other.health -=this.damage;
			ig.game.score += 10;
			this.kill();
		}
	},
	handleMovementTrace: function( res ) {
    // This completely ignores the trace result (res) and always
    // moves the entity according to its velocity
    this.pos.x += this.vel.x * ig.system.tick;
    this.pos.y += this.vel.y * ig.system.tick;
	}
});

});