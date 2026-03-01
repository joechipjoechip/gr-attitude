# GR attitude — Guide de Déploiement Render

## Services Render

| Service | URL | Plan | Auto-deploy |
|---------|-----|------|-------------|
| **Backend** `gr-attitude-api` | https://gr-attitude-api-ihn9.onrender.com | Free | On commit (fork) |
| **Frontend** `gr-attitude-frontend` | https://gr-attitude-frontend.onrender.com | Free | On commit (fork) |

**Repos :**
- Upstream : `joechipjoechip/gr-attitude`
- Fork (Render watches) : `caracole-ai/gr-attitude`
- Push to both : `git push origin master && git push fork master`

---

## Architecture DB (SQLite + Disque éphémère)

### Le problème fondamental

Render free tier utilise un **disque éphémère**. Chaque redéploiement :
1. Supprime le fichier `gr_attitude.sqlite`
2. Recrée la DB from scratch
3. L'app doit être immédiatement fonctionnelle

### La solution : `synchronize: true` + auto-seed

**`backend/src/config/database.config.ts`** :
```typescript
// SQLite branch
return {
  type: 'better-sqlite3',
  database: join(process.cwd(), 'gr_attitude.sqlite'),
  autoLoadEntities: true,
  synchronize: true,    // ← Toujours recréer le schema depuis les entités
  migrationsRun: false,  // ← Migrations désactivées pour SQLite
};
```

**`backend/src/main.ts`** (auto-seed au boot) :
```typescript
// Si DB vide → seed automatique
const userCount = await ds.query('SELECT COUNT(*) as cnt FROM users');
if (Number(userCount[0]?.cnt) === 0) {
  await seedService.seed();  // 5 users, 6 missions, 4 offers, 4 contributions
}
```

**Résultat :** Chaque redéploiement = app fonctionnelle en ~30s, zéro intervention manuelle.

### ⚠️ Conséquences

- Les données utilisateur sont **perdues** à chaque redéploiement (free tier)
- Les migrations TypeORM (`backend/src/migrations/`) existent mais ne sont **pas utilisées** en SQLite
- Si on migre vers PostgreSQL (persistent), réactiver `migrationsRun: true` et `synchronize: false`

---

## Variables d'environnement (Backend)

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=<openssl rand -base64 32>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://gr-attitude-frontend.onrender.com
CORS_ORIGIN=https://gr-attitude-frontend.onrender.com
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-<your-secret>
GOOGLE_CALLBACK_URL=https://gr-attitude-api-ihn9.onrender.com/auth/google/callback
```

## Variables d'environnement (Frontend)

```bash
NEXT_PUBLIC_API_URL=https://gr-attitude-api-ihn9.onrender.com
NEXT_PUBLIC_WS_URL=wss://gr-attitude-api-ihn9.onrender.com
```

---

## Endpoints de maintenance

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Health check (status, uptime, version) |
| `/seed/status` | GET | DB diagnostics (synchronize, tables, env) |
| `/seed` | POST | Seed demo data (5 users, 6 missions, 4 offers) |
| `/seed/clear` | POST | Supprime toutes les données `isDemo: true` |
| `/seed/sync-schema` | POST | Force `dataSource.synchronize()` (urgence) |

> **Note :** `/seed/sync-schema` n'est plus nécessaire avec `synchronize: true` mais reste disponible en fallback.

---

## Build Commands (Render Dashboard)

**Backend :**
```bash
cd backend && npm ci --include=dev && npx nest build
```

**Frontend :**
```bash
cd frontend && npm install && npm run build
```

> Ne jamais ajouter de flags après `npm run build` dans le champ Build Command de Render.

---

## Workflow de déploiement

```bash
# 1. Modifier le code
# 2. Vérifier le build localement
cd backend && npm run build

# 3. Commit
git add -A && git commit -m "feat/fix: description"

# 4. Push vers les deux repos
git push origin master && git push fork master

# 5. Render auto-deploy se déclenche (~3-5 min)
# 6. Vérifier : curl https://gr-attitude-api-ihn9.onrender.com/health
```

---

## Checklist post-déploiement

- [ ] `/health` → 200
- [ ] `/missions` → données visibles (auto-seedées)
- [ ] `/offers` → données visibles
- [ ] `/seed/status` → `synchronize: true`, `migrationsRun: false`
- [ ] Frontend : missions et offres s'affichent
- [ ] Console navigateur : pas d'erreurs 500

---

**Dernière mise à jour** : 2026-03-02
**Statut** : ✅ Production LIVE (synchronize:true + auto-seed)
