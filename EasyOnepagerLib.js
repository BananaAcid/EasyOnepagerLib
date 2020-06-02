/**
 * EasyOnepagerLib
 * 
 * @description Some always required functions for onepagers combined in one concice package
 * @author nabil redmann <repo+easyonepagerlib@bananaacid.de>
 * @licence MIT
 * @version 1.8
 * @repository https://github.com/BananaAcid/EasyOnepagerLib
 * @example
 *  Initialization of the functions
 *
 *  $.EasyOnepagerLib.ParallaxItem(item = '#parallax');
 *  $.EasyOnepagerLib.SetCssScreenDpi();
 *  $.EasyOnepagerLib.NavBurgerSwitcherAction(btnOpen = '.navopen', btnClose = '.navclose', targetNav = 'nav');
 *  $.EasyOnepagerLib.NavHasBackground(targetNav = 'nav', distance = 50);
 *  $.EasyOnepagerLib.InView(selector = 'main > section, main > section > *, main > footer');
 *  $.EasyOnepagerLib.NavItemSelectedAndUpdateOnScroll(itemSelector = 'nav li', sectionSelector = 'main > section, main > footer', firstId = '#home');
 *  $.EasyOnepagerLib.SmoothScroll(overlaySelector = 'overlay-content', scrollOnPageLoad = false);
 **/
