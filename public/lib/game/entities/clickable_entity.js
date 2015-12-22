ig.module( 
	'game.entities.clickable_entity'
)
.requires(
	'impact.image',
	'impact.sound',
	'impact.entity'
)
.defines(function(){

	ClickableEntity = ig.Entity.extend({
		update: function() {
			this.parent();
			this.checkMouse();
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

		clicked: function() {
			console.log("CLICKED!");
		},

	});
	

});