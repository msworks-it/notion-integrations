# pg-contact-form - PostgreSQL to Notion Contact Sync

[🇬🇧 English](#english) | [🇮🇹 Italiano](#italiano)

---

<a id="english"></a>
## 🇬🇧 English

### Overview

This integration automatically synchronizes contact form submissions from a PostgreSQL database to a Notion database. It's designed to bridge your website contact forms with Notion, enabling better contact management and follow-up workflows.

### Features

- ✅ **Automatic Sync**: Transfers new contact messages from PostgreSQL to Notion
- ✅ **Duplicate Prevention**: Tracks synced messages to avoid duplicates
- ✅ **Rate Limiting**: Prevents excessive syncing (minimum 5-minute interval)
- ✅ **HTTP Endpoint**: Provides `/sync` endpoint for manual triggers
- ✅ **Prisma Integration**: Type-safe database operations
- ✅ **Notion API**: Full integration with Notion's Pages API

### Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- PostgreSQL database
- Notion account with API access
- Notion database with proper schema (see below)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd pg-contact-form
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure environment variables** (see [Environment Variables](#environment-variables))

4. **Initialize the database:**
   ```bash
   bunx prisma db push
   ```

### Environment Variables

Create a `.env` file in the `pg-contact-form` directory with the following variables:

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Notion Integration
INTEGRATION_SECRET="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
DATABASE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Optional: Node Environment
NODE_ENV="development"
```

#### Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string. Must include credentials, host, port, and database name. |
| `INTEGRATION_SECRET` | ✅ Yes | Your Notion integration token. Get it from [Notion Integrations](https://www.notion.so/my-integrations). |
| `DATABASE_ID` | ✅ Yes | The ID of your Notion database. Found in the database URL: `notion.so/workspace/DATABASE_ID?v=...` |
| `NODE_ENV` | ❌ No | Environment mode. Use `production` for production deployments. Default: `development` |

### Notion Database Schema

Your Notion database must have the following properties:

| Property Name | Type | Description |
|--------------|------|-------------|
| `full_name` | Title | Contact's full name |
| `email` | Email | Contact's email address |
| `message` | Rich Text | The contact message |
| `created_at` | Date | Timestamp of when the message was created |

**Setup Instructions:**
1. Create a new database in Notion
2. Add the properties listed above
3. Share the database with your integration
4. Copy the database ID from the URL

### Database Schema

The PostgreSQL database uses the following tables (managed by Prisma):

#### `contact_messages`
Stores contact form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key (auto-increment) |
| `name` | String | Contact's name |
| `email` | String | Contact's email |
| `message` | String | Message content |
| `synced` | Boolean | Whether synced to Notion (default: false) |
| `createdAt` | DateTime | Creation timestamp |

#### `notion_syncs`
Tracks synchronization history.

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key (auto-increment) |
| `last_synced_at` | DateTime | Last sync timestamp |

### Usage

#### Start the Server

```bash
bun run server.ts
```

The server will start on port **6969** by default.

#### Sync Endpoint

**GET** `http://localhost:6969/sync`

Triggers a synchronization of unsynced contacts from PostgreSQL to Notion.

**Responses:**

- `200 OK` - Sync completed successfully
  ```
  Synced 5 contacts
  ```

- `200 OK` - Sync skipped (too soon since last sync)
  ```
  Sync skipped - too soon since last sync
  ```

- `500 Internal Server Error` - Sync failed
  ```
  Error: [error message]
  ```

#### Programmatic Usage

```typescript
import { sync } from "./lib/sync";

// Trigger sync
const result = await sync();

if (result.skipped) {
  console.log('Sync skipped - too soon since last sync');
} else {
  console.log(`Synced ${result.syncedCount} contacts`);
}
```

### Deployment

#### Using PM2

The repository includes a PM2 configuration. Update the `interpreter` path in [ecosystem.config.js](../ecosystem.config.js) with your Bun path:

```bash
# Find your Bun path
which bun  # Linux/Mac
where.exe bun  # Windows
```

Then deploy:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable autostart on boot
```

#### Environment Setup for Production

1. Set `NODE_ENV=production` in your environment
2. Ensure all environment variables are properly configured
3. Configure your PostgreSQL database for production use
4. Set up proper database backups
5. Monitor logs with `pm2 logs pg-contact-form`

### Project Structure

```
pg-contact-form/
├── server.ts              # HTTP server entry point
├── lib/
│   ├── sync.ts           # Main sync logic
│   ├── notion.ts         # Notion client setup
│   └── prisma.ts         # Prisma client setup
├── prisma/
│   └── schema.prisma     # Database schema
├── generated/            # Generated Prisma client
└── notion/
    └── mappers/
        └── contacts.ts   # Contact mapping logic
```

### Troubleshooting

#### Sync not working

1. **Check environment variables**: Ensure all required variables are set
2. **Verify Notion permissions**: The integration must have access to the database
3. **Check database connection**: Test your PostgreSQL connection string
4. **Review logs**: Check for error messages in the console or PM2 logs

#### Database connection errors

```bash
# Test database connection
bunx prisma db pull
```

#### Notion API errors

- Verify your integration token is valid
- Ensure the database is shared with your integration
- Check that property names match exactly (case-sensitive)

### Rate Limiting

The integration includes built-in rate limiting:
- **Minimum interval**: 5 minutes between syncs
- **Reason**: Prevents excessive API calls to both PostgreSQL and Notion
- **Override**: Not recommended; modify `MIN_LAST_SYNC_INTERVAL_MS` in [sync.ts](./lib/sync.ts) if needed

### Security Notes

- ⚠️ Never commit `.env` files to version control
- ⚠️ Use environment-specific credentials for production
- ⚠️ Regularly rotate your Notion integration secrets
- ⚠️ Ensure PostgreSQL uses SSL in production (`?sslmode=require`)

### License

See [LICENSE](../LICENSE) for details.

---

<a id="italiano"></a>
## 🇮🇹 Italiano

### Panoramica

Questa integrazione sincronizza automaticamente i messaggi dai form di contatto da un database PostgreSQL a un database Notion. È progettata per collegare i form di contatto del tuo sito web con Notion, consentendo una migliore gestione dei contatti e flussi di follow-up.

### Caratteristiche

- ✅ **Sincronizzazione Automatica**: Trasferisce nuovi messaggi di contatto da PostgreSQL a Notion
- ✅ **Prevenzione Duplicati**: Traccia i messaggi sincronizzati per evitare duplicati
- ✅ **Rate Limiting**: Previene sincronizzazioni eccessive (intervallo minimo di 5 minuti)
- ✅ **Endpoint HTTP**: Fornisce endpoint `/sync` per trigger manuali
- ✅ **Integrazione Prisma**: Operazioni database type-safe
- ✅ **API Notion**: Integrazione completa con l'API Pages di Notion

### Prerequisiti

- Runtime [Bun](https://bun.sh/) (v1.0+)
- Database PostgreSQL
- Account Notion con accesso API
- Database Notion con schema appropriato (vedi sotto)

### Installazione

1. **Naviga nella directory del progetto:**
   ```bash
   cd pg-contact-form
   ```

2. **Installa le dipendenze:**
   ```bash
   bun install
   ```

3. **Configura le variabili d'ambiente** (vedi [Variabili d'Ambiente](#variabili-dambiente))

4. **Inizializza il database:**
   ```bash
   bunx prisma db push
   ```

### Variabili d'Ambiente

Crea un file `.env` nella directory `pg-contact-form` con le seguenti variabili:

```env
# Connessione Database PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Integrazione Notion
INTEGRATION_SECRET="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
DATABASE_ID="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Opzionale: Ambiente Node
NODE_ENV="development"
```

#### Dettagli Variabili

| Variabile | Richiesta | Descrizione |
|-----------|-----------|-------------|
| `DATABASE_URL` | ✅ Sì | Stringa di connessione PostgreSQL. Deve includere credenziali, host, porta e nome database. |
| `INTEGRATION_SECRET` | ✅ Sì | Il token della tua integrazione Notion. Ottienilo da [Notion Integrations](https://www.notion.so/my-integrations). |
| `DATABASE_ID` | ✅ Sì | L'ID del tuo database Notion. Si trova nell'URL del database: `notion.so/workspace/DATABASE_ID?v=...` |
| `NODE_ENV` | ❌ No | Modalità ambiente. Usa `production` per deployment in produzione. Default: `development` |

### Schema Database Notion

Il tuo database Notion deve avere le seguenti proprietà:

| Nome Proprietà | Tipo | Descrizione |
|----------------|------|-------------|
| `full_name` | Title | Nome completo del contatto |
| `email` | Email | Indirizzo email del contatto |
| `message` | Rich Text | Il messaggio del contatto |
| `created_at` | Date | Timestamp di creazione del messaggio |

**Istruzioni di Configurazione:**
1. Crea un nuovo database in Notion
2. Aggiungi le proprietà elencate sopra
3. Condividi il database con la tua integrazione
4. Copia l'ID del database dall'URL

### Schema Database

Il database PostgreSQL utilizza le seguenti tabelle (gestite da Prisma):

#### `contact_messages`
Memorizza i messaggi dei form di contatto.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| `id` | Integer | Chiave primaria (auto-increment) |
| `name` | String | Nome del contatto |
| `email` | String | Email del contatto |
| `message` | String | Contenuto del messaggio |
| `synced` | Boolean | Se sincronizzato su Notion (default: false) |
| `createdAt` | DateTime | Timestamp di creazione |

#### `notion_syncs`
Traccia lo storico delle sincronizzazioni.

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| `id` | Integer | Chiave primaria (auto-increment) |
| `last_synced_at` | DateTime | Timestamp ultima sincronizzazione |

### Utilizzo

#### Avvia il Server

```bash
bun run server.ts
```

Il server si avvierà sulla porta **6969** di default.

#### Endpoint di Sincronizzazione

**GET** `http://localhost:6969/sync`

Attiva una sincronizzazione dei contatti non sincronizzati da PostgreSQL a Notion.

**Risposte:**

- `200 OK` - Sincronizzazione completata con successo
  ```
  Synced 5 contacts
  ```

- `200 OK` - Sincronizzazione saltata (troppo presto dall'ultima sincronizzazione)
  ```
  Sync skipped - too soon since last sync
  ```

- `500 Internal Server Error` - Sincronizzazione fallita
  ```
  Error: [messaggio errore]
  ```

#### Utilizzo Programmatico

```typescript
import { sync } from "./lib/sync";

// Attiva sincronizzazione
const result = await sync();

if (result.skipped) {
  console.log('Sincronizzazione saltata - troppo presto dall\'ultima sync');
} else {
  console.log(`Sincronizzati ${result.syncedCount} contatti`);
}
```

### Deployment

#### Usando PM2

Il repository include una configurazione PM2. Aggiorna il percorso `interpreter` in [ecosystem.config.js](../ecosystem.config.js) con il tuo percorso Bun:

```bash
# Trova il percorso di Bun
which bun  # Linux/Mac
where.exe bun  # Windows
```

Poi effettua il deploy:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Abilita avvio automatico al boot
```

#### Configurazione Ambiente per Produzione

1. Imposta `NODE_ENV=production` nel tuo ambiente
2. Assicurati che tutte le variabili d'ambiente siano configurate correttamente
3. Configura il tuo database PostgreSQL per uso in produzione
4. Configura backup appropriati del database
5. Monitora i log con `pm2 logs pg-contact-form`

### Struttura Progetto

```
pg-contact-form/
├── server.ts              # Entry point del server HTTP
├── lib/
│   ├── sync.ts           # Logica principale di sincronizzazione
│   ├── notion.ts         # Setup client Notion
│   └── prisma.ts         # Setup client Prisma
├── prisma/
│   └── schema.prisma     # Schema database
├── generated/            # Client Prisma generato
└── notion/
    └── mappers/
        └── contacts.ts   # Logica di mappatura contatti
```

### Risoluzione Problemi

#### La sincronizzazione non funziona

1. **Controlla le variabili d'ambiente**: Assicurati che tutte le variabili richieste siano impostate
2. **Verifica i permessi Notion**: L'integrazione deve avere accesso al database
3. **Controlla la connessione database**: Testa la stringa di connessione PostgreSQL
4. **Rivedi i log**: Controlla i messaggi di errore nella console o nei log PM2

#### Errori di connessione database

```bash
# Testa la connessione al database
bunx prisma db pull
```

#### Errori API Notion

- Verifica che il token di integrazione sia valido
- Assicurati che il database sia condiviso con la tua integrazione
- Controlla che i nomi delle proprietà corrispondano esattamente (case-sensitive)

### Rate Limiting

L'integrazione include rate limiting integrato:
- **Intervallo minimo**: 5 minuti tra le sincronizzazioni
- **Motivazione**: Previene chiamate API eccessive sia a PostgreSQL che a Notion
- **Override**: Non raccomandato; modifica `MIN_LAST_SYNC_INTERVAL_MS` in [sync.ts](./lib/sync.ts) se necessario

### Note di Sicurezza

- ⚠️ Non committare mai file `.env` nel controllo versione
- ⚠️ Usa credenziali specifiche per ambiente in produzione
- ⚠️ Ruota regolarmente i secret delle integrazioni Notion
- ⚠️ Assicurati che PostgreSQL usi SSL in produzione (`?sslmode=require`)

### Licenza

Vedi [LICENSE](../LICENSE) per i dettagli.
