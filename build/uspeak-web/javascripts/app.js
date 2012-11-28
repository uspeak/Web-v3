(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var App, Dialogs, Games, Header, Home, Loading, User,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Dialogs = require('controllers/dialogs');

    Games = require('controllers/games');

    Header = require('controllers/header');

    Loading = require('controllers/loading');

    Home = require('controllers/home');

    User = require('models/user');

    App = (function(_super) {

      __extends(App, _super);

      App.prototype.controllers = {
        home: Home,
        dialogs: Dialogs,
        games: Games
      };

      function App() {
        App.__super__.constructor.apply(this, arguments);
        this.navigate("/home");
        this.user = new User();
        this.user.setToken('testtoken');
        this.loading = new Loading();
        this.append(this.loading);
        this.initConfig();
      }

      App.prototype.initConfig = function() {
        var $;
        Spine.Model.host = 'http://v5.uspeakapp.com/';
        $ = this.$;
        $('a').live('click', function() {
          var href;
          href = $(this).attr('href');
          if (href) Spine.Route.navigate(href);
          return false;
        });
        return soundManager.setup({
          url: '/swf/',
          preferFlash: false
        });
      };

      return App;

    })(Spine.Stack);

    module.exports = App;

  }).call(this);
  
}});

window.require.define({"controllers/dialogs": function(exports, require, module) {
  (function() {
    var Dialog, DialogDiagnostic, DialogLogin, DialogMain, DialogRecover, Dialogs, User,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Dialog = (function(_super) {

      __extends(Dialog, _super);

      Dialog.prototype.styles = {
        out: {
          scale: 1.5,
          opacity: 0
        },
        "in": {
          scale: .5,
          opacity: 0
        },
        normal: {
          scale: 1,
          opacity: 1
        }
      };

      Dialog.prototype.transitionTime = 400;

      function Dialog() {
        this.className = ((this.className != null) || '') + ' dialog';
        Dialog.__super__.constructor.apply(this, arguments);
        this.activated = false;
        this.el.hide();
        this.render();
      }

      Dialog.prototype.render = function() {
        return this.html(require(this.template)());
      };

      Dialog.prototype.activate = function() {
        return this.stack.showDialog(this);
      };

      Dialog.prototype.deactivate = function() {};

      Dialog.prototype.show = function() {
        var from, next, prev, _ref,
          _this = this;
        if (this.activated) return;
        this.trigger('activate');
        this.activated = true;
        prev = ((_ref = this.stack.current) != null ? _ref.stackIndex() : void 0) || -1;
        next = this.stackIndex();
        from = prev < next ? this.styles["in"] : this.styles.out;
        this.el.show();
        this.el.css(from);
        this.el.css('margin-top', -this.el.outerHeight(false) / 2);
        this.el.transition(this.styles.normal, this.transitionTime, function() {
          _this.trigger('activated');
          return _this.activate();
        });
        this.stack.current = this;
        return this.stack.next = null;
      };

      Dialog.prototype.hide = function() {
        var next, prev, to, _ref,
          _this = this;
        if (!this.activated) return;
        this.trigger('deactivate');
        this.activated = false;
        prev = this.stackIndex();
        next = (_ref = this.stack.next) != null ? _ref.stackIndex() : void 0;
        if (!this.stack.next) next = 10000;
        to = prev < next ? this.styles.out : this.styles["in"];
        return this.el.transition(to, this.transitionTime, function() {
          _this.el.hide();
          return _this.trigger('deactivated');
        });
      };

      Dialog.prototype.stackIndex = function() {
        return this.stack.line.indexOf(this.constructor);
      };

      return Dialog;

    })(Spine.Controller);

    DialogMain = (function(_super) {

      __extends(DialogMain, _super);

      function DialogMain() {
        DialogMain.__super__.constructor.apply(this, arguments);
      }

      DialogMain.prototype.template = 'views/dialog.main';

      return DialogMain;

    })(Dialog);

    DialogDiagnostic = (function(_super) {

      __extends(DialogDiagnostic, _super);

      function DialogDiagnostic() {
        DialogDiagnostic.__super__.constructor.apply(this, arguments);
      }

      DialogDiagnostic.prototype.template = 'views/dialog.diagnostic';

      return DialogDiagnostic;

    })(Dialog);

    User = require('models/user');

    DialogLogin = (function(_super) {

      __extends(DialogLogin, _super);

      DialogLogin.prototype.template = 'views/dialog.login';

      DialogLogin.prototype.events = {
        "submit form": 'login'
      };

      function DialogLogin() {
        this.loginSuccess = __bind(this.loginSuccess, this);
        this.loginFailed = __bind(this.loginFailed, this);      DialogLogin.__super__.constructor.apply(this, arguments);
        User.bind('login:failed', this.loginFailed);
        User.bind('login:success', this.loginSuccess);
      }

      DialogLogin.prototype.login = function(e) {
        e.preventDefault();
        return app.user.login('test', 'test');
      };

      DialogLogin.prototype.loginFailed = function() {
        return this.el.keyframe('shake', 800, 'linear');
      };

      DialogLogin.prototype.loginSuccess = function() {
        return this.hide();
      };

      return DialogLogin;

    })(Dialog);

    DialogRecover = (function(_super) {

      __extends(DialogRecover, _super);

      function DialogRecover() {
        DialogRecover.__super__.constructor.apply(this, arguments);
      }

      DialogRecover.prototype.template = 'views/dialog.recover';

      return DialogRecover;

    })(Dialog);

    Dialogs = (function(_super) {

      __extends(Dialogs, _super);

      Dialogs.prototype.className = 'dialog-stack';

      Dialogs.prototype.controllers = {
        main: DialogMain,
        diagnostic: DialogDiagnostic,
        login: DialogLogin,
        recover: DialogRecover
      };

      Dialogs.prototype.line = [DialogMain, DialogDiagnostic, DialogLogin, DialogRecover];

      Dialogs.prototype.routes = {
        '/diagnostic': 'diagnostic',
        '/login': 'login',
        '/recover': 'recover'
      };

      function Dialogs() {
        this.next = null;
        this.current = null;
        Dialogs.__super__.constructor.apply(this, arguments);
      }

      Dialogs.prototype.showDialog = function(dialog) {
        var last,
          _this = this;
        if (dialog === this.current) return;
        this.next = dialog;
        if (this.current) {
          last = this.current;
          last.one('deactivated', function() {
            return dialog.show();
          });
          return last.hide();
        } else {
          return dialog.show();
        }
      };

      return Dialogs;

    })(Spine.Stack);

    module.exports = Dialogs;

  }).call(this);
  
}});

