# Game Design Document - Tomorrow Wheel V3

## 1. Direction Artistique : "Liquid Future"
L'interface rompt avec les codes plats (Flat Design) pour embrasser une esthétique de profondeur et de matière.

- **Background :** Un fluide vivant ("Liquid Glass") composé de formes géantes aux couleurs de la marque (Purple, Blue) qui se mélangent via des flous extrêmes.
- **Typographie Cinétique :** Le titre "TOMORROW WHEEL" utilise un effet de brillance métallique (Gradient Shine) et la police **Futura** pour un impact maximal.
- **Lumière :** Des "God Rays" (rayons divins) tournent lentement en arrière-plan, réagissant à la vitesse de rotation de la roue.

## 2. La Chorégraphie du Tirage (The Flow)

### Phase 1: Idle (L'Attente)
- La roue "respire" (légère pulsation).
- Le fond liquide ondule lentement.
- Un "Spotlight" suit la souris de l'animateur, révélant des détails dans le verre.

### Phase 2: Spin (L'Action)
- **Lancement :** Accélération brutale. La caméra reste stable.
- **Vitesse Max :** Les couleurs de la roue se floutent (Motion Blur calculé en temps réel). Le son du drone monte en fréquence.
- **Décélération :** La roue ralentit de manière non-linéaire. Le "Tic-Tic" de l'aiguille devient distinct.

### Phase 3: Victory & Reveal
- **Arrêt :** La roue se bloque sur un segment. Accord sonore "Win".
- **Zoom Caméra :** L'interface entière zoome (Scale 2.2x) vers le centre de la roue. Le fond s'assombrit.
- **Overlay :** Une carte en verre (Glassmorphism) apparaît par dessus, affichant le lot en géant.
- **Confettis :** Explosion de particules (Bleu/Blanc/Violet).

### Phase 4: Le Tirage Numéro (Optionnel)
- Si l'animateur clique sur "Tirer le numéro gagnant".
- **Effet Décodage :** Les chiffres ne tournent pas comme une roue, ils "décryptent" (Slot Machine style Matrix).
- Les chiffres se figent de gauche à droite avec un son métallique lourd (Clank).
- Nouvelle explosion de confettis à la fin.

## 3. Sound Design (Audio Procédural)
L'application n'utilise pas de samples enregistrés, mais génère le son en temps réel via l'API WebAudio.

- **Drone d'ambiance :** Oscillateur Sinusoïdal basse fréquence (40Hz) pour une présence physique constante.
- **Ticker (Aiguille) :** Bruit blanc filtré (pour l'impact bois) + Onde sinusoïdale courte (pour le clic métallique).
- **Win :** Accord majeur complexe (C Major 7 Add 9) avec un effet de panoramique stéréo.

## 4. Physique
- La roue n'est pas une animation CSS prédéfinie. C'est une simulation physique (Vélocité, Friction) recalculée à chaque frame (60fps).
- L'aiguille est un objet physique qui réagit aux collisions avec les "pins" de la roue.