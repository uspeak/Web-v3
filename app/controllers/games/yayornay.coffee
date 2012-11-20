Select = require 'controllers/games/select'

class YayOrNay extends Select
  template: 'views/games/yayornay'
  id: 4
  name: 'yayornay'

  getRounds: (d) ->
    _.map d.W, (data,i) =>
      word: data.w,
      id: data.id,
      round: i+1,
      correct: data.m

module.exports = YayOrNay