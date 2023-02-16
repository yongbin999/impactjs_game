ig.module(
	'game.main' 
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.entity-pool',
	'impact.image',
	'impact.sound',

	'game.entities.player',
	'game.entities.monster',
	'game.entities.bullets',

	'game.entities.clickable_panel',
	'game.entities.clickable_menu',
	'game.entities.clickable_towers',


	'game.levels.blank',
	'game.levels.main-level',
	'game.levels.tower'

)
.defines(function(){

MyGame = ig.Game.extend({
	font: new ig.Font('media/font/04b03.font.png'),
	tealfont: new ig.Font('media/font/teal.font.png'),
	red_subheaderfont: new ig.Font('media/font/red_subheader.font.png'),
	green_subheaderfont: new ig.Font('media/font/green_subheader.font.png'),
	blue_subheaderfont: new ig.Font('media/font/blue_subheader.font.png'),

	music: new ig.Sound('media/sound/654493_Alone-In-A-Cold-Void.*'),
	logo: new ig.Image('media/logo.png'),
	logo_left: new ig.Image('media/logo_left.png'),
	logo_right: new ig.Image('media/logo_right.png'),
	intro: new ig.Image('media/window.jpg'),
	win_img: new ig.Image('media/umass_spring.jpg'),
	lose_img: new ig.Image('media/umass_path.jpg'),
	clearColor: '#06030F',

	gameTimer: new ig.Timer(),
	winTimer: new ig.Timer(0.3),
	fadeTimer: new ig.Timer(0.1),
	storyTimer: new ig.Timer(7),
	resoureTimer: new ig.Timer(1),
	resourebonusTimer: new ig.Timer(5),
	movelockTimer: new ig.Timer(0.2),
	spawnTimer: new ig.Timer(5),
	
	SCREEN_WIDTH: 600,
	SCREEN_HEIGHT: 400,
	LEVEL_WIDTH: 1000, //-200 for menu
	LEVEL_HEIGHT: 600,

	starting:'not',
	playclass: null,
	storytime:'not',
	state: 0,
	MENU: 0,
	GAME: 1,
	GAME_OVER: 2,
	CREDITS: 3,

	player:null,
	score: 0,
	energy: 1000,
	kills: 0,
	wintime: 0,
	difficulty: 1,
	maxmonstercount:25,
	currentmonstercount: 0,

	acquiredtower: 0,
	countdown:30,
	startcountdownwin: true,

	selecteditem: false,
	selectedtower: null,
	tower_maxhealth:null,
	tower_attackpower:null,
	tower_chealth:null,
	tower_cattack:null,


	
	init: function() {
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.SPACE, 'start');
		
		ig.input.initMouse();
		ig.input.bind(ig.KEY.MOUSE1, 'click');


		ig.EntityPool.enableFor(EntityPlayer);
		ig.EntityPool.enableFor(monster);
		ig.EntityPool.enableFor(bullets);

		this.tealfont.alpha = 0;
		this.red_subheaderfont.alpha = 0;
		this.green_subheaderfont.alpha = 0;
		this.blue_subheaderfont.alpha = 0;
		this.starting='not';
	},
	
	update: function() {
		switch(this.state) {
			case this.MENU:
				//flashing menu choice page
				if(this.starting !='start') {
					this.fademenu();
				}
				//if selected a choice activates the start
				else if(this.starting ==('start') ) {
					if (this.storytime != 'yes'){
						this.storyTimer.reset();
						this.fadeTimer.reset();

						this.red_subheaderfont.alpha = 1;
						this.blue_subheaderfont.alpha = 1;
						this.green_subheaderfont.alpha = 1;
						this.storytime ='yes';
					}
					this.fadestory();
					

					if (this.storyTimer.delta() >= 0){
						this.startgame();
						this.storytime = 'no';
					}
				}
			break;

			case this.GAME:

				ig.game.sortEntitiesDeferred();
				// start camera when player spawned
				if (this.player != null){
					this.updateCamera();
				}

				//calculate bonus energys and score
				if (this.resoureTimer.delta() >= 0){
					this.energy +=5*(this.difficulty +this.acquiredtower);
					this.resoureTimer.reset();
				}
				if (this.resourebonusTimer.delta() >= 0){
					var bonus =Math.round(10+this.acquiredtower*0.1);
					this.energy +=bonus;
					this.difficulty= Math.round(this.gameTimer.delta()/10);
					this.score += Math.round(bonus*0.1)*this.difficulty;

					this.resourebonusTimer.reset();
				}

				//item selections to stop movement
				if (ig.game.selecteditem ==true  && this.movelockTimer.delta() >=0) {
					this.movelockTimer.reset();
				}
				else if (this.movelockTimer.delta() >=-0.1 && this.movelockTimer.delta() <=0){
					ig.game.selecteditem = false;
				}

				//calculate how many towers occuped
				towers = ig.game.getEntitiesByType('EntityClickable_towers');
				tower_id = this.selectedtower;
				acquired = 0,
				pos = tower_id;
				if (this.selectedtower != null){
					for(var i=0; i<towers.length; i++) {
				        if(towers[i].id == tower_id) {
				            pos = i;
				            this.tower_maxhealth=towers[pos].maxhealth;
				            this.tower_attackpower= towers[pos].attack_power;
				            this.tower_chealth=towers[pos].chealth;
				            this.tower_cattack= towers[pos].cattack;
				        }
				        if (towers[i].health > 0){
				        	acquired +=1;
				        	this.acquiredtower = acquired;
				        }
					}
				}

				// wins teh game when timmer is done
				if (this.acquiredtower ==4) {
					if ((this.startcountdownwin ==false)&& (this.winTimer.delta() >=0)){
						this.winTimer.reset();
						this.startcountdownwin = true;
					}
					else if (this.winTimer.delta() >30) {
						//wins
							this.starting = 'win';
							this.wintime = this.gameTimer.delta();
							this.state = this.GAME_OVER;
							this.acquiredtower =0;
							this.startcountdownwin = false;
					}
					else{
						this.countdown = Math.round(30-this.winTimer.delta());
					}

				}
				else{
					this.countdown = 30;
					this.winTimer.reset();
					this.startcountdownwin = false;
				}
				this.spawnObject();

				break;

			case this.GAME_OVER:
			console.log(this.starting);
				//change starting trigger to over
				//if restart button is pressed switch to menu
				if(this.starting =='restart') {
					this.restart_button.kill();
					this.currentmonstercount = 0;
					this.starting ='not';
					this.state = this.MENU;
				}
				else if (this.starting == 'win'){
					ig.EntityPool.enableFor(EntityPlayer);
					this.loadLevel(LevelBlank);
					this.restart_button = this.spawnEntity(Re_Born, 150, 340);
				}
				else if (this.starting == 'lose'){
					this.score = 0;
					this.energy = 1500;
					this.kills = 0;
					this.difficulty = 0;
					this.gameTimer.reset();
					this.music.stop();
					this.loadLevel(LevelBlank);
					this.restart_button = this.spawnEntity(Re_Start, this.SCREEN_WIDTH/2, 340);
				}
				break;

			case this.CREDITS:
				//if restart button is pressed switch to menu
				if(this.starting =='restart') {
					this.Back_to_Menu.kill();
					this.starting ='not';
					this.state = this.MENU;
				}
				else if (this.starting != 'not'){
					this.wintime = this.gameTimer.delta();
					this.music.stop();
					this.loadLevel(LevelBlank);
					this.Back_to_Menu = this.spawnEntity(Back_to_Menu, 25+this.SCREEN_WIDTH/2, 340,ig.Font.ALIGN.CENTER);
					this.starting = 'not';
				}
				break;
		}
		
		this.parent();
	},
	
	draw: function() {
		this.parent();

		switch(this.state) {
			case this.MENU:
				if(this.starting != 'start'){
					this.logo.draw(250,75);
					this.logo_left.draw(100,50);
					this.logo_right.draw(580,50);
					this.font.draw( "Copyright@ Yong Liang",10, 10);
					this.tealfont.draw('Difficulty Lvl: ' + this.difficulty, 400,  this.SCREEN_HEIGHT*0.65,ig.Font.ALIGN.CENTER);
					this.tealfont.draw( "CHOOSE YOUR DESTINY",400, this.SCREEN_HEIGHT*0.60, ig.Font.ALIGN.CENTER);
				}

				if(this.starting ==('not')) {
					//change trigger to start when one of the button is pressed
					this.spawnEntity(StartAthletes,  25, this.SCREEN_HEIGHT*0.75, ig.Font.ALIGN.CENTER);
					this.spawnEntity(StartBio,  275, this.SCREEN_HEIGHT*0.75, ig.Font.ALIGN.CENTER);
					this.spawnEntity(StartCompsci,  525, this.SCREEN_HEIGHT*0.75, ig.Font.ALIGN.CENTER);
					this.credits_button = this.spawnEntity(credits_button, 700, 10);
					this.starting ='spawnedbuttons';
				}

				//starting story
				if (this.storytime == 'yes'){
					this.intro.draw( 50, 50);
					this.credits_button.kill();

					career = null;
					if (this.playclass=='ATH'){
						career = "'balling'"
					} 
					else if(this.playclass=='BIO'){
						career = "'medicine'"
					}
					else if(this.playclass=='CS'){
						career = "'1s & 0s'"
					}

					this.tealfont.draw( "You have found you way to snowy land",600, 75, ig.Font.ALIGN.CENTER);
					this.tealfont.draw( "of the windy towers",600, 100, ig.Font.ALIGN.CENTER);
					this.tealfont.draw( "Yours studys in the art of ",600, 150, ig.Font.ALIGN.CENTER);
					this.tealfont.draw( career,600, 175, ig.Font.ALIGN.CENTER);
					this.tealfont.draw( ' are need to suppress the beasts',600, 200, ig.Font.ALIGN.CENTER);
					this.tealfont.draw( "Every second the the wild becomes strong ",600, 250, ig.Font.ALIGN.CENTER);
					this.tealfont.draw( "Hurry! You need to rebuild the towers",600, 275, ig.Font.ALIGN.CENTER);
				}

				break;

			case this.GAME:
				//re-draws every frame
				this.update_menu_stats();
				break;

			case this.GAME_OVER:
				if(this.starting =='win') {
					this.win_img.draw( 150, 75);
					this.tealfont.alpha = 1;
					this.tealfont.draw('Congrats you Win!', this.SCREEN_WIDTH/2, 50);

					this.font.draw('You beat the game in: '+Math.round(this.wintime) +' seconds',50, 50);
					this.font.draw('Final score: \t'+Math.round(this.score),50, 70);
					this.font.draw('Final energy: \t'+Math.round(this.energy),50, 80);
					this.font.draw('Final kills: \t'+this.kills,50, 90);
				}
				else if (this.starting =='lose') {
					this.tealfont.draw('You\'ve been mowed down by the viscious monsters', 150, 50);
					this.lose_img.draw( 100, 75);
					this.tealfont.alpha = 1;
				}

				break;		

			case this.CREDITS:
				this.tealfont.alpha = 1;
				this.print_credits();
				break;
			}

	},




	fademenu: function(){
		if ( this.fadeTimer.delta() >=0 ) {
			transparency = this.fadeTimer.delta();
			transparency*= transparency;
			this.tealfont.alpha += transparency/5;
			this.red_subheaderfont.alpha += transparency/Math.random(1,10);
			this.green_subheaderfont.alpha += transparency/Math.random(1,10);
			this.blue_subheaderfont.alpha += transparency/Math.random(1,10);
		}
		if ( this.fadeTimer.delta() >=1 ) {
			//flash the choices every second
			this.red_subheaderfont.alpha = 0;
			this.green_subheaderfont.alpha = 0;
			this.blue_subheaderfont.alpha = 0;
			this.fadeTimer.reset();
		}
	},
	fadestory: function(){

		if ( this.fadeTimer.delta() <0 ) {
			this.tealfont.alpha=0;
			if (this.playclass !='ATH') {
				this.red_subheaderfont.alpha = 0;
			}
			if (this.playclass !='BIO') {
				this.green_subheaderfont.alpha = 0;
			}
			if (this.playclass !='CS') {
				this.blue_subheaderfont.alpha = 0;
			}
		}
		if ( this.fadeTimer.delta() >=0 ) {
			transparency = this.fadeTimer.delta();
			transparency *= transparency;
			this.tealfont.alpha += transparency;
			this.red_subheaderfont.alpha /= (transparency);
			this.green_subheaderfont.alpha /= (transparency);
			this.blue_subheaderfont.alpha /= (transparency);
		}
		if ( this.fadeTimer.delta() >=3 ) {
			//flash the choices every second
			this.tealfont.alpha = 3/(this.fadeTimer.delta());
			this.red_subheaderfont.alpha = 0;
			this.green_subheaderfont.alpha = 0;
			this.blue_subheaderfont.alpha = 0;
		}
	},
	startgame: function(){
		this.loadLevel(LevelTower);

		this.panel = this.spawnEntity(panel, 0, 0);
		this.avatar =this.spawnEntity(avatar, 10, 50);
		this.spawnEntity(upgrade_player_health, 10, 165);
		this.spawnEntity(upgrade_player_regen, 10, 215);
		this.spawnEntity(upgrade_player_attack, 110,165);
		this.spawnEntity(upgrade_player_defence, 110, 215);
		this.spawnEntity(upgrade_tower_attack, 10, 300);
		this.spawnEntity(upgrade_tower_health, 110, 300);
		
		this.music.loop = true,
		this.music.play();
		this.state = this.GAME;
		this.player = this.spawnEntity(EntityPlayer, ig.system.width/2, ig.system.height/2);
	},

	updateCamera: function() {
		// screen follows the player as the center
		var center = this.player.getCenter();
		this.screen.x = center.x - this.SCREEN_WIDTH/2-200; // adjust for left panel
		this.screen.y = center.y - this.SCREEN_HEIGHT/2;
		if(this.screen.x < 0)
			this.screen.x = 0;
		if(this.screen.y < 0)
			this.screen.y = 0;
		if(this.screen.x + this.SCREEN_WIDTH > this.LEVEL_WIDTH)
			this.screen.x = this.LEVEL_WIDTH - this.SCREEN_WIDTH;
		if(this.screen.y + this.SCREEN_HEIGHT > this.LEVEL_HEIGHT)
			this.screen.y = this.LEVEL_HEIGHT - this.SCREEN_HEIGHT;
	},

	spawnObject: function() {
		//spawn bonus on screen by timer
		if ( this.spawnTimer.delta() >=0 && this.maxmonstercount > this.currentmonstercount) {
			this.spawnEntity(monster, 200+Math.random()*(this.LEVEL_WIDTH-200), Math.random()*(this.LEVEL_HEIGHT-50));
			this.spawnEntity(monster, 200+Math.random()*(this.LEVEL_WIDTH-200), Math.random()*(this.LEVEL_HEIGHT-50));
			this.spawnEntity(monster, 200+Math.random()*(this.LEVEL_WIDTH-200), Math.random()*(this.LEVEL_HEIGHT-50));
			this.spawnTimer.reset();
			this.currentmonstercount+=3;
		}
	},
	spawnnow: function(x,y) {
		if (this.maxmonstercount > this.currentmonstercount){
			this.spawnEntity(monster, x+(Math.random()*(200)-100), y+(Math.random()*(200)-100) );
			this.currentmonstercount+=1;
		}
	},
	print_credits: function() {

		this.tealfont.draw('Here are the credits:', this.SCREEN_WIDTH/2, 50);

		this.font.draw('Clickable links are in the background html', this.SCREEN_WIDTH/2, 70);

		this.font.draw('Bullets',100,100);
		this.font.draw('book: http://i.imgur.com/SEe7Y0m.png/Antique_Book_noBG.png',100,110);
		this.font.draw('codes: http://www.otlayi.com/web_images/content/free-doc-type-sprite-icons.jpg',100,120);
		this.font.draw('potions: http://orig10.deviantart.net/9557/f/2013/317/2/2/sprite___custom___potions__old__by_eviscus-d6u5v2t.png',100,130);
		this.font.draw('balls: http://previews.123rf.com/images/gamegfx/gamegfx1401/gamegfx140100068/25977656-Set-of-different-sport-balls--Stock-Vector.jpg -balls',100,140);

		this.font.draw('Snow Pic: http://docs.yoyogames.com/source/dadiospice/002_reference/particles/particle%20types/part_type_shape.html',100,160);
		this.font.draw('snow emitter: https://github.com/ansimuz/snow-emitter',100,170);

		this.font.draw('avatar http://icongal.com/gallery/icon/63461/128/winter_snow_angel_follow_christmas_weather_avatar',100,190);
		this.font.draw('hero spritesheet https://ssl-forum-files.fobby.net/forum_attachments/0001/8032/MotherXP_Hero.PNG',100,200);
		this.font.draw('monster: https://www.chronocompendium.com/images/wiki/e/e3/Cyrus_Monster_Sprites.png',100,210);

		this.font.draw('sound effect: http://www.bfxr.net/',100,230);
		this.font.draw('background sound -Alone In A Cold Void: http://www.newgrounds.com/audio/listen/654493',100,240);

		this.font.draw('Photo editing https://pixlr.com',100,260);
		this.font.draw('tower – umass image photoshoped',100,270);
		this.font.draw('levelmap - google map',100,280);

		this.font.draw('cursor(not implemented)https://www.7kfans.com/wiki/images/b/bd/Cursors.png',100,250);
	},
	update_menu_stats: function(){

				this.tealfont.draw('Level: ' + this.difficulty, 700, 10);				
				this.font.draw('Game Timer: \t' + Math.round(this.gameTimer.delta()), 700, 30,ig.Font.ALIGN.Right);
				this.font.draw('Energy per kill: \t' + this.difficulty*3, 700, 35,ig.Font.ALIGN.Right);
				
				this.font.draw( "Copyright@ Yong Liang",700, 390);
				this.font.draw( "Last Updated: 1/04/2016",700, 385);


				towers = ig.game.getEntitiesByType('EntityClickable_towers');
				this.tealfont.draw('Objective to Win', 210, 10);
					ig.system.context.fillStyle = "rgb(255,255,0)";
					ig.system.context.lineWidth = 1;
			        ig.system.context.beginPath();
			        ig.system.context.rect(210, 30,175, 3);
			        ig.system.context.closePath();
			        ig.system.context.fill();	
				this.tealfont.draw('>Aquire Towers: ' + this.acquiredtower+'/'+towers.length, 210, 30);


				this.tealfont.alpha = 1
				this.tealfont.draw('Score: \t' + this.score, 10, 5);
				this.tealfont.draw('Energy:  \t' + Math.round(this.energy), 10, 20);


	        	this.tealfont.draw( "Health:", 100, 60,ig.Font.ALIGN.Left );
	        	this.tealfont.draw( Math.round(this.player.health) + "/"+ this.player.maxhealth,
	        						 100, 100,ig.Font.ALIGN.Left );
	        	this.avatar.alpha = this.player.health/this.player.maxhealth,

				this.font.draw('Health Max:  \t' + this.player.maxhealth, 10, 150);
				this.font.draw('cost:  \t$' + this.player.chealth, 10, 175);
				this.font.draw('Regen:  \t' + this.player.regen_power, 10, 200);
				this.font.draw('cost:  \t$' + this.player.cregen, 10, 225);
				this.font.draw('Att:  \t' + this.player.attack_power, 110, 150);
				this.font.draw('cost:  \t$' + this.player.cattack, 110, 175);
				this.font.draw('Def:  \t' + this.player.defence_power, 110, 200);
				this.font.draw('cost:  \t$' + this.player.cdefence, 110, 225);

				this.tealfont.draw('Tower ID:  \t' + this.selectedtower, 10, 250);
				this.font.draw('Health Max:  \t' + this.tower_maxhealth, 110, 285);
				this.font.draw('cost:  \t$:  \t' + this.tower_chealth, 110, 310);
				this.font.draw('Att:  \t' + this.tower_attackpower, 10, 285);
				this.font.draw('cost:  \t$' + this.tower_cattack, 10, 310);

				//alart counter on heros head
				if ((this.startcountdownwin ==true)){
					this.red_subheaderfont.alpha = 1;
					this.red_subheaderfont.draw('! Countdown: ' +this.countdown+'\'\' !' , 
					this.player.getCenter().x - ig.game.screen.x, 
					this.player.getCenter().y - ig.game.screen.y-75,
					ig.Font.ALIGN.CENTER);
			}
	}
});


ig.main('#canvas', MyGame, 60, 600, 300, 1);

});
