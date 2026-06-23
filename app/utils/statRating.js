// utils/statRating.js

const STAT_THRESHOLDS = {
  hp: [
    { min: 0, label: 'Terrible' },
    { min: 45, label: 'Poor' },
    { min: 60, label: 'Average' },
    { min: 80, label: 'Good' },
    { min: 100, label: 'Great' },
    { min: 120, label: 'Excellent' },
  ],
  attack: [
    { min: 0, label: 'Terrible' },
    { min: 45, label: 'Poor' },
    { min: 60, label: 'Average' },
    { min: 80, label: 'Good' },
    { min: 100, label: 'Great' },
    { min: 120, label: 'Excellent' },
  ],
  defense: [
    { min: 0, label: 'Terrible' },
    { min: 45, label: 'Poor' },
    { min: 60, label: 'Average' },
    { min: 80, label: 'Good' },
    { min: 100, label: 'Great' },
    { min: 120, label: 'Excellent' },
  ],
  'special-attack': [
    { min: 0, label: 'Terrible' },
    { min: 45, label: 'Poor' },
    { min: 60, label: 'Average' },
    { min: 80, label: 'Good' },
    { min: 100, label: 'Great' },
    { min: 120, label: 'Excellent' },
  ],
  'special-defense': [
    { min: 0, label: 'Terrible' },
    { min: 45, label: 'Poor' },
    { min: 60, label: 'Average' },
    { min: 80, label: 'Good' },
    { min: 100, label: 'Great' },
    { min: 120, label: 'Excellent' },
  ],
  speed: [
    { min: 0, label: 'Terrible' },
    { min: 45, label: 'Poor' },
    { min: 60, label: 'Average' },
    { min: 80, label: 'Good' },
    { min: 100, label: 'Great' },
    { min: 120, label: 'Excellent' },
  ],
}

const BST_THRESHOLDS = [
  { min: 0, label: 'Weak' },
  { min: 400, label: 'Average' },
  { min: 500, label: 'Strong' },
  { min: 580, label: 'Legendary' },
  { min: 700, label: 'Uber' },
]

const RATING_COLORS = {
  Terrible: 'text-red-500',
  Poor: 'text-orange-400',
  Average: 'text-yellow-400',
  Good: 'text-lime-400',
  Great: 'text-green-500',
  Excellent: 'text-emerald-400',
  // BST
  Weak: 'text-red-500',
  Strong: 'text-green-500',
  Legendary: 'text-purple-400',
  Uber: 'text-yellow-300',
}

function resolveThreshold(thresholds, value) {
  return [...thresholds].reverse().find((t) => value >= t.min)?.label ?? 'Unknown'
}

export function statRating(statName, value) {
  const thresholds = STAT_THRESHOLDS[statName]
  if (!thresholds) return { label: 'Unknown', color: '' }
  const label = resolveThreshold(thresholds, value)
  return { label, color: RATING_COLORS[label] ?? '' }
}

export function bstRating(stats) {
  const total = Object.values(stats).reduce((sum, v) => sum + v, 0)
  const label = resolveThreshold(BST_THRESHOLDS, total)
  return { total, label, color: RATING_COLORS[label] ?? '' }
}
