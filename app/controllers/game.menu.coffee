class GameStatus extends Spine.Controller
  className: 'menu'
  events:
    'tap .pause':'pause'
    'tap .play':'resume'

  constructor: ->
    super
    @render()
    @hide()

  render: ->
    @html require('views/game.menu')()

  show: (status) ->
    @el.show()
    @el.css(y:100,opacity:0,display:'block').transition(y:0, opacity:1)

  hide: ->
    @el.hide()

  pause: ->
    @trigger 'pause'

  resume: ->
    @trigger 'resume'

module.exports = GameStatus
