module.exports = {
  apps: [
    {
      name: "pg-contact-form",                  // Nome del processo in PM2
      script: "server.ts",                      // Il file da avviare
      cwd: "./pg-contact-form",                 // La cartella dove si trova questo server
      interpreter: "/home/tony/.bun/bin/bun",   // Percorso assoluto di Bun (verifica con 'which bun')
      env: {
        PORT: 6969
      }
    },
  ]
};