// Local (client-only) collection to contain user-generated error messages
Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};
