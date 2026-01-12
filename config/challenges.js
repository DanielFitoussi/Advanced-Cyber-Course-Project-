module.exports = [
  {
    id: "web_xss_1",
    name: "Stored XSS in user posts",
    category: "web",
    description: "User input is stored in the database and rendered back to other users without proper output sanitization, allowing JavaScript code execution in the browser.",
    hints: [
      "Posts created by users are displayed to others in the feed.",
      "Check how the application renders user-generated content.",
      "Try inserting simple HTML or script content and observe the browser behavior."
    ]
  },
  {
    id: "web_idor_1",
    name: "IDOR - unauthorized interaction with posts",
    category: "web",
    description: "An authenticated user can interact with a post that does not belong to them by modifying the post identifier in the request.",
    hints: [
      "Look at network requests that include a post ID.",
      "Check whether the server verifies ownership before performing actions.",
      "Try changing the post ID in a request and observe the response."
    ]
  },

  {
  id: "api_auth_1",
  name: "Broken Authentication in API",
  category: "api",
  description: "An API endpoint returns sensitive data without checking if the user is authenticated.",
  hints: [
    "Look for API endpoints that return data.",
    "Try calling an endpoint without logging in.",
    "Check if the server verifies authentication before responding."
  ]
},

{
  id: "api_bola_1",
  name: "Broken Object Level Authorization (BOLA)",
  category: "api",
  description: "An authenticated user can access objects they are not authorized to see by calling a generic API endpoint.",
  hints: [
    "Observe API requests in the Network tab.",
    "Compare endpoints used by the UI with other available API routes.",
    "Try accessing a broader endpoint and inspect the returned data."
  ]
}



];
