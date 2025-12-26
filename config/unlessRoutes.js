module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/sign-up", method: "POST" },
      { url: "/login", method: "POST" },
      { url: "/api-docs", method: "GET" },
      { url: "/api-docs.json", method: "GET" },
      // { url: "/^\/api\/v1\/test\/*/", method: "PATCH" },
    ],
  },
};
