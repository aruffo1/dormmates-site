module.exports = {
  apps: [
    {
      name: "dormmates",
      namespace: "jajams",
      cwd: ".",
      script: "app.js",
      autorestart: true,
      max_restarts: 10,
      listen_timeout: 8000,
      watch: true,
      env: {
        PORT: "3001",
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
