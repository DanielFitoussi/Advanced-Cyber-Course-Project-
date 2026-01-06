module.exports = [
  {
    id: "web_xss_1",
    name: "Stored XSS in posts",
    category: "web",
    description: "User input is stored and rendered as HTML without proper sanitization.",
    hints: [
      "User-generated content is displayed in the feed.",
      "Check how the application handles HTML inside posts.",
      "Try inserting a harmless HTML element and observe the result."
    ]
  }
];
