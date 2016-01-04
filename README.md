spend many revision over this project.
<br>hosted site: https://windytower-game.herokuapp.com/

### updates
* jan2016 - countdown moved to hero's head
* dec2016 - fix only 1 tower health regenerate at a time


### todo fixes
* only 1 tower attack a time // something to do with the timer instance...
* hero resets to 0  when reborn // tried entity pooling? maybe store variables then reapply 
* some diagonal bullet spawn off center // tried screen offset change??
* add upgrade-button background soeasier to see

<hr />
#Implementation Features Detail:
###level/ templates:
 * homemade level-map from googlemap
 * welmister background, collision
 * layer entities -- change zIndex then call sortentitiesdefer
 * images - transparency
 * get new font color and size/bold - impact tool 
 * camera follow player center
 * states  - menu/credits/game/game_over
 * timer for bonus
 * text fading and flashing use alpha
 * health bars
 * scores and resources
 * countdown wins
 * level advancement by timmer and replays


###player:
 * options for classes and bonuses
 * different animation sprites
 * in range detect closest monsters
 * mouse click for movement and targets
 * movement facing directions


###tower:
 * homemade tower spritesheet from photoshop
 * change animation  when clicked
 * clickable entity change the display information on the buttons
 * on collision minus health with monster

###monster:
 * change animation  when clicked 	
 * built collision using distance to player
 * play sound when attack				

###bullets:
 * bullets fly spawn entity
 * sound
 * rotate/flip
 * kill() on collision with monster, set moving ignore map collision

###mouse:(not implemented)
 * hide mouse cursor
 * change mouse display on clickable stuff?					----- not done draw mouse
 * clicked target circle spawn? then kill after 1 second?		----- not done

###scoreboard:(not implemented)
 * create .min.js file  -- use the tool script
 * hosting		- no src files: imact & welmister




