class TimerInterval
  
  constructor: (@callback, @remaining) ->
    @timerId = undefined
    @start = undefined
    @resume()

  pause: ->
    window.clearInterval @timerId
    # @remaining -= new Date() - @start

  resume: ->
    @start = new Date()
    @timerId = window.setInterval(@callback, @remaining)

module.exports = 
  TimerInterval: TimerInterval
