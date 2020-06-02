# EasyOnepagerLib
Simple toolkit to power onepagers

The source file contains the code.

your `main.js` should contain this:
```javascript
$.EasyOnepagerLib.ParallaxItem(item = '#parallax');
$.EasyOnepagerLib.SetCssScreenDpi();
$.EasyOnepagerLib.NavBurgerSwitcherAction(btnOpen = '.navopen', btnClose = '.navclose', targetNav = 'nav');
$.EasyOnepagerLib.NavHasBackground(targetNav = 'nav', distance = 50);
$.EasyOnepagerLib.InView(selector = 'main > section, main > section > *, main > footer');
$.EasyOnepagerLib.NavItemSelectedAndUpdateOnScroll(itemSelector = 'nav li', sectionSelector = 'main > section, main > footer', firstId = '#home');
$.EasyOnepagerLib.SmoothScroll(overlaySelector = 'overlay-content', scrollOnPageLoad = false);
```
