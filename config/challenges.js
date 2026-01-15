module.exports = [
  {
    id: "web_xss_1",
    name: "Stored XSS in user posts",
    category: "web",
    description: "User input is stored in the database and rendered back to other users without proper output sanitization, allowing JavaScript code execution in the browser.",

  },
  {
    id: "web_idor_1",
    name: "IDOR - unauthorized interaction with posts",
    category: "web",
    description: "An authenticated user can interact with a post that does not belong to them by modifying the post identifier in the request.",
  
  },

  {
  id: "api_auth_1",
  name: "Broken Authentication in API",
  category: "api",
  description: "An API endpoint returns sensitive data without checking if the user is authenticated.",

},

{
  id: "api_bola_1",
  name: "Broken Object Level Authorization (BOLA)",
  category: "api",
  description: "An authenticated user can access objects they are not authorized to see by calling a generic API endpoint.",

},
{
  id: "llm_prompt_injection_1",
  name: "LLM Prompt Injection",
  category: "llm",
  description: "An attacker can manipulate the language model to ignore system instructions and reveal internal logic.",

}




];
