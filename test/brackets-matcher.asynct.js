
var matcher = require('../brackets-matcher')
  , it = require('it-is').style('colour')
  , render = require('render')

exports ['closing bracket'] = function (test){
  it(['<>','{}','[]','()']).every(function (e){
    it(matcher.closing_bracket(e[0],e[1])).ok()
  })
  it(['((','{{','[[','<<']).every(function (e){
    it(matcher.closing_bracket(e[0],e[1])).equal(false)
  })
  test.done()
}

exports ['broken bracket'] = function (test){
  it(['(>','(}','(]','[)','[>','[}','{]','{)','{>','<)','<]','<}'])
  .every(function (e){
    it(matcher.broken_bracket(e[0],e[1])).ok()
  })
  it(['<>','{}','[]','()']).every(function (e){
    it(matcher.broken_bracket(e[0],e[1])).equal(false)
  })
  test.done()
}


exports ['opening bracket'] = function (test){
  it(['(','{','[','<']).every(function (e){
    it(matcher.opening_bracket(e)).ok()
  })
  it(['>','}',']',')']).every(function (e){
    it(matcher.opening_bracket(e)).equal(false)
  })
  test.done()
}

exports ['simplest possible example'] = function (test){
  var brackets = '{one}'
    , output = ['o','n','e']
  output.op = '{'
  output.cl = '}'
  output.tree = true

  matcher(brackets, function (err,tree){
    it(err).equal(null)
    console.log('TREE',tree)
    console.log('EXPE',output)
    it(tree).deepEqual(output)
    test.done()
  })
}

function Xb (opening,closing){
  return function  xb () { //french brances {}
    var tree = []
    while(arguments.length){
      tree.push([].shift.call(arguments))
    }
    tree.op = opening
    tree.cl = closing
    tree.tree = true
    return tree
  }
}

var fb = Xb('{','}')
var eb = Xb('(',')')
var gb = Xb('[',']')
var ab = Xb('<','>')

exports ['nested'] = function (test){

  var brackets = '{{one}}'
    , output = fb(fb('o','n','e'))

  matcher(brackets, function (err,tree){
    it(err).equal(null)
    console.log('TREE',tree)
    console.log('EXPE',output)

    it(tree).deepEqual(output)
    test.done()
  })

}

exports ['many'] = function (test){

  var examples = [
    ['{one}',fb('o','n','e')]
  , ['{{one}}',fb(fb('o','n','e'))]
  , ['{{{one}}}',fb(fb(fb('o','n','e')))]
  , ['{one{two}}',fb('o','n','e',fb('t','w','o'))]
  , ['{{one}x{two}}',fb(fb('o','n','e'),'x',fb('t','w','o'))]
  , ['[one]',gb('o','n','e')]
  , ['[{(<x>)}]',gb(fb(eb(ab('x'))))]
  ]
  var length = examples.length

  it(examples).every(function (args){
    matcher(args[0], function (err,tree){
      it(err).equal(null)
      console.log('TREE',tree)
      console.log('EXPE',args[1])
      console.log('MANY',length)
      it(tree).deepEqual(args[1])

      if(!--length)
        test.done()

    })
  })
}

//*/

exports ['invalid'] = function (test){

  var examples = [
    '(','[','{','<','{{}','[{]}'
  ]
  var length = examples.length

  it(examples).every(function (args){
    matcher(args, function (err,tree){
      console.log(err.message)
      it(err).ok()
      if(!--length)
        test.done()

    })
  })
}


//*/
exports ['toAsync'] = function (test){

  it(matcher.toAsync).function()

  var async = 
    matcher.toAsync(function (){
      return 123
    })

  it(async).function()

  async(test.done )

}