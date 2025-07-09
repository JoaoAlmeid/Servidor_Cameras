module.exports = {
  apps: [
    {
      name: 'backend-camera',
      script: './dist/server.cjs',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1024M',
      time: true,
      interpreter_args: '--max-old-space-size=1024',
      env: {
        NODE_ENV: 'production',
        FRONTEND_URL: 'https://camera.ccomfm.com.br',
        BACKEND_URL: 'https://zdxv152.ccomfm.com.br',
        PORT: '3450'
      }
    },
  ],
};
