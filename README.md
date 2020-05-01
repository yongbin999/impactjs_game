
<br>hosted site: https://windytower-game.herokuapp.com/
<br>video ads: https://windytower-game.herokuapp.com/ads


### updates
* 1-30-2016 - added sitemap.xml and robots.txt according to SEO
* 1-20-2016 - added google adsense video ads, javascript/html5 IMA implementation 
* 1-10-2016 - bootstrap template: menu bars and containers:  comments, credits, links
* 1-05-2016 - countdown moved to hero's head, buy tower-health hint, $per kill on right, objective up top,
  add upgrade-button background, added google ads
* 12-30-2015 - fix only 1 tower health regenerate at a time
* 12-15-2015 - finalized version 1 went live


### todo fixes
* monitize
<br>https://www.google.com/adsense/app
<br>https://github.com/googleads/googleads-ima-html5/releases
<br>https://support.google.com/adsense/answer/1705831?hl=en
* spawn $ on kill? currently show on top right
* only 1 tower attack a time // something to do with the timer instance...
* hero resets to 0  when reborn // tried entity pooling? maybe store variables then reapply 
* some diagonal bullet spawn off center // tried screen offset change??

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
 * clickable button for upgrades, restartgame 


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




