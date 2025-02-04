const model = {
    getClient: (clientId, clientSecret) => {
      if (clientId === "alexa-client" && clientSecret === "alexa-secret") {
        return { clientId, grants: ["authorization_code", "refresh_token"] };
      }
      return null;
    },
  };
  
  module.exports = model;