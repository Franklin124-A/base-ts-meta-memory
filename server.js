const { spawn } = require('child_process');
const path = require('path');

// Ruta absoluta del archivo app.js generado por Rollup
const appPath = path.join(__dirname, 'dist', 'app.js');

// Lanza tu aplicación Node.js
const child = spawn('node', [appPath], { stdio: 'inherit' });

child.on('exit', (code) => {
  console.log(`App exited with code ${code}`);
});
