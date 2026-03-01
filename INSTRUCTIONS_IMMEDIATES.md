# 🚨 INSTRUCTIONS IMMÉDIATES

## Problème Actuel

1. ❌ **Bug `expiresAt`** : Le backend en prod n'a pas le fix (commit `a2b34f7`)
2. ❌ **Pas de données démo** : Le seeding n'a pas été lancé

---

## 🎯 Solution (5 minutes)

### Étape 1 : Vérifier le déploiement Render

1. **Aller sur** : https://dashboard.render.com/web/srv-d6f4cshr0fns73f2vvsg

2. **Cliquer sur "Events"** (onglet en haut)

3. **Vérifier le dernier deploy** :
   - ✅ Si c'est le commit **`114c25e`** ou **`9663c12`** → **Passer à l'étape 2**
   - ⏳ Si c'est un commit plus ancien → **Attendre 2-3 min** que le nouveau deploy se termine
   - ❌ Si aucun deploy n'est en cours → Envoyer un message et je relance

---

### Étape 2 : Lancer le seeding

1. **Sur la même page Render**, cliquer sur **"Shell"** (onglet en haut)

2. **Attendre** que le terminal se connecte (quelques secondes)

3. **Copier-coller cette commande** :

```bash
npm run seed
```

4. **Attendre** de voir :
```
🌱 Seeding demo data...
  → Creating demo users...
  ✅ Created 5 demo users
  → Creating demo missions...
  ✅ Created 6 demo missions
  → Creating demo offers...
  ✅ Created 4 demo offers
  → Creating demo contributions...
  ✅ Created 4 demo contributions
🎉 Demo data seeded successfully!
```

---

### Étape 3 : Tester

1. **Aller sur** : https://gr-attitude-frontend.onrender.com

2. **Se connecter** avec Google OAuth

3. **Naviguer vers** `/missions`

4. **Vérifier** :
   - ✅ Tu vois **6 missions démo** (déménagement, accompagnement médical, plomberie, etc.)
   - ✅ Chaque mission a un créateur (Alice, Bob, Claire, etc.)
   - ✅ Certaines missions ont des contributions (👥 compteur)

5. **Créer une nouvelle mission** :
   - ✅ Ça doit fonctionner **sans erreur `expiresAt`**

---

## 🐛 Si ça ne marche pas

### Erreur `expiresAt` persiste après le deploy `114c25e`

**Possible cause** : Cache du frontend

**Solution** : Hard refresh du frontend
- **Mac** : `Cmd + Shift + R`
- **Windows/Linux** : `Ctrl + Shift + F5`

Si ça ne marche toujours pas, envoie-moi :
- La date/heure du dernier deploy (visible dans "Events")
- Une capture d'écran de l'erreur console

---

### Le seeding ne fonctionne pas

**Erreur possible** : `Database locked`

**Solution** : Attendre 30 secondes et réessayer `npm run seed`

Si ça ne marche pas, envoie-moi la sortie complète du Shell.

---

### Pas de missions visibles après seeding

**Vérifications** :
1. Le seeding s'est bien terminé (✅ dans les logs Shell)
2. Tu es bien connecté avec Google OAuth
3. Hard refresh du frontend (`Cmd + Shift + R`)

---

## 📊 Données Créées

Une fois le seeding réussi, tu auras :

**5 utilisateurs** :
- Alice Martin (développeuse web, Paris)
- Bob Durand (bricoleur, Paris, Premium)
- Claire Dubois (prof français, Lyon)
- David Petit (graphiste, Marseille, Premium)
- Emma Rousseau (étudiante médecine, Paris)

**6 missions** :
- Aide déménagement (Transport, Urgent) — 2 participations
- Accompagnement médical (Transport, Moyen)
- Réparation plomberie (Bricolage, Moyen) — 1 participation
- Soutien scolaire maths (Éducation, Faible)
- Création site web (Numérique, Faible, **En cours 30%**) — 1 participation
- Promenade quotidienne (Écoute, Moyen)

**4 offres** :
- Cours français (Lyon)
- Aide bricolage (Paris)
- Design graphique (Marseille)
- Prêt outils jardinage (Paris)

---

## ⏱️ Timeline Attendue

- **T+0** : Tu lances `npm run seed` dans le Shell
- **T+10s** : Seeding terminé (✅ confirmations)
- **T+15s** : Tu rafraîchis le frontend
- **T+20s** : Les 6 missions apparaissent
- **T+30s** : Tu testes la création d'une nouvelle mission → ✅ Ça marche !

---

## 💡 Rappel

Pour supprimer les données démo plus tard (avant mise en prod publique) :

```bash
npm run seed:clear
```

Toutes les données avec `isDemo: true` seront supprimées en toute sécurité ! 🎯
