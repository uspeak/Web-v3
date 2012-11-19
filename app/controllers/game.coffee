GamesResource = require 'models/games'
GameHeader = require 'controllers/game.header'
GameStatus = require 'controllers/game.status'
Utils = require 'utils'

class Game extends Spine.Controller
  elements:
    '.rounds>*':'rounds'

  constructor: ->
    @className = "game-#{@name} game"
    super
    @resource = new GamesResource()
    @resource.bind 'game:loaded', @loaded
    @header = new GameHeader()
    @status = new GameStatus()

  activate: ->
    # @reset()
    @resource.get
      game: @id
    super
  
  reset: ->
    @round = null
    @status.hide()
    @header.hide()
    if @timer
      @timer.pause()
      delete @timer

  deactivate: ->
    super
    @reset()

  loaded: (data) =>
    @setData data[0]

  getRounds: ->
    []

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
    if typeof round isnt "undefined"
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
    @header.show()
    @timer = new Utils.TimerInterval => 
      seconds--
      @header.setSeconds seconds
      if seconds is 0
        @timer.pause() 
        @gameOver()
    , 1000

    @html require(@template)(@context())
    @prepend @header
    @append @status
    @goRound 0

module.exports = Game
