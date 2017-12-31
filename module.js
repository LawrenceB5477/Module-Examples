//Ghetto module function thing
var dayName = function() {
  var names = ["Monday", "Tuesday", "Wednesday", "Thursday",
"Friday", "Saturday", "Sunday"];
  return function(number) {
    return names[number - 1];
  }
}();

//Immedietly invoked function expression
(function() {
  function square(x) {
    return x * x;
  }
  console.log(square(2));
})();

console.log(dayName(2));

//Object as interface
var weekDay = function() {
  var names = ["Monday", "Tuesday", "Wednesday", "Thursday",
"Friday", "Saturday", "Sunday"];
  return {
    name: function(number) {
      return names[number];
    },
    number: function(name) {
      return names.indexOf(name);
    }
  }
}();

console.log(weekDay.number("Monday"));

//Using object as argument, allows you to place internal code next to export
//Common for modules intended for browser
(function(exports) {
  var names = ["Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday"];
  exports.name = function(number) {
    return names[number];
  }
  exports.number = function(name) {
    return names.indexOf(name);
  }
})(this.weekDayModule = {});

console.log(weekDayModule.name(weekDayModule.number("Saturday")));

function evalCode(code) {
  eval(code);
  return x;
}

console.log(evalCode("var x = 2"));

var plusOne = new Function("n", "return n + 1");
console.log(plusOne(2));

//Require

var name = `
var names = [" Sunday " , " Monday " , " Tuesday " , " Wednesday " ,
" Thursday " , " Friday " , " Saturday "];

exports.name = function(number) {
  return names[number];
}

exports.number = function(name) {
  return names.indexOf(name);
}
`

//Can make this a function that reads a file...
function readFile(name) {
  return name;
}

/*
function require(name) {
  var code = new Function("exports", readFile(name));
  var exports = {};
  code(exports);
  return exports;
}

var weekdays = require(name);
console.log(weekdays.name(2));
*/
//Improved requires - COMMONJS MODULE REQIURE
//BAD FOR WEB MODULES - one script can run at a time
function require(name) {
  if (name in require.cache) {
    return require.cache[name];
  }
  var code = new Function("exports, module", readFile(name));
  var exports = {};
  var module = {exports:exports};
  code(exports, module);
  reqiure.cache[name] = module.exports;
  return module.exports;
}
require.cache = new Object(null);

//AMD module - asychronys module definition
//wrap module in function - module loader loads dependencies in background
// - then calls the function to initialize the function when the dependencies load
//define, first arg is array of modules, second is function that is called when loaded
//modules loaded this way must return an object that represents their interface in the function
define(["weekDay", "today"], function(weekDay, today) {
  console.log(weekDay.name(today.dayNumber()));
});

define([], function() {
  var names = [" Sunday " , " Monday " , " Tuesday " , " Wednesday " ,
" Thursday " , " Friday " , " Saturday "];

  return {
    name : function ( number ) { return names [ number ]; } ,
    number : function ( name ) { return names . indexOf ( name ) ; }
  }
});

//backgroundReadFile - takes file name and function, calls function with content of file when file loads
var defineCache = Object.create(null);
var currentMod = null;

function getModule(name) {
  if (name in defineCache)
    return defineCache[name];

  var module ={exports: null,
  loaded: false,
  onLoad: []};

  defineCache[name] = module;

  backgroundReadFile(name, function(code) {
    currentMod = module;
    new Function("", code)();
  });
  return module;
}