(function($) {
  var DEBUG = false;

  if (!$) {
    console.error('jQuery not loaded before EasyOnepagerLib!\nNo EasyOnepagerLib functionallity loaded.');
    return;
  }

  var lib = function() {};
  
  /**
   * Allows an item to be scrolled up to a certain point and down again
   * @param item  item has extra attr `data-parallax-part` for max height
   */
  lib.prototype.ParallaxItem = function ParallaxItem(item = '#parallax') {
    $(window).on('scroll', function() {
      var $item = $(item);
      if ($item.length) {
        var scroll_position = $(this).scrollTop() - $item.offset().top;
        var maxPart = $item.data('parallax-part') || 0;
        $item.css({
          'background-position-y': 'bottom, max(' + maxPart + ', calc(100% + ' + (0 + scroll_position * 1.3) + 'px) ), bottom',
        });
      }
    });
  }
  

  /**
   * Adds two root css-variable that contain the current screen dpi and the multiplier from 72dpi
   */
  lib.prototype.SetCssScreenDpi = function SetCssScreenDpi() {
    function calcScreenDPI() {
      const el = document.createElement('div');
      el.style = 'width: 1in;'
      document.body.appendChild(el);
      const dpi = el.offsetWidth;
      document.body.removeChild(el);
      return dpi;
    }
    $(function() {
      $(':root').css('--dpi', calcScreenDPI());
      $(':root').css('--dpi-fac', calcScreenDPI()/72);
    });
  }

  
  /**
   * open a nav by specific element, and close it by clicking another specific element
   * @param btnOpenSelector     opening button
   * @param btnCloseSelector    closing button
   * @param targetNav           target to add a 'close' or 'open' class to
   * 
   * @note if btnOpenSelector is equal to btnCloseSelector, it will be used as toggle button
   */
  lib.prototype.NavBurgerSwitcherAction = function NavBurgerSwitcherAction(btnOpenSelector = '.navopen', btnCloseSelector = '.navclose', targetNav = 'nav') {
    if (btnOpenSelector !== btnCloseSelector) {
      $(document).on('click', btnOpenSelector, function (ev) {
        ev.preventDefault();
        $(targetNav).addClass('open');
      });

      $(document).on('click', btnCloseSelector, function(ev) {
        ev.preventDefault();
        $(targetNav).removeClass('open');
      });
    }
    else {
      $(document).on('click', btnOpenSelector, function (ev) {
        ev.preventDefault();
        $(targetNav).toggleClass('open');
      });
    }
  };


  /**
   * adds the class `hasbg` to a nav if not scrolled to top
   * @param targetNav  target to add the `hasbg` class to
   * @param distance   distance to move until the class `hasbg` is applied
   */
  lib.prototype.NavHasBackground = function NavHasBackground(targetNav = 'nav', distance = 50) {
    function hasBg(ev) {
      if ($(window).scrollTop() > distance) // at least +50px
        $(targetNav).addClass('hasbg');
      else
        $(targetNav).removeClass('hasbg');
    }
    $(window).on('scroll.NavHasBackground', hasBg); // hook up to scroll
    $(function(){
      $(hasBg); // trigger on DomReady
    });
  }
    

  /**
   * adds classes when scrolled into view and out of view
   * @param selector  the jquery selector to be used to check if it is in viewport 
   */
  lib.prototype.InView = function InView(selector = 'main > section') {

    $(window).on('scroll.InView', function (ev) {
      var topstart = $(window).scrollTop();
      var topend = $(window).scrollTop() + window.innerHeight; //$(window).height(); --- strange values on some pages
      $(selector).each(function () {
        var $t = $(this),
            ts = $t.offset().top,
            te = $t.offset().top + $t.height(); // begins before viewport start, and end is after viewport start

        if (ts <= topstart && te >= topstart) $t.addClass('in-view in-view-firsttime').removeClass('out-view'); // begins after viewport start, but before viewport end
        else if (ts >= topstart && ts <= topend) $t.addClass('in-view in-view-firsttime').removeClass('out-view'); // not in view
          else $t.addClass('out-view').removeClass('in-view');
      });
    });

    $('body').trigger('scroll.InView');
    $(function(){
      // on domready
      $('body').trigger('scroll.InView');
    });
  }


  /**
   * Adds the class 'selected' to the parent li of any a
   * @description expects nav>ul>li.selected>a(href=#sectionId) for a matching section#sectionId 
   */
  lib.prototype.NavItemSelectedAndUpdateOnScroll = function NavItemSelectedAndUpdateOnScroll(itemSelector = 'nav li', sectionSelector = 'main > section, main > footer', firstId = '#home') {
    
    // menu select
    var lastFocused = firstId;

    function selectMenu() {
      if (!lastFocused) return;

      DEBUG && console.log('lastFocused', lastFocused);

      $(itemSelector).removeClass('selected');
      $('a[href="' + lastFocused + '"]', itemSelector).closest('li').addClass('selected');

      history.pushState(undefined, document.title, lastFocused);
    }

    // select on scroll
    $(function () {
     
      $(window).on('scroll', function() {
        var lastFocusedChange = null;
        var scrollTop = ($(document.body).scrollTop() || window.scrollY || 0);
        
        if ((window.innerHeight * 0.3 >= scrollTop) && document.location.hash.length<=1) {
          lastFocusedChange = '#'+$(sectionSelector).eq(0).attr('id');
        }
        else {
          var screenCenter = scrollTop + (window.innerHeight /2) ;
          $(sectionSelector).each( function() {
            if ($(this).offset().top < screenCenter && $(this).offset().top + $(this).height() > screenCenter) {
              lastFocusedChange = '#'+$(this).attr('id');
            }
          });
        }
        if (lastFocused !== lastFocusedChange) {
          lastFocused = lastFocusedChange
          selectMenu();
        }
      });
    });
    selectMenu();
  }


  /**
   * does a smooth scroll on hash-change or opens an overlay
   * @param overlaySelector   the object to match the id against and add an 'open' class (to close it just needs to remove the hash like a(href=#))
   * @param scrollOnPageLoad  does a smooth scroll to a hash on open (usually not desireable)
   * 
   * @note Use <a name="jumptome"></a> to add jump stops at certain positions.
   */
  lib.prototype.SmoothScroll = function SmoothScroll(overlaySelector = 'overlay-content', scrollOnPageLoad = false) {
    // simple overlay open 
    var doOverlayContent = function doOverlayContent($element) {
      $($element).addClass('open');
    };
    
    // simple element scrollto
    var doHash = function doHash(ev, hash, onload) {
      var isString = typeof hash == 'string';
      hash = isString ? hash : $(this).attr('href'); // we are using a(name) for jumping

      var name = '[name="' + hash.replace(/#/, '') + '"]',
          $target = $(name).add(hash || '');

      if ($target.length) {
        if ($target.eq(0).is(overlaySelector))
          doOverlayContent($target);
        else {
          if (!onload)
            $('html, body').stop(true).animate({
              scrollTop: $target.offset().top
            }, 'slow');
          else
            $('html, body').scrollTop($target.offset().top);
        }
        history.pushState(undefined, document.title, hash);
        ev && ev.preventDefault();
      }
    };


    // simple dialog closer, clear hash
    $(window).on('hashchange', function (ev) {
      if (document.location.hash == '') {
        $('overlay-content').removeClass('open');
        history.replaceState(undefined, document.title, document.location.toString().slice(0, -1));
        ev.preventDefault();
      }
    });

    $(document).on('click', 'a[href^="#"]:not(a[href="#"])', doHash); // add the eventlistener

    if (scrollOnPageLoad) {
      // scroll on DomReady
      $(function() {
        return setTimeout(function (_) {
          return doHash(null, decodeURIComponent(document.location.hash), true); // yes, support umlauts
        }, 100);
      });
    }
  }
  
  jQuery.EasyOnepagerLib = new lib();

})(jQuery);