window.require.define({"controllers/game": function(exports, require, module) {
  (function() {
    var Game, GameHeader, GameMenu, GameStatus, GamesResource, PlayedResource, Utils,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    GamesResource = require('models/games');

    PlayedResource = GamesResource.Played;

    GameHeader = require('controllers/game.header');

    GameStatus = require('controllers/game.status');

    GameMenu = require('controllers/game.menu');

    Utils = require('utils');

    Game = (function(_super) {

      __extends(Game, _super);

      Game.extend(Spine.Events);

      Game.prototype.elements = {
        '.rounds>*': 'rounds'
      };

      function Game() {
        this.loaded = __bind(this.loaded, this);
        var _this = this;
        this.className = "game-" + this.name + " game";
        Game.__super__.constructor.apply(this, arguments);
        this.resource = new GamesResource();
        this.resource.bind('game:loaded', this.loaded);
        this.playedResource = new PlayedResource();
        this.header = new GameHeader();
        this.menu = new GameMenu();
        this.status = new GameStatus();
        this.status.bind('gameover:show', function() {
          return _this.onFinish();
        });
        this.status.bind('finish:show', function() {
          return _this.onFinish();
        });
        this.menu.bind('pause', function() {
          return _this.pause();
        });
        this.menu.bind('resume', function() {
          return _this.resume();
        });
      }

      Game.prototype.activate = function() {
        this.resource.get({
          game: this.id
        });
        return Game.__super__.activate.apply(this, arguments);
      };

      Game.prototype.sendPlayed = function() {
        return this.playedResource.send({
          idg: this.id,
          idv: this.variation,
          pts: this.points,
          instance: this.instance,
          langdir: "2",
          W: this.dataPlayed,
          stime: this.seconds - this.remainSeconds
        });
      };

      Game.prototype.reset = function() {
        this.log('RESETING');
        this.round = null;
        this.status.hide();
        this.header.hide();
        this.menu.hide();
        if (typeof this.timer !== "undefined") {
          this.timer.pause();
          return delete this.timer;
        }
      };

      Game.prototype.deactivate = function() {
        Game.__super__.deactivate.apply(this, arguments);
        this.reset();
        return this.el.empty();
      };

      Game.prototype.pause = function() {
        this.el.addClass('paused');
        this.timer.pause();
        this.header.hide();
        this.rounds.transition({
          opacity: 0
        });
        return this.status.show('pause');
      };

      Game.prototype.resume = function() {
        this.el.removeClass('paused');
        this.timer.resume();
        this.header.show();
        this.rounds.transition({
          opacity: 1
        });
        return this.status.hide();
      };

      Game.prototype.loaded = function(data) {
        return this.setData(data[0]);
      };

      Game.prototype.getRounds = function() {
        return [];
      };

      Game.prototype.onFinish = function() {
        var _this = this;
        return setTimeout(function() {
          return _this.navigate('/');
        }, 1500);
      };

      Game.prototype.animateRoundOut = function(el) {
        if (!(el != null ? el.length : void 0)) return;
        return el.transition({
          x: '-100%',
          opacity: .5
        });
      };

      Game.prototype.animateRoundIn = function(el) {
        if (!(el != null ? el.length : void 0)) return;
        return el.addClass('active').css({
          x: '100%'
        }).transition({
          x: 0
        });
      };

      Game.prototype.goRound = function(round) {
        this.log("Going round " + round, this.rounds);
        if (this.rounds.length === round) this.finish();
        if (this.round !== null) this.animateRoundOut(this.rounds.eq(this.round));
        if (typeof round !== "undefined") {
          this.animateRoundIn(this.rounds.eq(round));
          this.round = round;
          return this.$round = this.rounds.eq(this.round);
        } else {
          this.reset();
          return this.sendPlayed();
        }
      };

      Game.prototype.gameOver = function() {
        this.goRound();
        return this.status.show('gameover');
      };

      Game.prototype.finish = function() {
        this.goRound();
        return this.status.show('finish');
      };

      Game.prototype.addPoints = function(points) {
        this.points += points;
        return this.header.setPoints(this.points);
      };

      Game.prototype.context = function() {
        return {
          variation: this.variation,
          rounds: this.getRounds(this.data)
        };
      };

      Game.prototype.setData = function(data) {
        var _this = this;
        this.data = data;
        this.seconds = this.remainSeconds = parseInt(this.data.seconds);
        this.variation = parseInt(this.data.vid);
        this.instance = parseInt(this.data.instance);
        this.points = 0;
        this.header.setSeconds(this.remainSeconds);
        this.header.setPoints(0);
        this.dataPlayed = [];
        this.timer = new Utils.TimerInterval(function() {
          _this.remainSeconds--;
          _this.header.setSeconds(_this.remainSeconds);
          if (_this.remainSeconds === 0) {
            _this.timer.pause();
            return _this.gameOver();
          }
        }, 1000);
        this.html(require(this.template)(this.context()));
        this.prepend(this.header, this.status);
        this.append(this.menu);
        this.header.show();
        this.menu.show();
        return this.goRound(0);
      };

      return Game;

    })(Spine.Controller);

    module.exports = Game;

  }).call(this);
  
}});

window.require.define({"controllers/game.header": function(exports, require, module) {
  (function() {
    var GameHeader, Utils, common, formatTime, stringDifference2, stringDifference3, zeroFill,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Utils = require('utils');

    formatTime = function(seconds) {
      var date;
      date = new Date(null);
      date.setSeconds(seconds);
      return date.toTimeString().substr(3, 5);
    };

    common = function(prev, next) {
      var s, _ref;
      for (s = 0, _ref = prev.length; 0 <= _ref ? s <= _ref : s >= _ref; 0 <= _ref ? s++ : s--) {
        if (prev[s] !== next[s]) break;
      }
      return s;
    };

    zeroFill = function(number, width) {
      width -= number.toString().length;
      if (width > 0) return new Array(width + 1).join('0') + number;
      return number + "";
    };

    stringDifference2 = function(prev, next, s) {
      if (s > 2) {
        return "" + (prev.substr(0, s)) + "<b>" + (prev.substr(s)) + "</b>";
      } else {
        return "" + (prev.substr(0, s)) + "<b>" + (prev.substr(s, 2 - s)) + "</b>:<b>" + (prev.substr(3)) + "</b>";
      }
    };

    stringDifference3 = function(prev, next, s) {
      return "" + (next.substr(0, s)) + "<b>" + (prev.substr(s)) + "</b>";
    };

    GameHeader = (function(_super) {

      __extends(GameHeader, _super);

      GameHeader.prototype.tag = 'header';

      GameHeader.prototype.elements = {
        '.time': 'time',
        '.points': 'points'
      };

      GameHeader.prototype.styles = {
        hide: {
          y: '-80px'
        },
        show: {
          y: '0px'
        }
      };

      function GameHeader() {
        GameHeader.__super__.constructor.apply(this, arguments);
        this.el.css(this.styles.hide);
        this.render();
      }

      GameHeader.prototype.render = function() {
        return this.html(require('views/game.header')());
      };

      GameHeader.prototype.show = function() {
        return this.el.transition(this.styles.show);
      };

      GameHeader.prototype.hide = function() {
        return this.el.transition(this.styles.hide);
      };

      GameHeader.prototype.setPoints = function(points) {
        var lastPoints, s, timer,
          _this = this;
        points = zeroFill(points, 4);
        lastPoints = this.points.text() || zeroFill(0, 4);
        s = common(points, lastPoints);
        s = 0;
        this.points.html(stringDifference3(lastPoints, points, s));
        return timer = new Utils.TimerInterval(function() {
          var p;
          s++;
          p = stringDifference3(lastPoints, points, s);
          _this.points.html(p);
          if (s >= 4) return timer.pause();
        }, 120);
      };

      GameHeader.prototype.setSeconds = function(seconds) {
        var actual, next, s,
          _this = this;
        this.seconds = seconds;
        actual = formatTime(this.seconds);
        next = formatTime(this.seconds - 1);
        this.time.text(actual);
        s = common(actual, next);
        if (s <= 1) {
          setTimeout(function() {
            return _this.time.html(stringDifference2(actual, next, 0));
          }, 200);
        }
        if (s <= 1) {
          setTimeout(function() {
            return _this.time.html(stringDifference2(actual, next, 1));
          }, 400);
        }
        if (s <= 4) {
          setTimeout(function() {
            return _this.time.html(stringDifference2(actual, next, 3));
          }, 600);
        }
        if (s <= 4) {
          return setTimeout(function() {
            return _this.time.html(stringDifference2(actual, next, 4));
          }, 800);
        }
      };

      return GameHeader;

    })(Spine.Controller);

    module.exports = GameHeader;

  }).call(this);
  
}});

