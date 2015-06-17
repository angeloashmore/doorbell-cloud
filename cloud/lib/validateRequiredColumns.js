const validateRequiredColumns = function(object, requiredColumns) {
  return Parse.Promise.as().then(function() {
    for (var columnName in requiredColumns) {
      if (!object.get(columnName)) {
        if (requiredColumns[columnName] !== undefined) {
          object.set(columnName, requiredColumns[columnName]);
        } else {
          const errorMessage = columnName + " is required";
          return Parse.Promise.error(errorMessage);
        }
      }
    }
  });
}

module.exports = validateRequiredColumns;
