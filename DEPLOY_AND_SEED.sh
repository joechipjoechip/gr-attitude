#!/bin/bash
# Script à exécuter dans le Shell Render pour seeder les données démo

echo "🔍 Vérification de l'environnement..."

# Vérifier qu'on est bien dans le bon répertoire
if [ ! -f "package.json" ]; then
  echo "❌ Erreur : package.json introuvable"
  echo "   Assurez-vous d'être dans le répertoire backend"
  exit 1
fi

# Vérifier que npm est disponible
if ! command -v npm &> /dev/null; then
  echo "❌ Erreur : npm n'est pas installé"
  exit 1
fi

echo "✅ Environnement OK"
echo ""

# Afficher le commit actuel
echo "📦 Commit actuel :"
if [ -d ".git" ]; then
  git log -1 --oneline 2>/dev/null || echo "   (git non disponible)"
else
  echo "   (répertoire .git non trouvé)"
fi
echo ""

# Lancer le seeding
echo "🌱 Lancement du seeding..."
npm run seed

# Vérifier le code de sortie
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Seeding terminé avec succès !"
  echo ""
  echo "📊 Prochaines étapes :"
  echo "   1. Aller sur https://gr-attitude-frontend.onrender.com"
  echo "   2. Se connecter avec Google OAuth"
  echo "   3. Naviguer vers /missions"
  echo "   4. Vous devriez voir 6 missions démo"
  echo ""
  echo "🧹 Pour supprimer les données démo plus tard :"
  echo "   npm run seed:clear"
else
  echo ""
  echo "❌ Erreur lors du seeding"
  echo "   Vérifiez les logs ci-dessus pour identifier le problème"
  exit 1
fi
