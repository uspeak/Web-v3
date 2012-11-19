Game = require 'controllers/game'

split =  (a, size) ->
    len = a.length
    out = []
    i = 0
    while (i < len)
        out.push a.slice(i, i + size)
        i += size
    out

class FlipCards extends Game
  id: 1
  template: 'views/games/flipcards'
  name: 'flipcards'
  events:
    'tap .card': 'match'
  styles:
    selected:
        borderColor: '#6BB7D1'
    normal:
        borderColor: 'white'
    wrong:
        borderColor: 'red'

  getRounds: (d) ->
    pairs = split(d.W, 6) #6 pairs of words
    m = _.map pairs, (data,i) =>
      choices = []
      for word in data
        choices.push
            word: word.w
            id: word.id
        choices.push
            match: word.m
            id: word.id
      round: i+1,
      choices: _.shuffle choices

  match: (e) ->
    el = $(e.currentTarget)
    if not el.not(@selectedCard).length
        el.find('.back').css(@styles.normal)
        delete @selectedCard
        return
    if not @selectedCard
        el.find('.back').css(@styles.selected)
        @selectedCard = el
    else
        if @selectedCard.data('word') == el.data('word')
            @selectedCard.find('.back').css(@styles.normal)
            el.add(@selectedCard).addClass('matched').find('.back').transition(
                perspective: '400px',
                rotateY: '180deg',
                =>
                    @goRound(@round+1) if not @$round.find('.card').not('.matched').length
            )
            el.add(@selectedCard).find('.front').transition(
                perspective: '400px',
                rotateY: '0'
            )
        else
           el.add(@selectedCard).find('.back').css(@styles.wrong).transition(@styles.normal)
        delete @selectedCard
  
module.exports = FlipCards