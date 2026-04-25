# Viral Food Art Studio

Application Next.js full-stack pour générer des images IA food art/charcuterie via KIE.AI, valider une image, puis générer une vidéo à partir de cette image.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite
- Zod validation
- Zustand state client

## Installation

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

## Variables d'environnement

Configurer `.env`:

```env
KIE_API_KEY=...
KIE_BASE_URL=https://api.kie.ai
DATABASE_URL="file:./dev.db"
```

## Architecture

- `app/api/*` : routes serveur sécurisées (clé API jamais exposée au client)
- `lib/kie/client.ts` : client KIE centralisé + normalisation des tâches
- `lib/kie/imageProviders.ts` : config modèles image
- `lib/kie/videoProviders.ts` : config modèles vidéo
- `lib/prompt/*` : prompt builders image/vidéo
- `prisma/schema.prisma` : modèles de données

## Où modifier les providers KIE

- Modèles image : `lib/kie/imageProviders.ts`
- Modèles vidéo : `lib/kie/videoProviders.ts`

Chaque provider contient:

- `endpoint`
- `statusEndpoint`
- `buildPayload`
- `resultParser`
- `defaultParams`
- `fields`

> ⚠️ Les endpoints/payloads peuvent changer selon KIE.AI : des `TODO` sont présents pour valider chaque modèle contre la doc officielle.

## Ajouter un nouveau modèle image

1. Ajouter une entrée dans `imageProviders` avec:
   - `id`, `label`, `endpoint`, `statusEndpoint`, `defaultParams`, `fields`
   - `buildPayload(params)`
   - `resultParser(raw)`
2. Redémarrer l'application.
3. Le modèle apparaît automatiquement via `GET /api/models`.

## Ajouter un nouveau modèle vidéo

1. Ajouter une entrée dans `videoProviders` avec:
   - `id`, `label`, `endpoint`, `statusEndpoint`, `defaultParams`, `fields`
   - `buildPayload(params)`
   - `resultParser(raw)`
2. Redémarrer l'application.
3. Le modèle apparaît automatiquement via `GET /api/models`.

## Workflow utilisateur

1. Générer des propositions d'images (Step 1)
2. Sélectionner l'image validée (Step 2)
3. Générer une vidéo à partir de l'image sélectionnée (Step 3)

Le polling de statut est automatique toutes les 5 secondes pour les tâches `pending/processing`.
