#!/usr/bin/env node
const { spawn } = require('child_process');
const os = require('os');

// Get the first non-internal IPv4 address
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const networkIP = getNetworkIP();
const port = process.env.PORT || 3000;

console.log(`🚀 Starting development server...`);
console.log(`📱 Local: http://localhost:${port}`);
console.log(`🌐 Network: http://${networkIP}:${port}`);

// Set environment variable for the app
process.env.NEXT_PUBLIC_APP_URL = `http://${networkIP}:${port}`;

// Start Next.js with host binding
const nextProcess = spawn(
  'npx',
  ['next', 'dev', '--turbopack', '-H', '0.0.0.0'],
  {
    stdio: 'inherit',
    env: { ...process.env },
  }
);

nextProcess.on('close', (code) => {
  process.exit(code);
});
