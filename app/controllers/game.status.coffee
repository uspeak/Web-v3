class GameStatus extends Spine.Controller
  className: 'status'
  elements:
    '.gameover':'gameover'
    '.finish':'finish'
    '.pause':'pause'
  constructor: ->
    super
    @render()

  render: ->
    @html require('views/game.status')()

  show: (status) ->
    @el.show()
    @[status].stop().css(scale:0,display:'block').transition(scale:1, =>
      @trigger "#{status}:show"
    )
    @active = status

  hide: ->
    @[@active]?.hide()
    @trigger '#{@active}:hide'
    @el.hide()
    @active = null

module.exports = GameStatus
