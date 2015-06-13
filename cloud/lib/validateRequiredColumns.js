function validateRequiredColumns(object, requiredColumns) {
  return Parse.Promise.as().then(function() {
    for (let columnName in requiredColumns) {
      if (!object.get(columnName)) {
        if (requiredColumns[columnName]) {
          user.set(columnName, requiredColumns[columnName]);
        } else {
          return Parse.Promise.error(errorMessage);
        }
      }
    }
  });
}

module.exports = validateRequiredColumns();
