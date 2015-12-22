/**
 *  @snow-emitter.js
 *  @version: 2.0
 *  @author: Luis Zuno
 *  @date: Feb 2013
 *  @copyright (c) 2013 Luis Zuno Aka Ansimuz, under The MIT License (see LICENSE)
 *
 *  This entity will randomly spawn snowflakes all over the screen. 
 */

ig.module(
    'game.entities.snow-emitter'
).requires(
    'impact.entity'
).defines(function(){

    EntitySnowEmitter = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 170, 66, 0.7)',
        duration: 1,
        count: 25,
        nextEmit: null,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.size.x = ig.system.width;
            this.nextEmit = new ig.Timer();
            // start right away
            this.nextEmit.set( 0 );
        },
        update: function(){
            if(  this.nextEmit.delta() >= 0 && this.count > 0 ) {
                this.count--;
                this.nextEmit.set( this.duration / this.count );
                var x = this.randomRange(ig.game.screen.x, ig.game.screen.x + ig.system.width);
                var y = this.randomRange(ig.game.screen.y, ig.game.screen.y + 2*ig.system.height);
                ig.game.spawnEntity( EntityParticle, x, y );
            }
        },
        randomRange: function(min, max){
            return Math.random() * (max - min) + min;
        }
    });
    EntityParticle = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/snow-particle2.png', 5 ,5 ),
        size: {x: 5, y: 5},
        offset: {x: 0, y: 0},
        vel: {x: 50, y: 25},
        //maxVel: {x: 50, y: 50},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,
        bounciness: 0,
        friction: {x:0, y: 0},


        existtime: new ig.Timer(3),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 1, [0] );

            this.vel.x = (Math.random()-1) * this.vel.x;
            this.vel.y = (Math.random()+1) * this.vel.y;
        },
        update: function() {
            if( this.pos.y > ig.game.screen.y  + 2*ig.system.height ) {
                // move it to the top screen
               this.pos.y = ig.game.screen.y +Math.random(0,1) * ig.system.height/2;
               
               var angle = Math.atan2(this.pos.y - ig.input.mouse.y - ig.game.screen.y,
                                    this.pos.x - ig.input.mouse.x - ig.game.screen.x);
            angle += this.pos.y;
            this.currentAnim.angle = angle;
            }
            // out of right bound
            if(this.pos.x > ig.game.screen.x + ig.system.width){
                this.pos.x = ig.game.screen.x;
            }
            // out of left bound
            if(this.pos.x < ig.game.screen.x){
                this.pos.x = ig.game.screen.x + ig.system.width;
            }
            this.parent();


            



        },
        handleMovementTrace: function(res){
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        }
    });
});