import { getSecureRandomInt } from './random';

interface TestReport {
  iterations: number;
  min: number;
  max: number;
  mean: number; // Moyenne
  buckets: Record<string, number>;
  middleConcentration: number; // Pourcentage dans 40-60
  isUniform: boolean;
  rawLogs: string[];
}

export const runRandomnessDiagnostic = (iterations: number = 1000): TestReport => {
  const MIN = 1;
  const MAX = 100;
  const counts: Record<number, number> = {};
  let sum = 0;
  const logs: string[] = [];

  // 1. Simulation
  for (let i = 0; i < iterations; i++) {
    const num = getSecureRandomInt(MIN, MAX);
    counts[num] = (counts[num] || 0) + 1;
    sum += num;
  }

  // 2. Analyse Statistique de base
  const mean = sum / iterations;
  const expectedMean = (MIN + MAX) / 2; // 50.5

  // 3. Analyse par tranches (Buckets) pour vérifier la dispersion
  // Tranches : 1-20, 21-40, 41-60, 61-80, 81-100
  const buckets = {
    '1-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0
  };

  Object.entries(counts).forEach(([numStr, count]) => {
    const num = parseInt(numStr);
    if (num <= 20) buckets['1-20'] += count;
    else if (num <= 40) buckets['21-40'] += count;
    else if (num <= 60) buckets['41-60'] += count;
    else if (num <= 80) buckets['61-80'] += count;
    else buckets['81-100'] += count;
  });

  // 4. Vérification spécifique "Middle Bunching" (40-60)
  // Théoriquement, 41-60 représente 20% de l'espace (20 nombres sur 100).
  // On s'attend à ~200 tirages sur 1000.
  const middleCount = buckets['41-60'];
  const middleConcentration = (middleCount / iterations) * 100;

  // Critères de succès (tolérance statistique sommaire)
  // La moyenne doit être proche de 50.5 (ex: entre 48 et 53)
  // Chaque bucket doit être proche de 20% (ex: entre 15% et 25%)
  const isMeanValid = Math.abs(mean - expectedMean) < 2.5;
  const isMiddleValid = middleConcentration > 15 && middleConcentration < 25;
  
  const isUniform = isMeanValid && isMiddleValid;

  logs.push(`--- DIAGNOSTIC RNG (${iterations} itérations) ---`);
  logs.push(`Moyenne observée : ${mean.toFixed(2)} (Théorique : ${expectedMean})`);
  logs.push(`Répartition par tranches (Attendu ~200/tranche) :`);
  logs.push(`  01-20 : ${buckets['1-20']}`);
  logs.push(`  21-40 : ${buckets['21-40']}`);
  logs.push(`  41-60 : ${buckets['41-60']} (Zone critique)`);
  logs.push(`  61-80 : ${buckets['61-80']}`);
  logs.push(`  81-100: ${buckets['81-100']}`);
  logs.push(`Concentration zone 41-60 : ${middleConcentration.toFixed(1)}%`);
  logs.push(`RESULTAT : ${isUniform ? "✅ DISTRIBUTION SAINE" : "⚠️ ANOMALIE DÉTECTÉE"}`);

  return {
    iterations,
    min: MIN,
    max: MAX,
    mean,
    buckets,
    middleConcentration,
    isUniform,
    rawLogs: logs
  };
};