window.require.define({"controllers/game.menu": function(exports, require, module) {
  (function() {
    var GameStatus,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    GameStatus = (function(_super) {

      __extends(GameStatus, _super);

      GameStatus.prototype.className = 'menu';

      GameStatus.prototype.events = {
        'tap .pause': 'pause',
        'tap .play': 'resume'
      };

      function GameStatus() {
        GameStatus.__super__.constructor.apply(this, arguments);
        this.render();
        this.hide();
      }

      GameStatus.prototype.render = function() {
        return this.html(require('views/game.menu')());
      };

      GameStatus.prototype.show = function(status) {
        this.el.show();
        return this.el.stop().css({
          y: 100,
          opacity: 0,
          display: 'block'
        }).transition({
          y: 0,
          opacity: 1
        });
      };

      GameStatus.prototype.hide = function() {
        return this.el.hide();
      };

      GameStatus.prototype.pause = function() {
        return this.trigger('pause');
      };

      GameStatus.prototype.resume = function() {
        return this.trigger('resume');
      };

      return GameStatus;

    })(Spine.Controller);

    module.exports = GameStatus;

  }).call(this);
  
}});

window.require.define({"controllers/game.status": function(exports, require, module) {
  (function() {
    var GameStatus,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    GameStatus = (function(_super) {

      __extends(GameStatus, _super);

      GameStatus.prototype.className = 'status';

      GameStatus.prototype.elements = {
        '.gameover': 'gameover',
        '.finish': 'finish',
        '.pause': 'pause'
      };

      function GameStatus() {
        GameStatus.__super__.constructor.apply(this, arguments);
        this.render();
      }

      GameStatus.prototype.render = function() {
        return this.html(require('views/game.status')());
      };

      GameStatus.prototype.show = function(status) {
        var _this = this;
        this.el.show();
        this[status].stop().css({
          scale: 0,
          display: 'block'
        }).transition({
          scale: 1
        }, function() {
          return _this.trigger("" + status + ":show");
        });
        return this.active = status;
      };

      GameStatus.prototype.hide = function() {
        var _ref;
        if ((_ref = this[this.active]) != null) _ref.hide();
        this.trigger('#{@active}:hide');
        this.el.hide();
        return this.active = null;
      };

      return GameStatus;

    })(Spine.Controller);

    module.exports = GameStatus;

  }).call(this);
  
}});

window.require.define({"controllers/games": function(exports, require, module) {
  (function() {
    var Games,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Games = (function(_super) {

      __extends(Games, _super);

      function Games() {
        Games.__super__.constructor.apply(this, arguments);
      }

      Games.prototype.className = 'games';

      Games.prototype.controllers = {
        whichone: require('controllers/games/whichone'),
        flipcards: require('controllers/games/flipcards'),
        fatfingers: require('controllers/games/fatfingers'),
        association: require('controllers/games/association'),
        yayornay: require('controllers/games/yayornay')
      };

      Games.prototype.routes = {
        '/play/whichone': 'whichone',
        '/play/flipcards': 'flipcards',
        '/play/fatfingers': 'fatfingers',
        '/play/association': 'association',
        '/play/yayornay': 'yayornay'
      };

      Games.prototype.deactivate = function() {
        Games.__super__.deactivate.apply(this, arguments);
        return this.manager.deactivate();
      };

      return Games;

    })(Spine.Stack);

    module.exports = Games;

  }).call(this);
  
}});

window.require.define({"controllers/games/association": function(exports, require, module) {
  (function() {
    var Association, Select,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Select = require('controllers/games/select');

    Association = (function(_super) {

      __extends(Association, _super);

      function Association() {
        Association.__super__.constructor.apply(this, arguments);
      }

      Association.prototype.template = 'views/games/association';

      Association.prototype.id = 6;

      Association.prototype.name = 'association';

      return Association;

    })(Select);

    module.exports = Association;

  }).call(this);
  
}});

window.require.define({"controllers/games/challenge": function(exports, require, module) {
  (function() {
    var Challenge, Game,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Game = require('controllers/game');

    Challenge = (function(_super) {

      __extends(Challenge, _super);

      function Challenge() {
        Challenge.__super__.constructor.apply(this, arguments);
      }

      Challenge.prototype.id = 8;

      return Challenge;

    })(Game);

    module.exports = Challenge;

  }).call(this);
  
}});

window.require.define({"controllers/games/fatfingers": function(exports, require, module) {
  (function() {
    var FatFingers, Game,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Game = require('controllers/game');

    FatFingers = (function(_super) {

      __extends(FatFingers, _super);

      FatFingers.prototype.template = 'views/games/fatfingers';

      FatFingers.prototype.id = 2;

      FatFingers.prototype.name = 'fatfingers';

      FatFingers.prototype.events = {
        'tap .letter': 'clickLetter',
        'keyup .letter': 'deactivateLetter',
        'mouseup .letter': 'deactivateLetter',
        'mousedown .letter': 'activateLetter',
        'touchstart .letter': 'activateLetter',
        'touchend .letter': 'deactivateLetter'
      };

      function FatFingers() {
        var _this = this;
        FatFingers.__super__.constructor.apply(this, arguments);
        this.$(document).bind('keypress', function(e) {
          return _this.keypress(e);
        });
        this.$(document).bind('keyup', function(e) {
          return _this.deactivateLetter(e);
        });
      }

      FatFingers.prototype.getRounds = function(d) {
        var _this = this;
        return _.map(d.W, function(data, i) {
          var letters;
          letters = data.m.split("");
          return {
            round: i + 1,
            word: data.w,
            match: letters,
            match_shuffled: _.shuffle(letters)
          };
        });
      };

      FatFingers.prototype.clickLetter = function(e) {
        return this.type($(e.currentTarget));
      };

      FatFingers.prototype.type = function(el) {
        var letter, nextType,
          _this = this;
        letter = el.text().trim();
        if (el.hasClass('completed')) return;
        nextType = this.$round.find('.type span:not(.completed)').first();
        nextType.text(letter).css({
          color: 'black',
          opacity: 1
        });
        if (nextType.data('expect') === letter) {
          nextType.addClass('completed');
          el.addClass('completed');
          el.stop().transition({
            opacity: 0
          }, function() {
            if (nextType.next().length === 0) {
              _this.addPoints(100);
              _this.dataPlayed.push({
                id: _this.data.W[_this.round].id,
                ref: _this.errors + 1
              });
              return _this.goRound(_this.round + 1);
            }
          });
        } else {
          this.errors++;
          nextType.css({
            color: 'red'
          }).stop().transition({
            opacity: 0
          });
        }
        return nextType.text(letter);
      };

      FatFingers.prototype.goRound = function() {
        FatFingers.__super__.goRound.apply(this, arguments);
        return this.errors = 0;
      };

      FatFingers.prototype.keypress = function(e) {
        var ch, charcode, el;
        if (!this.isActive()) return;
        charcode = e.keyCode || e.charCode;
        ch = String.fromCharCode(charcode).toLowerCase();
        this.log("Pressed key " + ch);
        el = this.$round.find(".letter:not(.completed):contains('" + ch + "')").first();
        el.addClass('active');
        this.letterActive = el;
        return this.type(el);
      };

      FatFingers.prototype.activateLetter = function(e) {
        if (!this.isActive()) return;
        this.letterActive = $(e.currentTarget);
        return this.letterActive.addClass('active');
      };

      FatFingers.prototype.deactivateLetter = function(e) {
        if (!this.isActive() || !this.letterActive) return;
        return this.letterActive.removeClass('active');
      };

      return FatFingers;

    })(Game);

    module.exports = FatFingers;

  }).call(this);
  
}});

