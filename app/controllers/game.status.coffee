class GameStatus extends Spine.Controller
  className: 'status'
  elements:
    '.gameover':'gameover'
    '.finish':'finish'

  constructor: ->
    super
    @render()

  render: ->
    @html require('views/game.status')()

  show: (status) ->
    @el.show()
    @[status].css(scale:0,display:'block').transition(scale:1)

  hide: ->
    @el.hide()

module.exports = GameStatus
