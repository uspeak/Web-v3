class GameStatus extends Spine.Controller
  className: 'menu'
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

module.exports = GameStatus
