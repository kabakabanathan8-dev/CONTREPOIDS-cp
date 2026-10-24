# CONTREPOIDS Agency & Print — site web

Site vitrine statique (HTML, CSS, JavaScript), sans étape de build : prêt pour GitHub et Vercel.

## Fichiers
- `index.html` : contenu, métadonnées de partage (Open Graph) et données structurées pour Google
- `style.css` : design responsive (mobile d'abord) et accessible
- `script.js` : menu mobile, préremplissage du service, validation et ouverture de WhatsApp
- `supabase_schema.sql` : structure de base de données facultative (non utilisée par le site actuel)

## Tester sur votre ordinateur
1. Décompressez le ZIP.
2. Ouvrez `index.html` dans votre navigateur (ou utilisez l'extension Live Server de Visual Studio Code).

## Publier avec GitHub et Vercel
1. Créez un dépôt GitHub (par exemple `contrepoids-agency-print`) et envoyez-y les fichiers.
2. Sur Vercel : **Add New → Project**, importez le dépôt.
3. Gardez les paramètres par défaut et cliquez sur **Deploy**.

## Modifier le contenu
- Numéro WhatsApp : changez `243829603023` dans `script.js` (constante `WHATSAPP_NUMBER`) et dans les liens `wa.me` de `index.html`.
- Services : chaque service est un bloc `<li class="service">` dans `index.html`. Pensez à garder le même texte dans la liste déroulante du formulaire.
- Couleurs : variables en haut de `style.css` (`--navy`, `--blue`, `--gold`).

## Prochaines améliorations recommandées
- Ajouter de vraies photos de réalisations (impressions, vêtements, projets SIG) : c'est ce qui rassure le plus les clients.
- Ajouter une image de partage (`og:image`, 1200×630) pour un bel aperçu sur WhatsApp et Facebook.
- Une fois un nom de domaine connecté, ajouter l'adresse du site dans `index.html` (balise `canonical` et données structurées).

## À savoir
- Le formulaire ne stocke rien : il prépare un message WhatsApp.
- Pour activer `supabase_schema.sql`, il faudra un projet Supabase, des règles RLS et une fonction serveur sécurisée. Ne placez jamais de clé secrète dans le JavaScript public.
- Avant d'ajouter des statistiques de visiteurs, informez les utilisateurs et ne collectez que le nécessaire.
