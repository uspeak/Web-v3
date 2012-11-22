GamesResource = require 'models/games'
GameHeader = require 'controllers/game.header'
GameStatus = require 'controllers/game.status'
GameMenu = require 'controllers/game.menu'
Utils = require 'utils'

class Game extends Spine.Controller
  @extend(Spine.Events)
  elements:
    '.rounds>*':'rounds'

  constructor: ->
    @className = "game-#{@name} game"
    super
    @resource = new GamesResource()
    @resource.bind 'game:loaded', @loaded
    @header = new GameHeader()
    @menu = new GameMenu()
    @status = new GameStatus()
    @status.bind 'gameover:show', => @onFinish()
    @status.bind 'finish:show', => @onFinish()
    @menu.bind 'pause', => @pause()
    @menu.bind 'resume', => @resume()

  activate: ->
    # @reset()
    @resource.get
      game: @id
    super
  
  reset: ->
    @log 'RESETING'
    @round = null
    @status.hide()
    @header.hide()
    @menu.hide()
    if typeof @timer != "undefined"
      @timer.pause()
      delete @timer

  deactivate: ->
    super
    @reset()
    @el.empty()

  pause: ->
    @el.addClass('paused')
    @timer.pause()
    @header.hide()
    @rounds.transition(opacity:0)
    @status.show('pause')

  resume: ->
    @el.removeClass('paused')
    @timer.resume()
    @header.show()
    @rounds.transition(opacity:1)
    @status.hide()


  loaded: (data) =>
    @setData data[0]

  getRounds: ->
    []

  onFinish: ->
    setTimeout =>
      @navigate '/'
    , 1500

  animateRoundOut: (el) ->
    return if not el?.length
    el.transition(x:'-100%', opacity: .5)

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
      @reset()

  gameOver: ->
    @goRound()
    @status.show('gameover')

  finish: ->
    @goRound()
    @status.show('finish')

  addPoints: (points) ->
    @points += points
    @header.setPoints @points

  context: ->
    variation: @variation,
    rounds: @getRounds @data
    
  setData: (@data) ->
    @seconds = seconds = parseInt @data.seconds
    @variation = parseInt @data.vid
    @instance = parseInt @data.instance
    @points = 0
    @header.setSeconds seconds
    @header.setPoints 0
    @timer = new Utils.TimerInterval => 
      seconds--
      @header.setSeconds seconds
      if seconds is 0
        @timer.pause() 
        @gameOver()
    , 1000

    @html require(@template)(@context())
    @prepend @header, @status, @menu
    @header.show()
    @menu.show()
    @goRound 0

module.exports = Game
