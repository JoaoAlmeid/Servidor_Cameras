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
    },
  ],
};
