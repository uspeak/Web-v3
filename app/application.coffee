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
    @cordova = window.cordova #(typeof window.device != "undefined")
    @route "/", => 
        @navigate("/home")
    
    # @log 'CORDOVA', @cordova
    # if @cordova
    #     
    # @navigate("/")
    @user = new User()
    @user.setToken('testtoken')
    @loading = new Loading()
    @prepend @loading
    @initConfig()

  initConfig: ->
    Spine.Model.host = 'http://v5.uspeakapp.com/'
    if @cordova
        Spine.Route.setup()
        @navigate("/") if (typeof window.device != "undefined")
    else
        Spine.Route.setup()

    $ = @$
    @games.el.add(@dialogs.el).add(@loading.el).on "touchmove", (e)-> e.preventDefault()

    $('a').live 'click', ->
        href = $(@).attr('href')
        Spine.Route.navigate href if href
        false
    soundManager.setup
        url: '/swf/',
        preferFlash: false
    
module.exports = App
