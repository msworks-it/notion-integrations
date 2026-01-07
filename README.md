# Notion Integrations / Integrazioni Notion

[🇬🇧 English](#english) | [🇮🇹 Italiano](#italiano)

---

<a id="english"></a>
## 🇬🇧 English

### Overview

This repository contains various integrations for Notion, designed to synchronize data from different sources to Notion databases.

### Available Integrations

#### 📋 [pg-contact-form](./pg-contact-form)
Synchronizes contact form submissions from PostgreSQL to a Notion database. This integration automatically transfers new contact messages to Notion, marking them as synced to avoid duplicates.

**Features:**
- ✅ Automatic synchronization of contact messages
- ✅ Duplicate prevention with sync tracking
- ✅ Rate limiting (5-minute minimum between syncs)
- ✅ HTTP endpoint for manual sync triggering
- ✅ PostgreSQL database integration via Prisma

### Quick Start

1. Navigate to the specific integration folder
2. Follow the README instructions in that folder
3. Configure environment variables as specified
4. Install dependencies: `bun install`
5. Run the integration

### Requirements

- [Bun](https://bun.sh/) runtime
- PostgreSQL database (for pg-contact-form)
- Notion account with API integration

### Deployment

This repository includes a PM2 configuration file ([ecosystem.config.js](./ecosystem.config.js)) for easy deployment and process management.

```bash
# Deploy with PM2
pm2 start ecosystem.config.js
```

### License

See [LICENSE](./LICENSE) file for details.

---

<a id="italiano"></a>
## 🇮🇹 Italiano

### Panoramica

Questo repository contiene diverse integrazioni per Notion, progettate per sincronizzare dati da diverse fonti verso database Notion.

### Integrazioni Disponibili

#### 📋 [pg-contact-form](./pg-contact-form)
Sincronizza i messaggi dei form di contatto da PostgreSQL a un database Notion. Questa integrazione trasferisce automaticamente i nuovi messaggi di contatto su Notion, contrassegnandoli come sincronizzati per evitare duplicati.

**Caratteristiche:**
- ✅ Sincronizzazione automatica dei messaggi di contatto
- ✅ Prevenzione duplicati con tracciamento sincronizzazione
- ✅ Rate limiting (minimo 5 minuti tra le sincronizzazioni)
- ✅ Endpoint HTTP per trigger manuale della sincronizzazione
- ✅ Integrazione database PostgreSQL tramite Prisma

### Avvio Rapido

1. Naviga nella cartella dell'integrazione specifica
2. Segui le istruzioni nel README di quella cartella
3. Configura le variabili d'ambiente come specificato
4. Installa le dipendenze: `bun install`
5. Esegui l'integrazione

### Requisiti

- Runtime [Bun](https://bun.sh/)
- Database PostgreSQL (per pg-contact-form)
- Account Notion con integrazione API

### Deployment

Questo repository include un file di configurazione PM2 ([ecosystem.config.js](./ecosystem.config.js)) per semplificare il deployment e la gestione dei processi.

```bash
# Deploy con PM2
pm2 start ecosystem.config.js
```

### Licenza

Vedi il file [LICENSE](./LICENSE) per i dettagli.

---

### Contributing / Contribuire

Contributions are welcome! / I contributi sono benvenuti!

1. Fork the repository / Fai il fork del repository
2. Create your feature branch / Crea il tuo branch per la feature
3. Commit your changes / Committa le tue modifiche
4. Push to the branch / Fai il push del branch
5. Open a Pull Request / Apri una Pull Request