window.require.define({"controllers/games/flipcards": function(exports, require, module) {
  (function() {
    var FlipCards, Game, split,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Game = require('controllers/game');

    split = function(a, size) {
      var i, len, out;
      len = a.length;
      out = [];
      i = 0;
      while (i < len) {
        out.push(a.slice(i, i + size));
        i += size;
      }
      return out;
    };

    FlipCards = (function(_super) {

      __extends(FlipCards, _super);

      function FlipCards() {
        FlipCards.__super__.constructor.apply(this, arguments);
      }

      FlipCards.prototype.id = 1;

      FlipCards.prototype.template = 'views/games/flipcards';

      FlipCards.prototype.name = 'flipcards';

      FlipCards.prototype.events = {
        'tap .card': 'match'
      };

      FlipCards.prototype.styles = {
        selected: {
          borderColor: '#6BB7D1'
        },
        normal: {
          borderColor: 'white'
        },
        wrong: {
          borderColor: 'red'
        }
      };

      FlipCards.prototype.getRounds = function(d) {
        var m, pairs,
          _this = this;
        pairs = split(d.W, 6);
        return m = _.map(pairs, function(data, i) {
          var choices, word, _i, _len;
          choices = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            word = data[_i];
            choices.push({
              word: word.w,
              id: word.id
            });
            choices.push({
              match: word.m,
              id: word.id
            });
          }
          return {
            round: i + 1,
            choices: _.shuffle(choices)
          };
        });
      };

      FlipCards.prototype.match = function(e) {
        var correct, el,
          _this = this;
        el = $(e.currentTarget);
        if (!el.not(this.selectedCard).length) {
          el.find('.back').css(this.styles.normal);
          delete this.selectedCard;
          return;
        }
        if (!this.selectedCard) {
          el.find('.back').css(this.styles.selected);
          return this.selectedCard = el;
        } else {
          correct = this.selectedCard.data('word') === el.data('word');
          this.addInfo(correct);
          if (correct) {
            this.selectedCard.find('.back').css(this.styles.normal);
            el.add(this.selectedCard).addClass('matched').find('.back').transition({
              perspective: '400px',
              rotateY: '180deg'
            }, function() {
              if (!_this.$round.find('.card').not('.matched').length) {
                return _this.goRound(_this.round + 1);
              }
            });
            el.add(this.selectedCard).find('.front').transition({
              perspective: '400px',
              rotateY: '0'
            });
            this.addPoints(100);
          } else {
            el.add(this.selectedCard).find('.back').css(this.styles.wrong).transition(this.styles.normal);
          }
          return delete this.selectedCard;
        }
      };

      FlipCards.prototype.addInfo = function(correct) {
        var d, id, r;
        id = this.data.W[this.round].id;
        d = _.find(this.dataPlayed, function(W) {
          return W.id === id && W.round === this.round;
        });
        r = {
          id: id,
          round: this.round,
          ref: correct ? 1 : 2
        };
        if (d) {
          return _.extend(d, r);
        } else {
          return this.dataPlayed.push(r);
        }
      };

      return FlipCards;

    })(Game);

    module.exports = FlipCards;

  }).call(this);
  
}});

window.require.define({"controllers/games/select": function(exports, require, module) {
  (function() {
    var Game, Select,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Game = require('controllers/game');

    Select = (function(_super) {

      __extends(Select, _super);

      function Select() {
        Select.__super__.constructor.apply(this, arguments);
      }

      Select.prototype.events = {
        'tap .note': 'choose'
      };

      Select.prototype.getRounds = function(d) {
        var _this = this;
        return _.map(d.W, function(data, i) {
          var choices;
          choices = _.map(data.dist, function(word) {
            return {
              word: word
            };
          });
          choices.push({
            word: data.m,
            correct: true
          });
          return {
            word: data.w,
            id: data.id,
            round: i + 1,
            choices: _.shuffle(choices)
          };
        });
      };

      Select.prototype.choose = function(e) {
        var correct, el,
          _this = this;
        if (!this.canChoose) return;
        el = $(e.target);
        correct = el.is('.correct');
        if (correct) this.addPoints(100);
        this.dataPlayed.push({
          id: this.data.W[this.round].id,
          ref: correct ? 1 : 2
        });
        el.find('i').show().css({
          scale: 0
        }).transition({
          scale: 1
        }, 200, function() {
          return setTimeout((function() {
            return _this.goRound(_this.round + 1);
          }), 340);
        });
        return this.canChoose = false;
      };

      Select.prototype.goRound = function() {
        Select.__super__.goRound.apply(this, arguments);
        return this.canChoose = true;
      };

      Select.prototype.animateRoundIn = function(el) {
        el.addClass('active').css({
          x: '0'
        });
        el.find('.round').css({
          x: '100%'
        }).transition({
          x: 0,
          delay: 10
        }, 600);
        el.find('.help').css({
          x: '100%'
        }).transition({
          x: 0,
          delay: 100
        }, 600);
        el.find('.word-container').css({
          x: '100%'
        }).transition({
          x: 0,
          delay: 300
        }, 600);
        return el.find('.choices').css({
          x: '100%'
        }).transition({
          x: 0,
          delay: 700
        }, 800);
      };

      return Select;

    })(Game);

    module.exports = Select;

  }).call(this);
  
}});

window.require.define({"controllers/games/whichone": function(exports, require, module) {
  (function() {
    var Select, WhichOne,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Select = require('controllers/games/select');

    WhichOne = (function(_super) {

      __extends(WhichOne, _super);

      function WhichOne() {
        WhichOne.__super__.constructor.apply(this, arguments);
      }

      WhichOne.prototype.template = 'views/games/whichone';

      WhichOne.prototype.id = 3;

      WhichOne.prototype.name = 'whichone';

      return WhichOne;

    })(Select);

    module.exports = WhichOne;

  }).call(this);
  
}});

