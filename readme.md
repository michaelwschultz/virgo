# Space Shooter for Raspberry Pi and LED display
[![CircleCI](https://circleci.com/gh/michaelwschultz/space-shooter-led.svg?style=svg)](https://circleci.com/gh/michaelwschultz/space-shooter-led)

Written by [Michael Schultz](http://twitter.com/michaelschultz) with MASSIVE help from [Marc Mendiola](http://twitter.com/codemookie) and the folks who've contributed during one of my live streams on [Twitch.tv](https://www.twitch.tv/idigg). People that put up with my never ending questions... Sam McDonald and Scott Southerland.

---
#### 🚧 IN DEVELOPMENT 🚧
![screenshot](https://raw.githubusercontent.com/michaelwschultz/Space-Shooter-LED/master/screenshot.png)

## Goal of this project
Build a 2D side-scrolling space shooter using a 16 x 32 [LED display](https://www.adafruit.com/products/420).

This is my first hardware project and my first game. I played around with a Raspberry Pi at work for the first time and was instantly taken by how magical it feels to plug in an LED, writing some code and see it light up.

After browsing around [Adafruit.com](http://adafruit.com) looking at all the different parts that were available, I quickly made up my mind to build a game; something I'd wanted to do for a long time. This was the perfect opportunity due to the fact that it would help me continue my learning of Javascript and teach me something new.

## Known Issues
- This code currently only runs in the web simulator (Raspberry Pi support coming soon)
- Frame rate isn't always rock solid (thanks to Javascript)
- No collision detection
- I could go on and on, but hey... it's a work in progress

If you REALLY want to check out what I've finished so far you can run the game in the simulator now by running:

`npm start`
