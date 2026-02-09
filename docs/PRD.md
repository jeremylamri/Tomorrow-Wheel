# Product Requirements Document (PRD) - Tomorrow Wheel V3

## 1. Vision Produit
Construire une expérience digitale premium, spectaculaire et "Event-ready". L'application ne doit pas ressembler à une page web classique mais à un écran de veille vivant ("Liquid Glass") qui évolue vers un show TV interactif lors de l'activation.
L'esthétique repose sur des formes organiques mouvantes, une typographie cinétique (Futura) et des effets de lumière volumétriques.

## 2. Objectifs
- **Immersion :** Le fond d'écran "Liquid Glass" et les "God Rays" créent une ambiance vivante même au repos.
- **Tension Dramatique :** Le système de tirage (Roue ou Numéro) utilise des codes du cinéma (décélération, zoom caméra, sons de tension).
- **Stabilité :** Zéro scintillement, 60 FPS constants grâce à l'accélération GPU.

## 3. Personas
- **L'Animateur (Master of Ceremony) :**
    - Lance la roue depuis un iPad ou un laptop.
    - Utilise le "Mode VIP" pour orienter le hasard si le script de l'événement l'exige.
    - Peut lancer un diagnostic RNG pour prouver l'équité.
- **Le Public (Spectateur) :**
    - Voit une interface lisible de loin (Typographie Futura ExtraBold).
    - Ressent physiquement le tirage grâce au Sound Design (Basses, Impacts).

## 4. Fonctionnalités Clés

### Core Experience (Le Show)
- **Roue Physique :** Moteur physique personnalisé avec inertie, friction et rebond de l'aiguille.
- **Caméra Dynamique :** Zoom automatique dans la roue lors de la victoire ("The Reveal").
- **Double Tirage :** Capacité d'enchaîner fluidement un gain (Lot) et un bénéficiaire (Numéro aléatoire).
- **Célébration :** Confettis synchronisés sur les deux types de tirages (Roue et Numéros).

### Admin & Configuration
- **Mode VIP Invisible :** Permet de forcer un lot spécifique sans indice visuel pour le public.
- **Diagnostic RNG :** Outil d'analyse statistique pour vérifier la distribution du générateur aléatoire.
- **Gestion Live :** Ajout/Suppression de lots à la volée.

### Tech & Performance
- **Liquid Glass Engine :** Background composé de blobs CSS massifs avec morphing et color-cycling, optimisé GPU.
- **Cryptographic Randomness :** Utilisation de `window.crypto` pour tous les tirages.
- **Audio Engine :** Synthétiseur WebAudio natif (pas de fichiers mp3 statiques) pour une génération sonore dynamique.