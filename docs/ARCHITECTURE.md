# Architecture Technique - Tomorrow Wheel V3

## 1. Stack Technologique
- **Framework :** React 19 (Utilisation des derniers hooks et optimisations).
- **State Management :** Zustand (Store global ultra-léger, découplé du rendu).
- **Styling :** Tailwind CSS avec configuration étendue (Animations personnalisées `morph`, `glow`, `shockwave`).
- **Graphisme :** 
  - `Canvas API` pour le rendu haute performance de la roue (60fps).
  - `CSS Filters` & `Backdrop-filter` pour l'esthétique Liquid Glass.
- **Audio :** Web Audio API natif (Oscillators, GainNodes, BiquadFilters) pour une latence nulle.
- **Particules :** `canvas-confetti` pour les célébrations.

## 2. Optimisation & Performance (Anti-Flicker)
Pour gérer les effets lourds (Flous géants, Transparences) sans lag ni scintillement :

- **GPU Layers :** Utilisation agressive de `transform: translateZ(0)` et `will-change: transform` via la classe utilitaire `.gpu-layer`.
- **RequestAnimationFrame (rAF) :** Utilisé pour la boucle physique de la roue ET pour le suivi de la souris (Spotlight), évitant de surcharger le Main Thread.
- **Static Noise :** Le grain cinéma est généré une seule fois en SVG base64 et appliqué via un pseudo-élément fixe, plutôt que recalculé.

## 3. Structure du Projet
```
/src
  /components
    /admin      # AdminPanel.tsx (Configuration & RNG Test)
    /game       # Wheel.tsx, HistoryHUD.tsx, NumberDraw.tsx
    /layout     # Background.tsx (Liquid Engine), Header.tsx
    /ui         # Composants partagés (Overlay)
  /store        # store.ts (Zustand: Logique métier centrale)
  /utils
    /audio.ts   # Moteur sonore procédural
    /random.ts  # Wrappers window.crypto
    /testRandomness.ts # Algorithme de diagnostic RNG
```

## 4. Sécurité (RNG)
- **Source d'entropie :** `window.crypto.getRandomValues()` est impératif. `Math.random()` est banni pour les tirages.
- **Vérification :** Un module de diagnostic (`testRandomness.ts`) permet de simuler 1000 tirages instantanés pour vérifier l'uniformité de la distribution et détecter les biais statistiques (Middle bunching).