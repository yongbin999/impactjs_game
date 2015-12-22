spend many revision over the semester on this final project.
Currently posted on course website:
https://people.cs.umass.edu/~ctinckne/cs397j/arcade/YLiang/

#Implementation features detail:

###level/ templates:
welmister background, collision
layer entities -- change zIndex then call sortentitiesdefer
images - transparency
get new font color and size/bold? - impact tool 
camera follow player center
states  - menu credits game game over
timer for bonus
text fading and flashing use alpha
health bars
scores and resources
countdown wins
level advancement by timmer and replays


###player:
options for classes and bonuses
different animation sprites
in range detect closest monsters
mouse click for movement and targets
movement facing directions


###tower:
change animation  when clicked
clickable entity change the display information on the buttons
on collision minus health with monster

###monster:
change animation  when clicked 	
built collision using distance to player
play sound when attack				


###bullets:
bullets fly spawn entity
sound
rotate/flip
kill() on collision with monster, set moving ignore map collision


###mouse:
hide mouse cursor
change mouse display on clickable stuff?					----- not done draw mouse
clicked target circle spawn? then kill after 1 second?		----- not done

scoreboard
create .min.js file  -- use the tool script
hosting		- no src files: imact & welmister




