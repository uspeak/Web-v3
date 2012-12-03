GamesResource = require 'models/games'
PlayedResource = GamesResource.Played
GameHeader = require 'controllers/game.header'
GameStatus = require 'controllers/game.status'
GameMenu = require 'controllers/game.menu'
Utils = require 'utils'

class Game extends Spine.Controller
  @extend(Spine.Events)
  elements:
    '.rounds>*':'rounds'

  constructor: ->
    @className = "game-#{@name} game wide-screen"
    super
    @resource = new GamesResource()
    @resource.bind 'game:loaded', @loaded
    @playedResource = new PlayedResource()
    @header = new GameHeader()
    @menu = new GameMenu()
    @status = new GameStatus()
    @status.bind 'gameover:show', => @onFinish()
    @status.bind 'finish:show', => @onFinish()
    @menu.bind 'pause', => @pause()
    @menu.bind 'resume', => @resume()

    @content = $('<div class="content"></div>')
    # @prepend @header, @status
    @append @header, @status, @content, @menu

  activate: ->
    # @reset()
    @resource.get
      game: @id
    super

  sendPlayed: ->
    @playedResource.send
      idg: @id
      idv: @variation
      pts: @points
      instance: @instance
      langdir: "2"
      W: @dataPlayed
      stime: @seconds - @remainSeconds

  reset: ->
    @log 'RESETING'
    @round = null
    @status.hide()
    @header.hide()
    @menu.hide()
    @content.html(false)
    if typeof @timer != "undefined"
      @timer.pause()
      delete @timer

  deactivate: ->
    super
    @reset()
    # @el.empty()

  pause: ->
    @el.addClass('paused')
    @timer.pause()
    @header.hide()
    @rounds.stop().transition(opacity:0)
    @status.show('pause')

  resume: ->
    @el.removeClass('paused')
    @timer.resume()
    @header.show()
    @rounds.stop().transition(opacity:1)
    @status.hide()


  loaded: (data) =>
    try
      @setData data[0]
    catch error
      @log 'ERRORRRR'
      @navigate('/home')

  getRounds: ->
    []

  onFinish: ->
    setTimeout =>
      @navigate '/home'
    , 1500

  animateRoundOut: (el) ->
    return if not el?.length
    el.transition(x:'-100%', opacity: .5, -> el.removeClass('active'))

  animateRoundIn: (el) ->
    return if not el?.length
    el.addClass('active').css(x:'100%').transition(x:0)

  goRound: (round) ->
    @log "Going round #{round}", @rounds
    if @rounds.length == round
        @finish()
    
    @animateRoundOut @rounds.eq(@round) if @round != null
    if typeof round != "undefined"
      @animateRoundIn @rounds.eq(round)
      @round = round
      @$round = @rounds.eq(@round)
    else
      # Game ended
      @reset()
      @sendPlayed()

  gameOver: ->
    @goRound()
    @status.show('gameover')

  finish: ->
    @goRound()
    @status.show('finish')

  addPoints: (points) ->
    @points += points
    @header.setPoints @points

  kill: ->
    @lifes -= 1
    if @lifes == 0
      @gameOver()
    else
      @header.setLifes @lifes

  context: ->
    variation: @variation,
    rounds: @getRounds @data
    
  setData: (@data) ->
    #Init Game Data
    @lifes = 3
    @seconds = @remainSeconds = parseInt @data.seconds
    @variation = parseInt @data.vid
    @instance = parseInt @data.instance
    @points = 0
    @header.setSeconds @remainSeconds
    @header.setPoints 0
    @header.setLifes @lifes
    @dataPlayed = []
    @timer = new Utils.TimerInterval => 
      @remainSeconds--
      @header.setSeconds @remainSeconds
      if @remainSeconds is 0
        @timer.pause() 
        @gameOver()
    , 1000

    # Append to DOM
    @el.removeClass('paused')
    # c = $('<div class="content"></div>')
    @content.html require(@template)(@context())
    # @content = @el.append(c) unless @content
    # @prepend @header, @status
    # @append @menu
    @refreshElements()

    @header.show()
    @menu.show()

    # Init Game
    @goRound 0

module.exports = Game
