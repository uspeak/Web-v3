Game = require 'controllers/game'

class Select extends Game
  events:
    'tap .note': 'choose'

  getRounds: (d) ->
    _.map d.W, (data,i) =>
      choices =  _.map data.dist, (word) -> {word:word}
      choices.push word: data.m, correct:true
      word: data.w,
      id: data.id,
      round: i+1,
      choices: _.shuffle choices

  choose: (e) ->
    return if not @canChoose
    el = $(e.target)
    correct = el.is('.correct')
    # Add points
    @addPoints(100) if correct

    # Add game info
    @dataPlayed.push
      id: @data.W[@round].id
      ref: if correct then 1 else 2

    # Animate and go to next round
    el.find('i').show().css(scale:0).transition scale:1, 200,
      => setTimeout (=> @goRound(@round+1)), 340
    @canChoose = false
    
  goRound: ->
    super
    @canChoose = true

  animateRoundIn: (el) ->
    el.addClass('active').css(x:'0')
    el.find('.round').css(x:'100%').transition(x:0, 600)
    el.find('.help').css(x:'100%').transition(x:0, delay: 100,600)
    el.find('.word-container').css(x:'100%').transition(x:0, delay: 300,600)
    el.find('.choices').css(x:'100%').transition(x:0, delay: 700,800)

module.exports = Select