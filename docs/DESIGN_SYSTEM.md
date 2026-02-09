# Design System - Tomorrow Wheel V3

## 1. Philosophie : "Liquid Dark Mode"
Une interface sombre, profonde, illuminée par des formes fluides et néons. Pas de gris plats, mais des noirs teintés et des transparences complexes.

## 2. Typographie
### Titres & Impact
- **Font :** `Futura` (Fallback: `Jost`, `Syne`)
- **Style :** Uppercase, ExtraBold / Black.
- **Usage :** Titre principal "TOMORROW WHEEL", Nom du lot gagnant, Gros Numéros.

### Labeur & Interface
- **Font :** `Inter`
- **Style :** Regular, Medium.
- **Usage :** Boutons, Listes admin, Historique.

## 3. Palette de Couleurs
### Brand Gradient (Liquid Shapes)
- **Primary Purple :** `#BF5AF2`
- **Dark Purple :** `#5E2B77`
- **Electric Blue :** `#0A84FF`

### Surfaces (Glassmorphism)
- **Glass Low :** `rgba(20, 20, 22, 0.4)` + Blur 24px + Border white/10.
- **Glass High :** `rgba(30, 30, 35, 0.7)` + Blur 40px + Border white/20 + Shadow XL.

### Feedback
- **Win/Success :** `#30D158` (Green)
- **Danger/Reset :** `#FF453A` (Red)

## 4. Effets Visuels (FX)
- **Liquid Morphing :** Animation CSS `morph` changeant le `border-radius` et la rotation des blobs d'arrière-plan.
- **Kinetic Text :** Animation `background-position` sur un texte avec `background-clip: text` pour un effet de brillance qui défile (Shinethrough).
- **Noise :** Overlay SVG fixe avec turbulence fractale (Opacité 4%) pour éviter l'effet de "banding" sur les dégradés et donner un aspect cinéma.
- **Vignette :** Assombrissement radial fort sur les bords pour focaliser l'attention au centre.

## 5. Animations CSS Custom
Les animations suivantes sont définies dans `tailwind.config` :
- `animate-morph` : Déformation organique lente (15s).
- `animate-pulse-slow` : Pulsation de lumière (4s).
- `animate-shockwave` : Cercle qui grandit et disparait rapidement (Impact).
- `animate-color-cycle` : Rotation de la teinte (Hue-Rotate) sur 20s.