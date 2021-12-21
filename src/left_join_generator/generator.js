
function ListToGenerator(l){
  let index = 0
  var G = function(){
    if (!l instanceof Array){
      return null
    }
    if (index < l.length) {
      index++
      return l[index - 1]
    }
    return null
  }

  G.reset = function(){
    index = 0
  }

  G.last = function(){
    if (index <= l.length || (index -1) < 0) return l[index - 1]
    return null
  }
  return G
}

function PermutateGenerators(g1, g2){
  let base = new Array(...arguments)
  let allButLastGenerator = base.slice(0,-1)

  // Prime all but the last element
  allButLastGenerator.map(g => g())

  let G = function(){
    let nextCounter = base.length-1 // Start at the end
    let nextVal = base[nextCounter]() // try to increment
    while (!nextVal){ // if it fails; try incrementing the previous until we get a valid value.
      nextCounter--
      if (nextCounter < 0) {
        return null
      }
      base[nextCounter+1].reset()
      base[nextCounter+1]()
      nextVal = base[nextCounter]()
    }
    if (!nextVal) return null

    return base.map(g => g.last())
  }

  G.reset = function(){
    base.map(g => g.reset())
    allButLastGenerator.map(g => g())
  }

  G.last = function(){
    if (!base[0].last()) return null
    return base.map(g => g.last())
  }

  return G
}


//function LeftNaturalPermutateGenerators(g1, g2){
function PermutateGeneratorsLeftJoin(generators){
  // let generators = new Array(...arguments)

  let allButLastGenerator = generators.slice(0,-1)

  let initialized = false
  let done = false
  let parentPredicates = new Array(generators.length)

  const mergeFilter = naturalLeftJoinMatches

  // Prime all but the last element
  let tick = function(){
    if (done) return
    if (!initialized){
      initialized = true
      allButLastGenerator.forEach(function(g, idx) {
        // Find a value that matches the join predicate of the previous generators current value; if failure we're done.
        if (!findNextValidValue(g, idx)){
          initialized = false
          done = true
        }
      })
    }
    if(!initialized || !tick2(generators.length - 1)){
      done = true
    }
  }

  let findNextValidValue = function(g, idx){
    let nextVal = g()
    while(nextVal && !mergeFilter(idx > 0 ? parentPredicates[idx-1] : {}, nextVal)){
      nextVal = g()
    }

    parentPredicates[idx] = Object.assign({}, nextVal, parentPredicates[idx-1])
    return nextVal
  }

  let tick2 = function(idx){
    if (idx < 0) return false
    let generator = generators[idx]

    // No valid values left in this generator
    let nextVal = findNextValidValue(generator, idx)
    while (!nextVal) {
      if (!tick2(idx-1)){ // try to tick the parent generator
        return false
      }
      // Worked; then we can reset this generator.
      generator.reset()

      // And continue searching for a valid value.
      nextVal = findNextValidValue(generator, idx)
    }

    return nextVal
  }

  let G = function(){
    tick()
    if (done){
      return null
    }
    return generators.map(g => g.last())
  }

  G.reset = function(){
    generators.map(g => g.reset())
    done = false
    initialized = false
  }

  G.last = function(){
    if (!initialized || done) return null
    return generators.map(g => g.last())
  }

  return G
}


function naturalLeftJoinMatches(el1, el2){
  let keys = Object.keys(el1)
  return keys.map(k =>
    (el1[k] === el2[k] || typeof el2[k] === "undefined") ||
    ("*" === el2[k])
  ).reduce((o, n) => o && n, true)
}


module.exports = {
  ListToGenerator,
  PermutateGenerators,
  naturalLeftJoinMatches,
  PermutateGeneratorsLeftJoin,
};
