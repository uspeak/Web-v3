Dialogs = require 'controllers/dialogs'
Games = require 'controllers/games'
Header = require 'controllers/header'
Loading = require 'controllers/loading'
Home = require 'controllers/home'
User = require 'models/user'


class App extends Spine.Stack
  controllers:
    home: Home
    dialogs: Dialogs
    games: Games

  constructor: ->
    super
    @route "/", => 
        console.log('asfsadf')
        @navigate("/home")

    @user = new User()
    @user.setToken('testtoken')
    @loading = new Loading()
    @append @loading
    @initConfig()

  initConfig: ->
    Spine.Route.setup
      history: true
    Spine.Model.host = 'http://v4.uspeakapp.com/'
    $ = @$
    $('a').live 'click', ->
        Spine.Route.navigate $(@).attr('href')
        false
    soundManager.setup
        url: '/swf/',
        preferFlash: false
    
module.exports = App
