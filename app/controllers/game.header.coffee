Utils = require 'utils'

formatTime = (seconds) ->
  date = new Date(null)
  date.setSeconds(seconds)
  date.toTimeString().substr(3, 5)

common = (prev, next) ->
  for s in [0..prev.length]
    if prev[s] != next[s] then break
  s

zeroFill = (number, width) ->
  width -= number.toString().length;
  if width > 0
    return new Array( width + 1 ).join( '0' ) + number;
  return number + ""


stringDifference2 = (prev,next,s) ->
  if s>2
    "#{prev.substr(0,s)}<b>#{prev.substr(s)}</b>"
  else
    # console.log "#{prev.substr(0,s)}<b>#{prev.substr(s,2-s)}</b>:<b>#{prev.substr(3)}</b>"
    "#{prev.substr(0,s)}<b>#{prev.substr(s,2-s)}</b>:<b>#{prev.substr(3)}</b>"

stringDifference3 = (prev,next,s) ->
  "#{next.substr(0,s)}<b>#{prev.substr(s)}</b>"

# Handlebars.registerHelper 'formatTime', formatTime

class GameHeader extends Spine.Controller
  tag: 'header'
  elements:
    '.time':'time'
    '.points':'points'
  styles:
    hide:
      y:'-80px'
    show:
      y: '0px'
  constructor: ->
    super
    @el.css(@styles.hide)
    @render()

  render: ->
    @html require('views/game.header')()

  show: ->
    @el.transition(@styles.show)

  hide: ->
    @el.transition(@styles.hide)

  setPoints: (points) ->
    # if not @pointsSound
    #   @pointsSound = soundManager.createSound
    #     id:'points',
    #     autoLoad:true,
    #     multiShot: true,
    #     volume: 100
    #     url:'/audio/points.mp3'


    points = zeroFill(points,4)
    lastPoints =  @points.text() or zeroFill(0,4)
    s = common(points,lastPoints)
    s = 0
    @points.html stringDifference3(lastPoints, points, s)
    # soundManager.play('points',{multiShot:true})
    timer = new Utils.TimerInterval => 
      s++
      p = stringDifference3(lastPoints, points, s)
      # @log 'POINTS',points, lastPoints, s, p
      # soundManager.play('points',{multiShot:true})
      @points.html p
      if s >= 4
        timer.pause()
    , 120
  
  setSeconds: (@seconds) ->
    # @render() 
    # if not @secondSound
    #   @secondSound = soundManager.createSound
    #     id:'second',
    #     autoLoad:true,
    #     volume: 15
    #     url:'/audio/second.mp3'

    # if @seconds%2==0
    #   @secondSound.play()

    actual = formatTime @seconds
    next = formatTime @seconds-1
    @time.text actual
    s = common actual, next
    # @log '********', s, actual, next
    setTimeout =>
      @time.html stringDifference2(actual,next,0)
    , 200 if s <= 1
    setTimeout =>
      @time.html stringDifference2(actual,next,1)
    , 400 if s <= 1
    setTimeout =>
      @time.html stringDifference2(actual,next,3)
    , 600 if s <= 4
    setTimeout =>
      @time.html stringDifference2(actual,next,4)
    , 800 if s <= 4
    # setTimeout =>
    #   @time.html "<b>#{actual.substr(0,2)}</b>:<b>#{actual.substr(3,2)}</b>"
    # , 500
    # setTimeout =>
    #   @time.html "#{actual.substr(0,2)}<b>:</b>#{actual.substr(3,2)}"
    # , 500
module.exports = GameHeader
