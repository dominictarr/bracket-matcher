
exports = module.exports = function (string, callback){

    var chars = string.split('')

   function findBrackets (chars) {
      var parts = []
      parts.tree = true

    if (!exports.opening_bracket(chars[0]))
      throw new Error ('expected opening bracket at: >>' +chars[0] + '<< got' + chars)

    parts.op = chars.shift()

    while (chars.length && !exports.closing_bracket(parts.op, chars[0])) {
      parts.push
        ( exports.opening_bracket(chars[0]) ? findBrackets (chars) 
        : exports.broken_bracket(chars[0]) ? (function (){throw new Error('broken brackets')})() 
        : chars.shift () )
    }
    if(!chars.length)
      throw new Error('expected ' + exports.closing[parts.op] + ' got end of input')
    parts.cl = chars.shift()

    return parts
  }

  exports.toAsync(findBrackets)(chars,callback)

}

exports.opening_bracket = function (char){
  var opening = '({[<'
  console.log("OPENING BRACKET:",!!opening.indexOf(char), " of:", char)
  return -1 !== opening.indexOf(char)
}

exports.closing = {'(': ')', '{': '}', '[': ']', '<': '>' }

exports.closing_bracket = function (opening,char){
  return exports.closing[opening] === char
}

exports.broken_bracket = function (opening,char){
  var closing = {'(': ')', '{': '}', '[': ']', '<': '>' }
  return closing[opening] !== char
}

exports.toAsync = 
  function toAsync(func) {

    return function (){
      var args = []
        , self = this
      while(arguments.length)
        args.push([].shift.call(arguments))

      process.nextTick(function (){
        var callback = args[args.length - 1]
          , returned
        try {
          returned = func.apply(self,args)
        } catch(err){
          if('function' !== typeof callback)
            throw err
          return callback(err)
        }
        callback(null,returned)
      })
    }
  }
