Game = require 'controllers/game'

class FatFingers extends Game
  template: 'views/games/fatfingers'
  id: 2
  name: 'fatfingers'
  events:
    'tap .letter': 'clickLetter'
    'keyup .letter': 'deactivateLetter'
    'mouseup .letter': 'deactivateLetter'
    'mousedown .letter': 'activateLetter'

  constructor: ->
    super
    @$(document).bind 'keypress', (e) => @keypress(e)
    @$(document).bind 'keyup', (e) => @deactivateLetter(e)

  getRounds: (d) ->
    _.map d.W, (data,i) =>
        round: i+1
        word: data.w
        match: data.m.split("")
        match_shuffled: _.shuffle data.m.split("")

  clickLetter: (e) ->
    @log 'CLICK'
    @type $(e.currentTarget)

  type: (el) ->
    letter = el.text().trim()
    return if el.hasClass('completed')
    nextType = @$round.find('.type span:not(.completed)').first()
    nextType.text(letter).css(color:'black', opacity:1)
    # @log nextType, nextType.data('expect'), letter
    if nextType.data('expect') == letter
      nextType.addClass('completed')
      el.addClass('completed')
      el.stop().transition opacity:0, =>
        if nextType.next().length == 0
          @addPoints(100)
          @goRound(@round+1)
    else
      nextType.css(color:'red').stop().transition(opacity:0)
    nextType.text(letter)

  # context: ->
  #   _.extend super,
  #     variationImage: @variation==2
  #     variationWord: @variation==1

  keypress: (e) ->
    return if not @isActive()
    charcode = e.keyCode or e.charCode
    ch = String.fromCharCode(charcode).toLowerCase()
    @log "Pressed key #{ ch }"
    el = @$round.find(".letter:not(.completed):contains('#{ ch }')").first()
    el.addClass('active')
    @letterActive = el
    @type el

  activateLetter: (e) ->
    return if not @isActive()
    @letterActive = $(e.currentTarget)
    @letterActive.addClass('active')

  deactivateLetter: (e) ->
    return if not @isActive() or not @letterActive
    @letterActive.removeClass('active')

module.exports = FatFingers