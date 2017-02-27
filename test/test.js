// Generated by CoffeeScript 1.12.3
(function() {
  var errors, i, len, obj, result, results, testData, validid;

  validid = require('./../lib/validid.js');

  testData = require('./testData.js');

  results = [];

  errors = [];

  for (i = 0, len = testData.length; i < len; i++) {
    obj = testData[i];
    result = validid[obj.cardType](obj.id) === obj.expect;
    results.push(result);
    if (!result) {
      errors.push(obj);
    }
  }

  console.log("- Total " + results.length + " test(s)\n- Contains " + errors.length + " error(s)");

  if (errors.length !== 0) {
    console.log(errors);
  }

}).call(this);