window.require.define({"controllers/games/yayornay": function(exports, require, module) {
  (function() {
    var Select, YayOrNay,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Select = require('controllers/games/select');

    YayOrNay = (function(_super) {

      __extends(YayOrNay, _super);

      function YayOrNay() {
        YayOrNay.__super__.constructor.apply(this, arguments);
      }

      YayOrNay.prototype.template = 'views/games/yayornay';

      YayOrNay.prototype.id = 4;

      YayOrNay.prototype.name = 'yayornay';

      YayOrNay.prototype.getRounds = function(d) {
        var _this = this;
        return _.map(d.W, function(data, i) {
          return {
            word: data.w,
            id: data.id,
            round: i + 1,
            correct: data.m
          };
        });
      };

      return YayOrNay;

    })(Select);

    module.exports = YayOrNay;

  }).call(this);
  
}});

window.require.define({"controllers/header": function(exports, require, module) {
  (function() {
    var Header, User,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    User = require('models/user');

    Header = (function(_super) {

      __extends(Header, _super);

      Header.prototype.tag = 'header';

      Header.prototype.elements = {
        "#header-logged": "logged"
      };

      Header.prototype.attributes = {
        id: 'main-header'
      };

      function Header() {
        this.showHeader = __bind(this.showHeader, this);      Header.__super__.constructor.apply(this, arguments);
        User.bind('login', this.showHeader);
        this.render();
      }

      Header.prototype.showHeader = function() {
        this.render();
        return this.logged.transition({
          bottom: 0
        });
      };

      Header.prototype.render = function() {
        return this.html(require('views/header')({
          username: typeof app !== "undefined" && app !== null ? app.user.username : void 0
        }));
      };

      return Header;

    })(Spine.Controller);

    module.exports = Header;

  }).call(this);
  
}});

window.require.define({"controllers/home": function(exports, require, module) {
  (function() {
    var Home, User,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    User = require('models/user');

    Home = (function(_super) {

      __extends(Home, _super);

      Home.prototype.id = 'home';

      function Home() {
        this.show = __bind(this.show, this);
        var _this = this;
        Home.__super__.constructor.apply(this, arguments);
        this.render();
        this.routes({
          '/home': this.active
        });
        User.bind('login', function() {
          return _this.active();
        });
      }

      Home.prototype.render = function() {
        return this.html(require('views/home')());
      };

      Home.prototype.show = function() {
        this.el.show().css({
          opacity: 0
        });
        return this.el.transition({
          opacity: 1
        });
      };

      return Home;

    })(Spine.Controller);

    module.exports = Home;

  }).call(this);
  
}});

window.require.define({"controllers/loading": function(exports, require, module) {
  (function() {
    var Loading, Resource,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Resource = require('models/resource');

    Loading = (function(_super) {

      __extends(Loading, _super);

      Loading.prototype.attributes = {
        id: 'loading'
      };

      function Loading() {
        var _this = this;
        Loading.__super__.constructor.apply(this, arguments);
        Spine.bind('ajax:before', function() {
          return _this.show();
        });
        Spine.bind('ajax:after', function() {
          return _this.hide();
        });
        this.render();
      }

      Loading.prototype.render = function() {
        return this.html(require('views/loading')());
      };

      Loading.prototype.show = function() {
        this.log('Show loading');
        return this.el.show().css({
          opacity: 0
        }).transition({
          opacity: 1
        });
      };

      Loading.prototype.hide = function() {
        var _this = this;
        this.log('Hide loading');
        return this.el.stop().transition({
          opacity: 0
        }, function() {
          return _this.el.hide();
        });
      };

      return Loading;

    })(Spine.Controller);

    module.exports = Loading;

  }).call(this);
  
}});

window.require.define({"models/games": function(exports, require, module) {
  (function() {
    var Games, Played, Resource,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Resource = require('models/resource');

    Games = (function(_super) {

      __extends(Games, _super);

      function Games() {
        Games.__super__.constructor.apply(this, arguments);
      }

      Games.prototype.url = 'http://v5.uspeakapp.com/userGames/getGameWords/:lang_dir/:game.json';

      Games.prototype.actions = {
        get: {
          params: {
            lang_dir: "2"
          },
          done: 'game:loaded'
        }
      };

      return Games;

    })(Resource);

    Played = (function(_super) {

      __extends(Played, _super);

      function Played() {
        Played.__super__.constructor.apply(this, arguments);
      }

      Played.prototype.url = 'http://v5.uspeakapp.com/userGames/played.json';

      Played.prototype.actions = {
        send: {
          done: 'game:played',
          method: 'POST',
          trigger: false
        }
      };

      return Played;

    })(Resource);

    Games.Played = Played;

    module.exports = Games;

  }).call(this);
  
}});

