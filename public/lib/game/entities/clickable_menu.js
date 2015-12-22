ig.module( 
	'game.entities.clickable_menu'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity',
	'game.entities.clickable_entity'
)
.defines(function(){

	StartCompsci = ClickableEntity.extend({
		size: {x: 225, y: 100},
		draw: function() {
			ig.game.blue_subheaderfont.draw( "Comp sci",this.pos.x+125,this.pos.y,ig.Font.ALIGN.CENTER);
			ig.game.blue_subheaderfont.draw( "-25% upgrade cost",this.pos.x+125,this.pos.y+25,ig.Font.ALIGN.CENTER);
		},
		clicked: function() {
			ig.game.starting ='start';
			ig.game.playclass = 'CS';
			//
			console.log("clicked start with compsci");
		}
	});
	StartAthletes = ClickableEntity.extend({
		size: {x: 225, y: 100},
		draw: function() {
			ig.game.red_subheaderfont.draw( "Athlete",this.pos.x+125,this.pos.y,ig.Font.ALIGN.CENTER);
			ig.game.red_subheaderfont.draw( "50% health bonus",this.pos.x+125,this.pos.y+25,ig.Font.ALIGN.CENTER);
		},
		clicked: function() {
			ig.game.starting ='start';

			ig.game.playclass = 'ATH';
			//
			console.log("clicked start with athlete");
		}
	});
	StartBio = ClickableEntity.extend({
		size: {x: 225, y: 100},
		draw: function() {
			ig.game.green_subheaderfont.draw( "Bioligist",this.pos.x+125,this.pos.y,ig.Font.ALIGN.CENTER);
			ig.game.green_subheaderfont.draw( "50% attack bonus",this.pos.x+125,this.pos.y+25,ig.Font.ALIGN.CENTER);
		},
		clicked: function() {
			ig.game.starting ='start';

			ig.game.playclass = 'BIO';
			//
			console.log("clicked start with bio");
		}
	});
	
	Re_Start = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 225, y: 100},
		red_headerfont: new ig.Font('media/font/redheader.font.png'),
		draw: function() {
			this.red_headerfont.draw( "Restart Game?",this.pos.x,this.pos.y);
		},
		clicked: function() {
			ig.game.starting ='restart';
			ig.game.playclass = null;
			ig.game.difficulty=0;
			ig.game.gameTimer.reset();
			//
			console.log("clicked started");
		}
	});	
	Re_Born = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 500, y: 100},
		red_headerfont: new ig.Font('media/font/redheader.font.png'),
		draw: function() {
			this.red_headerfont.draw( "Reborn with continued difficulty?",this.pos.x,this.pos.y);
		},
		clicked: function() {
			ig.game.starting ='restart';
			ig.game.playclass = null;
			console.log("clicked started");
		}
	});

	credits_button = ClickableEntity.extend({
		zIndex: 15,
		size: {x: 225, y: 100},
		tealfont: new ig.Font('media/font/teal.font.png'),
		draw: function() {
			this.tealfont.draw( "Credits",this.pos.x,this.pos.y);
		},
		clicked: function() {
			ig.game.state = ig.game.CREDITS;
			console.log("clicked credits");
		}
	});

	Back_to_Menu = Re_Start.extend({
		draw: function() {
			ig.game.tealfont.draw( "Back to Menu",this.pos.x,this.pos.y);
		},
	});





});