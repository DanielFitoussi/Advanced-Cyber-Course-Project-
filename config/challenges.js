module.exports = [
  {
    id: "web_idor_1",
    name: "IDOR - access to other user's post",
    category: "web",
    description: "User can access a post that does not belong to him by changing the id.",
    hints: [
      "Look at requests that load a post by id.",
      "Check if the server checks who owns the post.",
      "Try changing the id in the request."
    ]
  },
  {
    id: "api_bola_1",
    name: "BOLA - user data exposure",
    category: "api",
    description: "API allows access to user data without checking permissions.",
    hints: [
      "Look at api routes that use user id.",
      "Check if authorization is done on the object level.",
      "Try using a different user id."
    ]
  }
];
