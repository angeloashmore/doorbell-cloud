function OnlyNewObjects(message) {
  this.name = "OnlyNewObjects";
  this.message = message || "Tried to call method reserved only for new objects"
  // this.stack = (new Error()).stack;
}
OnlyNewObjects.prototype = Object.create(Error.prototype);
OnlyNewObjects.prototype.constructor = OnlyNewObjects;

module.exports = OnlyNewObjects;
