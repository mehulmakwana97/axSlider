+(function($) {
  'use strict';

  $.axSlider = {
    init: function(params) {
      var _parent = $(params.block);
      var _responsive = false;
      if(params.responsive !== undefined)
        _responsive = params.responsive;

      var _screen_size = $(window).width() - params.minusScreenSize;
      var _minWidth = parseInt(_screen_size);

      if(params.minWidth !== undefined)
        _minWidth = parseInt(params.minWidth);

      if(_parent.length > 0 && (_screen_size + params.addScreenWidth) < _minWidth) {
        _parent.css({ width: '100%', overflow: 'hidden', position: 'relative' });

        var _children = _parent.find('>'+ params.selector.replace(' ', ' > '));

        if(_children.length > 0) {

          params['totalItems'] = _parent.find('>'+ params.selector.replace(' ', ':eq(0) > ')).length;
          var _sliderWidth = (params.width * params.totalItems);
          var _itemWidth = params.width;
          var _hasChildren = false;

          params['itemPositionIndex'] = params.itemPositionIndex;
          params['itemPosition'] = params.itemPositionIndex * _itemWidth;
          params['itemScrollTop'] = 117;

          var _windowTop = $(window).scrollTop();
          var _parentTop = _parent.offset().top;

          if(_windowTop > (_parentTop - 60) && _windowTop <= (_parentTop + _parent.height() - 460)) {
            params['itemScrollTop'] = (_windowTop - (_parentTop - 200));
          } else if(_windowTop >= (_parentTop + _parent.height() - 460)) {
            params['itemScrollTop'] = _parent.height() - 315;
          }


          if(params.totalItems > 1) {
            _hasChildren = true;
          }

          $.axSlider.getPagerArrow(params);

          params.itemStyle['position'] = 'relative';
          params.itemStyle['width'] = _itemWidth + 'px';

          _children.parent().css({ width: _sliderWidth +'px', position: 'relative', transition: 'all 0.5s ease-in-out', transform: 'translate3d(-'+ params['itemPosition'] +'px, 0, 0)' });
          _children.css(params.itemStyle);

          params['pagerNextEvent'] = function(e) {
            e.preventDefault();

            if((params.itemPosition + _itemWidth) < _sliderWidth) {
              params.itemPositionIndex++;
              params.itemPosition += _itemWidth;

              _parent.find('.app-slide-pager > a.pager-prev').css('left', '0px');
              _children.parent().css({ width: _sliderWidth +'px', position: 'relative', transition: 'all 0.5s ease-in-out', 'transform': 'translate3d(-'+ params.itemPosition +'px, 0, 0)' });
            }

            if(_hasChildren && params.itemPositionIndex === (params.totalItems - 1)) {
              _parent.find('.app-slide-pager > a.pager-next').css('right', '-40px');
            }
          }

          params['pagerPrevEvent'] = function(e) {
            e.preventDefault();

            if((params.itemPosition - _itemWidth) >= 0) {

              params.itemPositionIndex = params.itemPositionIndex - 1;
              params.itemPosition = params.itemPosition - _itemWidth;

              _parent.find('.app-slide-pager > a.pager-next').css('right', '0px');
              _children.parent().css({ width: _sliderWidth +'px', position: 'relative', transition: 'all 0.5s ease-in-out', transform: 'translate3d(-'+ params.itemPosition +'px, 0, 0)' });
            } else {
              _children.parent().css({ width: _sliderWidth +'px', position: 'relative', transition: 'all 0.5s ease-in-out', transform: 'translate3d(0, 0, 0)' });
            }

            if(_hasChildren && params.itemPositionIndex <= 0) {
              _parent.find('.app-slide-pager > a.pager-prev').css('left', '-40px');
            }
          }

          if(_responsive === true) {
            $(window).resize(function() {
              _screen_size = $(window).width() - params.minusScreenSize;
              _sliderWidth = (_screen_size * params['totalItems']);
              _itemWidth = _screen_size;
              _minWidth = parseInt(_screen_size);

              if(params.minWidth !== undefined)
                _minWidth = parseInt(params.minWidth);

              if((_screen_size + params.addScreenWidth) < _minWidth) {
                _parent.css({ width: '100%', overflow: 'hidden', position: 'relative' });

                params.itemStyle['width'] = _itemWidth + 'px';
                params.itemPosition = params.itemPositionIndex * _itemWidth;;

                if(_hasChildren)
                  $.axSlider.getPagerArrow(params);

                _children.parent().css({ width: _sliderWidth +'px', position: 'relative', transition: 'all 0.5s ease-in-out', transform: 'translate3d(-'+ params.itemPosition +'px, 0, 0)' });
                _children.css(params.itemStyle);

                _parent.find('.app-slide-pager > .pager-next').off().on('click', params.pagerNextEvent);
                _parent.find('.app-slide-pager > .pager-prev').off().on('click', params.pagerPrevEvent);

              } else {
                params.itemPositionIndex = 0;
                params.itemPosition = 0;

                $.axSlider.destroy(params);
              }
            });
          }
        }

        _parent.find('.app-slide-pager > .pager-next').off().on('click', params.pagerNextEvent);
        _parent.find('.app-slide-pager > .pager-prev').off().on('click', params.pagerPrevEvent);

        $(window).on('scroll', function() {
          _windowTop = $(window).scrollTop();
          _parentTop = _parent.offset().top;

          if(_windowTop > (_parentTop - 60) && _windowTop <= (_parentTop + _parent.height() - 260)) {
            params['itemScrollTop'] = (_windowTop - (_parentTop - 200));
            _parent.find('.app-slide-pager > a').css({ 'top': params.itemScrollTop + 'px' });
          } else if(_windowTop < (_parentTop - 60)) {
            params['itemScrollTop'] = 117;
            _parent.find('.app-slide-pager > a').css({ 'top': params.itemScrollTop + 'px' });
          }

        });

      }
      return params;
    },
    destroy: function(params) {
      var _parent = $(params.block);
      if(_parent.length > 0) {
        _parent.removeAttr('style');

        var _children = _parent.find('>'+ params.selector.replace(' ', ' > '));

        if(_children.length > 0) {
          params['totalItems'] = _parent.find('>'+ params.selector.replace(' ', ':eq(0) > ')).length;

          if(params.totalItems > 1)
            _parent.find('.app-slide-pager').remove();

          _children.parent().removeAttr('style');
          _children.removeAttr('style');

          _parent.find('.app-slide-pager > .pager-next').off('click', params.pagerNextEvent);
          _parent.find('.app-slide-pager > .pager-prev').off('click', params.pagerPrevEvent);

        }
      }
    },
    getImage: function(params) {
      var image = '';
      if(params.img !== undefined)
        image = params.assetsPath + params.img;
      else
        image = params.assetsPath + params.default;

      return 'background-image: url('+ image +')';
    },
    getPagerArrow: function(params) {
      var _pagerStyle = '';
      var _arrowImg = '';
      var _parent = $(params.block);

      _pagerStyle = '; position: absolute; top: '+ params.itemScrollTop +'px; transition: all 0.5s ease-in-out; text-indent: -9999px; width: 30px; height: 46px;';

      _arrowImg = $.axSlider.getImage($.extend({ img: params.arrowImg, default: 'a12.png' }, params));
      var _hideNext = 'right: 0px;', _hidePrev = 'left: 0px;';

      if(params.itemPositionIndex === (params.totalItems - 1))
        _hideNext = 'right: -40px;';

      if(params.itemPositionIndex === 0)
        _hidePrev = 'left: -40px;';

      _parent.find('.app-slide-pager').remove();
      _parent.append('<div class="app-slide-pager"><a href="#prev" class="pager-prev" style="'+ _hidePrev +' background-position: -136px -37px;'+ _arrowImg + _pagerStyle +'">Prev</a><a href="#next" class="pager-next" style="'+ _hideNext +' background-position: -195px -37px;'+ _arrowImg + _pagerStyle +'">Next</a></div>');
    }
  };

  var axSlider = function(element, options) {
    this.options = $.extend({}, this.defaults(), options);
    return this.render(element, this.options);
  };

  axSlider.prototype.defaults = function() {
    return {
      itemStyle : {
        float: 'left', 'list-style': 'none'
      },
      assetsPath: '/assets/img/axslider/',
      addScreenWidth: 47,
      minusScreenSize: 30,
      selector: ' > .slides',
      responsive: false,
      minWidth: $(window).width() - 30,
      itemPositionIndex: 0,
      width: $(window).width() - 30,
    }
  }

  axSlider.prototype.render = function(element, params) {
    params['block'] = element;
    return $.axSlider.init(params);
  }

  function Plugin(options) {
    return new axSlider(this, options);
  }

  $.fn.axSlider = Plugin;
  $.fn.axSlider.Constructor = axSlider;

})(jQuery);