window.require.define({"models/resource": function(exports, require, module) {
  (function() {
    var $, Ajax, Events, Log, Model, Module, Resource, Route,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Ajax = Spine.Ajax;

    $ = Spine.$;

    Events = Spine.Events;

    Log = Spine.Log;

    Module = Spine.Module;

    Model = Spine.Model;

    Route = (function() {

      function Route(template, defaults) {
        var param, _i, _len, _ref;
        this.template = template;
        this.defaults = defaults;
        this.template += "#";
        this.defaults || (this.defaults = {});
        this.urlParams = {};
        _ref = this.template.split(/\W/);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          param = _ref[_i];
          if (param && this.template.match(new RegExp("[^\\\\]:" + param + "\\W"))) {
            this.urlParams[param] = true;
          }
        }
        this.template = this.template.replace(/\\:/g, ":");
      }

      Route.prototype.encodeUriSegment = function(val) {
        return this.encodeUriQuery(val, true).replace(/%26/g, "&").replace(/%3D/g, "=").replace(/%2B/g, "+");
      };

      Route.prototype.encodeUriQuery = function(val, pctEncodeSpaces) {
        return encodeURIComponent(val).replace(/%40/g, "@").replace(/%3A/g, ":").replace(/%24/g, "$").replace(/%2C/g, ",").replace((pctEncodeSpaces ? null : /%20/g), "+");
      };

      Route.prototype.url = function(params) {
        var key, query, url, urlParam, val, value, _, _ref;
        url = this.template;
        params = params || {};
        _ref = this.urlParams;
        for (urlParam in _ref) {
          _ = _ref[urlParam];
          val = (params.hasOwnProperty(urlParam) ? params[urlParam] : this.defaults[urlParam]);
          if (val !== null) {
            url = url.replace(new RegExp(":" + urlParam + "(\\W)", "g"), "" + (this.encodeUriSegment(val)) + "$1");
          } else {
            url = url.replace(new RegExp("/?:" + urlParam + "(\\W)", "g"), "$1");
          }
        }
        url = url.replace(/\/?#$/, "");
        query = [];
        for (key in params) {
          value = params[key];
          if (!this.urlParams[key]) {
            query.push("" + (this.encodeUriQuery(key)) + "=" + (this.encodeUriQuery(value)));
          }
        }
        query.sort();
        url = url.replace(/\/*$/, "");
        if (query.length) url += "?" + query.join("&");
        return url;
      };

      return Route;

    })();

    Resource = (function(_super) {

      __extends(Resource, _super);

      Resource.include(Events);

      Resource.include(Log);

      Resource.prototype.defaults = Ajax.defaults;

      function Resource() {
        var action, name, _ref,
          _this = this;
        Resource.__super__.constructor.apply(this, arguments);
        this.route = new Route(this.url);
        _ref = this.actions;
        for (name in _ref) {
          action = _ref[name];
          this[name] = function(data, params) {
            var after, hasBody, trigger, _ref2;
            hasBody = (_ref2 = action.method) === 'POST' || _ref2 === 'PUT' || _ref2 === 'PATCH';
            if (!hasBody) {
              params = data;
              data = null;
            }
            trigger = action.trigger !== false;
            after = function() {
              if (trigger) return Spine.trigger('ajax:after');
            };
            return _this.ajaxQueue(params, {
              type: action.method || 'GET',
              data: data ? JSON.stringify(data) : null,
              url: _this.route.url(_.extend({}, action.params, params)),
              trigger: trigger
            }).done(function(data, status, xhr) {
              if (action.done) return _this.trigger(action.done, data, status, xhr);
            }).fail(function(xhr, statusText, error) {
              if (action.fail) {
                return _this.trigger(action.fail, xhr, statusText, error);
              }
            }).then(after, after);
          };
        }
      }

      Resource.prototype.ajaxSettings = function(params, defaults) {
        return $.extend({}, this.defaults, defaults, params);
      };

      Resource.prototype.ajaxQueue = function(params, defaults) {
        var deferred, jqXHR, promise, request, settings;
        jqXHR = null;
        deferred = $.Deferred();
        promise = deferred.promise();
        if (!Ajax.enabled) return promise;
        settings = this.ajaxSettings(params, defaults);
        if (defaults.trigger) Spine.trigger('ajax:before');
        request = function(next) {
          return jqXHR = $.ajax(settings).done(deferred.resolve).fail(deferred.reject).then(next, next);
        };
        promise.abort = function(statusText) {
          var index;
          if (jqXHR) return jqXHR.abort(statusText);
          index = $.inArray(request, Ajax.queue());
          if (index > -1) Ajax.queue().splice(index, 1);
          deferred.rejectWith(settings.context || settings, [promise, statusText, '']);
          return promise;
        };
        Ajax.queue(request);
        return promise;
      };

      return Resource;

    })(Model);

    module.exports = Resource;

  }).call(this);
  
}});

window.require.define({"models/user": function(exports, require, module) {
  (function() {
    var Resource, User,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Resource = require('models/resource');

    User = (function(_super) {

      __extends(User, _super);

      User.prototype.url = 'http://v5.uspeakapp.com/users/:controller.json';

      User.prototype.actions = {
        register: {
          method: "POST",
          params: {
            controller: "add"
          }
        },
        token: {
          method: "POST",
          params: {
            controller: "token"
          },
          done: 'login:success',
          fail: 'login:failed'
        }
      };

      function User() {
        User.__super__.constructor.apply(this, arguments);
        this.bind('login:failed', this.loginFailed);
        this.bind('login:success', this.loginSuccess);
      }

      User.prototype.loginFailed = function() {
        return delete Spine.Ajax.defaults.headers['Authorization'];
      };

      User.prototype.getHeader = function(username, password) {
        var auth;
        password || (password = "");
        auth = Base64.encode64("" + username + ":" + password);
        return "Basic " + auth;
      };

      User.prototype.login = function(username, password) {
        var _this = this;
        return this.token(null, {
          beforeSend: function(xhr) {
            return xhr.setRequestHeader("Authorization", _this.getHeader(username, password));
          }
        });
      };

      User.prototype.setToken = function(token) {
        return Spine.Ajax.defaults.headers['Authorization'] = this.getHeader(token);
      };

      User.prototype.loginSuccess = function(user, data) {
        this.setToken(data.res);
        this.username = data.username;
        return this.trigger('login');
      };

      return User;

    })(Resource);

    module.exports = User;

  }).call(this);
  
}});

window.require.define({"utils": function(exports, require, module) {
  (function() {
    var TimerInterval;

    TimerInterval = (function() {

      function TimerInterval(callback, remaining) {
        this.callback = callback;
        this.remaining = remaining;
        this.timerId = void 0;
        this.start = void 0;
        this.resume();
      }

      TimerInterval.prototype.pause = function() {
        return window.clearInterval(this.timerId);
      };

      TimerInterval.prototype.resume = function() {
        this.start = new Date();
        return this.timerId = window.setInterval(this.callback, this.remaining);
      };

      return TimerInterval;

    })();

    module.exports = {
      TimerInterval: TimerInterval
    };

  }).call(this);
  
}});

window.require.define({"views/dialog.diagnostic": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h2>Prueba de nivel</h2>\n<p>Elige tu nivel para comenzar la prueba de conocimientos</p>\n<nav id=\"level-selector\">\n<a class=\"button big level-button\" data-level=\"1\" href=\"/\"><i class=\"icon-pencil\"></i>Principiante</a>\n<a class=\"button big level-button\" data-level=\"2\"><i class=\"icon-book\"></i>Intermedio</a>\n<a class=\"button big level-button\" data-level=\"3\"><i class=\"icon-globe\"></i>Experto</a>\n</nav>";});
}});

window.require.define({"views/dialog.login": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h2>Login</h2>\n<form id=\"login-form\">\n	<p class=\"wooden-field\"><label class=\"icon-user\"></label><input type=\"text\" id=\"login-user\" placeholder=\"Nombre de usuario\" /></p>\n	<p class=\"wooden-field\"><label class=\"icon-key\"></label><input type=\"text\" id=\"login-pass\" class=\"wooden-input\" placeholder=\"Contraseña\" /></p>\n	<button class=\"button big\" id=\"button-login\">Entrar</button>\n	<p>\n		<a class=\"forgot-password\" href=\"/recover\">Has olvidado la contraseña?</>\n	</p>\n</form>\n";});
}});

window.require.define({"views/dialog.main": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h2>¡Bienvenido!</h2>\n<p>Eres usuario de uSpeak?</p>\n<p>\n<a class=\"button big\" href=\"/login\">Si</a>\n<a class=\"button big\" href=\"/diagnostic\">No</a>\n</p>";});
}});

window.require.define({"views/dialog.recover": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h2>Recuperar cuenta</h2>\n<form id=\"recover-form\">\n	<p class=\"wooden-field\"><label class=\"icon-envelope-alt\"></label><input type=\"text\" placeholder=\"Email\" /></p>\n	<button class=\"button big\">Recuperar</button>\n</form>\n";});
}});

window.require.define({"views/game.header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<span class=\"points\"></span>\n<span class=\"time\"></span>\n<ul class=\"lifes\">\n	<li class=\"active\"></li>\n	<li class=\"inactive\"></li>\n</ul>\n";});
}});

window.require.define({"views/game.menu": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<a class=\"exit\" href=\"/home\"><i class=\"icon-chevron-left\"></i></a>\n<!-- <a class=\"help\">?</a>\n --><a class=\"pause\"><i class=\"icon-pause\"></i></a>\n <a class=\"play\"><i class=\"icon-play\"></i></a> \n<!-- <a class=\"sound\"><i class=\"icon-volume-off\"></i></a>\n -->";});
}});

window.require.define({"views/game.status": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"gameover\">Game Over</div>\n<div class=\"finish\">Well done</div>\n<div class=\"pause\">Paused</div>";});
}});

window.require.define({"views/games/association": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data,depth1) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n	<div><div class=\"auto-center\">\n		<div class=\"round\">Round ";
    foundHelper = helpers.round;
    stack1 = foundHelper || depth0.round;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "round", { hash: {} }); }
    buffer += escapeExpression(stack1) + "/";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth1.rounds;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.length);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "...rounds.length", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n		<span class=\"help\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 1;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = "9,26";
    stack2['compare'] = stack3;
    foundHelper = helpers.if_in;
    stack3 = foundHelper || depth0.if_in;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 10;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</span>\n		<div class=\"word-container\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 1;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(10, program10, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = "9,10,26";
    stack2['compare'] = stack3;
    foundHelper = helpers.if_in;
    stack3 = foundHelper || depth0.if_in;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		<ul class=\"choices\">\n			";
    foundHelper = helpers.choices;
    stack1 = foundHelper || depth0.choices;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</ul>\n	</div></div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n			Elige la traducción correcta.\n			";}

  function program4(depth0,data) {
    
    
    return "\n			Elige la palabra que representa la imagen.\n			";}

  function program6(depth0,data) {
    
    
    return "\n			Sigue la pista y elige la palabra correcta.\n			";}

  function program8(depth0,data) {
    
    
    return "\n			¿Qué palabra corresponde a esta definición?\n			";}

  function program10(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<span class=\"word\">";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n			";
    return buffer;}

  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<span class=\"hint\">";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n			";
    return buffer;}

  function program14(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<img class=\"image\" src=\"";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n			";
    return buffer;}

  function program16(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<li class=\"note";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers['if'];
    tmp1 = self.program(17, program17, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\">\n				<i class=\"";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers['if'];
    tmp1 = self.program(19, program19, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(21, program21, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\"></i>\n				";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n			</li>\n			";
    return buffer;}
  function program17(depth0,data) {
    
    
    return " correct";}

  function program19(depth0,data) {
    
    
    return "icon-ok";}

  function program21(depth0,data) {
    
    
    return "icon-remove";}

    buffer += "<div class=\"rounds\">\n	";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth0.rounds;
    stack2 = helpers.each;
    tmp1 = self.programWithDepth(program1, data, depth0);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
}});

window.require.define({"views/games/fatfingers": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data,depth1) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n	<div><div class=\"auto-center\">\n		<div class=\"round\">Round ";
    foundHelper = helpers.round;
    stack1 = foundHelper || depth0.round;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "round", { hash: {} }); }
    buffer += escapeExpression(stack1) + "/";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth1.rounds;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.length);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "...rounds.length", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n		<span class=\"help\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 1;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 20;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 21;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 22;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(10, program10, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</span>\n		";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = "1,20,21,22";
    stack2['compare'] = stack3;
    foundHelper = helpers.if_in;
    stack3 = foundHelper || depth0.if_in;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		<div class=\"type\">\n			";
    foundHelper = helpers.match;
    stack1 = foundHelper || depth0.match;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		<div class=\"letters\">\n			";
    foundHelper = helpers.match_shuffled;
    stack1 = foundHelper || depth0.match_shuffled;
    stack2 = helpers.each;
    tmp1 = self.program(18, program18, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div></div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n			Escribe la traducción de la palabra.\n			";}

  function program4(depth0,data) {
    
    
    return "\n			Escribe la palabra que representa esta imagen.\n			";}

  function program6(depth0,data) {
    
    
    return "\n			Escribe el género contrario.\n			";}

  function program8(depth0,data) {
    
    
    return "\n			Escribe el sinónimo correcto.\n			";}

  function program10(depth0,data) {
    
    
    return "\n			Escribe el antónimo correcto.\n			";}

  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<span class=\"word\">";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		";
    return buffer;}

  function program14(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<img class=\"image\" src=\"";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n		";
    return buffer;}

  function program16(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<span data-expect=\"";
    stack1 = depth0;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"></span>\n			";
    return buffer;}

  function program18(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<a class=\"letter\">\n				";
    stack1 = depth0;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n			</a>\n			";
    return buffer;}

    buffer += "<div class=\"rounds\">\n	";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth0.rounds;
    stack2 = helpers.each;
    tmp1 = self.programWithDepth(program1, data, depth0);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
}});

window.require.define({"views/games/flipcards": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data,depth1) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n	<div><div class=\"auto-center\">\n		<div class=\"round\">Round ";
    foundHelper = helpers.round;
    stack1 = foundHelper || depth0.round;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "round", { hash: {} }); }
    buffer += escapeExpression(stack1) + "/";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth1.rounds;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.length);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "...rounds.length", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n		<span class=\"help\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 1;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 20;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 21;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 22;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(10, program10, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</span>\n		<ul class=\"cards\">\n			";
    foundHelper = helpers.choices;
    stack1 = foundHelper || depth0.choices;
    stack2 = helpers.each;
    tmp1 = self.programWithDepth(program12, data, depth1);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</ul>\n	</div></div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n			Empareja cada palabra con su traducción.\n			";}

  function program4(depth0,data) {
    
    
    return "\n			Empareja cada palabra con su representación.\n			";}

  function program6(depth0,data) {
    
    
    return "\n			Empareja cada palabra con su otro género.\n			";}

  function program8(depth0,data) {
    
    
    return "\n			Empareja sinónimos.\n			";}

  function program10(depth0,data) {
    
    
    return "\n			Empareja antónimos.\n			";}

  function program12(depth0,data,depth2) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<li class=\"card\" data-word=\"";
    foundHelper = helpers.id;
    stack1 = foundHelper || depth0.id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n				<span class=\"front\"></span>\n				";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    stack2 = helpers['if'];
    tmp1 = self.program(13, program13, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    foundHelper = helpers.match;
    stack1 = foundHelper || depth0.match;
    stack2 = helpers['if'];
    tmp1 = self.programWithDepth(program15, data, depth2);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</li>\n			";
    return buffer;}
  function program13(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<span class=\"back\">";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n				";
    return buffer;}

  function program15(depth0,data,depth3) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n					";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth3.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(18, program18, data);
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program16(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            			<img class=\"back\" src=\"";
    foundHelper = helpers.match;
    stack1 = foundHelper || depth0.match;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "match", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"/>\n            		";
    return buffer;}

  function program18(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n            			<span class=\"back\">";
    foundHelper = helpers.match;
    stack1 = foundHelper || depth0.match;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "match", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n            		";
    return buffer;}

    buffer += "<div class=\"rounds\">\n	";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth0.rounds;
    stack2 = helpers.each;
    tmp1 = self.programWithDepth(program1, data, depth0);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
}});

window.require.define({"views/games/whichone": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data,depth1) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n	<div><div class=\"auto-center\">\n		<div class=\"round\">Round ";
    foundHelper = helpers.round;
    stack1 = foundHelper || depth0.round;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "round", { hash: {} }); }
    buffer += escapeExpression(stack1) + "/";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth1.rounds;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.length);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "...rounds.length", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n		<span class=\"help\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 1;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 21;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 22;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 26;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(10, program10, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</span>\n		<div class=\"word-container\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = "1,21,22,26";
    stack2['compare'] = stack3;
    foundHelper = helpers.if_in;
    stack3 = foundHelper || depth0.if_in;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 2;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		<ul class=\"choices\">\n			";
    foundHelper = helpers.choices;
    stack1 = foundHelper || depth0.choices;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</ul>\n	</div></div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n			Elige la traducción correcta.\n			";}

  function program4(depth0,data) {
    
    
    return "\n			¿Qué palabra corresponde a la imagen?\n			";}

  function program6(depth0,data) {
    
    
    return "\n			Elige el sinónimo correcto.\n			";}

  function program8(depth0,data) {
    
    
    return "\n			Elige el antónimo correcto.\n			";}

  function program10(depth0,data) {
    
    
    return "\n			Elige la palabra que corresponda a la traducción.\n			";}

  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<span class=\"word\">";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n			";
    return buffer;}

  function program14(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<img class=\"image\" src=\"";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n			";
    return buffer;}

  function program16(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<li class=\"note";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers['if'];
    tmp1 = self.program(17, program17, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\">\n				<i class=\"";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers['if'];
    tmp1 = self.program(19, program19, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(21, program21, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\"></i>\n				";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n			</li>\n			";
    return buffer;}
  function program17(depth0,data) {
    
    
    return " correct";}

  function program19(depth0,data) {
    
    
    return "icon-ok";}

  function program21(depth0,data) {
    
    
    return "icon-remove";}

    buffer += "<div class=\"rounds\">\n	";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth0.rounds;
    stack2 = helpers.each;
    tmp1 = self.programWithDepth(program1, data, depth0);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
}});

window.require.define({"views/games/yayornay": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data,depth1) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n	<div><div class=\"auto-center\">\n		<div class=\"round\">Round ";
    foundHelper = helpers.round;
    stack1 = foundHelper || depth0.round;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "round", { hash: {} }); }
    buffer += escapeExpression(stack1) + "/";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth1.rounds;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.length);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "...rounds.length", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n		<span class=\"help\">\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 12;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 13;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 14;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 15;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 16;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(10, program10, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 17;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 18;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 23;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 28;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(18, program18, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 29;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(20, program20, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 30;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(22, program22, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    foundHelper = helpers.variation;
    stack1 = foundHelper || depth1.variation;
    stack2 = {};
    stack3 = 31;
    stack2['compare'] = stack3;
    foundHelper = helpers.if_eq;
    stack3 = foundHelper || depth0.if_eq;
    tmp1 = self.program(24, program24, data);
    tmp1.hash = stack2;
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</span>\n		<div class=\"word-container\">\n			<span class=\"word\">";
    foundHelper = helpers.word;
    stack1 = foundHelper || depth0.word;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "word", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		</div>\n		<ul class=\"choices\">\n			<li class=\"note";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers['if'];
    tmp1 = self.program(26, program26, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\">\n				<i class=\"";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers['if'];
    tmp1 = self.program(28, program28, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(30, program30, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\"></i>\n				Yes\n			</li>\n			<li class=\"note";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers.unless;
    tmp1 = self.program(32, program32, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\">\n				<i class=\"";
    foundHelper = helpers.correct;
    stack1 = foundHelper || depth0.correct;
    stack2 = helpers.unless;
    tmp1 = self.program(34, program34, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(36, program36, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\"></i>\n				No\n			</li>\n		</ul>\n	</div></div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n			Esta palabra, ¿se refiere a una persona?\n			";}

  function program4(depth0,data) {
    
    
    return "\n			############concrete\n			";}

  function program6(depth0,data) {
    
    
    return "\n			¿Puedes tocarlo?\n			";}

  function program8(depth0,data) {
    
    
    return "\n			¿Puedes verlo?\n			";}

  function program10(depth0,data) {
    
    
    return "\n			¿Puedes comprarlo en una tienda?\n			";}

  function program12(depth0,data) {
    
    
    return "\n			Esta palabra ¿se refiere a un ser vivo?\n			";}

  function program14(depth0,data) {
    
    
    return "\n			############weight\n			";}

  function program16(depth0,data) {
    
    
    return "\n			¿Existía hace 500 años?\n			";}

  function program18(depth0,data) {
    
    
    return "\n			Esta palabra, ¿es de género femenino?\n			";}

  function program20(depth0,data) {
    
    
    return "\n			Esta palabra ¿es un verbo?\n			";}

  function program22(depth0,data) {
    
    
    return "\n			Esta palabra, ¿es del género masculino?\n			";}

  function program24(depth0,data) {
    
    
    return "\n			Esta palabra ¿es un sustantivo?\n			";}

  function program26(depth0,data) {
    
    
    return " correct";}

  function program28(depth0,data) {
    
    
    return "icon-ok";}

  function program30(depth0,data) {
    
    
    return "icon-remove";}

  function program32(depth0,data) {
    
    
    return " correct";}

  function program34(depth0,data) {
    
    
    return "icon-ok";}

  function program36(depth0,data) {
    
    
    return "icon-remove";}

    buffer += "<div class=\"rounds\">\n	";
    foundHelper = helpers.rounds;
    stack1 = foundHelper || depth0.rounds;
    stack2 = helpers.each;
    tmp1 = self.programWithDepth(program1, data, depth0);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
}});

window.require.define({"views/header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div id=\"header-logged\">\n	<span>¡Hola ";
    foundHelper = helpers.username;
    stack1 = foundHelper || depth0.username;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "username", { hash: {} }); }
    buffer += escapeExpression(stack1) + "!</span>\n	<a class=\"ribbon-button button-logout\">Salir</a>\n</div>";
    return buffer;});
}});

window.require.define({"views/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<ul id=\"home-games\">\n	<li><a href=\"/play/yayornay\"><img src=\"images/games/yayornay.png\"/><b>yay or nay</b></a></li>\n	<li><a href=\"/play/association\"><img src=\"images/games/association.png\"/><b>association</b></a></li>\n	<li><a href=\"/play/fatfingers\"><img src=\"images/games/fatfingers.png\"/><b>fat fingers</b></a></li>\n	<li><a href=\"/play/whichone\"><img src=\"images/games/whichone.png\"/><b>which one</b></a></li>\n	<li><a href=\"/play/flipcards\"><img src=\"images/games/flipcards.png\"/><b>flip cards</b></a></li>\n	<li><img src=\"images/games/blocked.png\"/><b>challenge</b></li>\n</ul>\n";});
}});

window.require.define({"views/loading": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<span class=\"loading-text\">Cargando</span>\n<span class=\"l-1\"></span>\n<span class=\"l-2\"></span>\n<span class=\"l-3\"></span>\n<span class=\"l-4\"></span>\n<span class=\"l-5\"></span>\n<span class=\"l-6\"></span>\n";});
}});

window.require.define({"views/prueba": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<b>asfd</b>";});
}});

