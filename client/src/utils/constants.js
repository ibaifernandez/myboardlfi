// Color palette for categories — static list so Tailwind can detect all classes.
// `dot`   → saturated swatch used in the settings panel
// `badge` → translucent badge used on cards and filters
export const COLOR_OPTIONS = [
  { id: 'pink',    dot: 'bg-pink-400',    badge: 'bg-pink-500/20 text-pink-300'       },
  { id: 'rose',    dot: 'bg-rose-400',    badge: 'bg-rose-500/20 text-rose-300'       },
  { id: 'red',     dot: 'bg-red-400',     badge: 'bg-red-500/20 text-red-300'         },
  { id: 'orange',  dot: 'bg-orange-400',  badge: 'bg-orange-500/20 text-orange-300'   },
  { id: 'yellow',  dot: 'bg-yellow-400',  badge: 'bg-yellow-500/20 text-yellow-300'   },
  { id: 'green',   dot: 'bg-green-400',   badge: 'bg-green-500/20 text-green-300'     },
  { id: 'emerald', dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'teal',    dot: 'bg-teal-400',    badge: 'bg-teal-500/20 text-teal-300'       },
  { id: 'cyan',    dot: 'bg-cyan-400',    badge: 'bg-cyan-500/20 text-cyan-300'       },
  { id: 'blue',    dot: 'bg-blue-400',    badge: 'bg-blue-500/20 text-blue-300'       },
  { id: 'indigo',  dot: 'bg-indigo-400',  badge: 'bg-indigo-500/20 text-indigo-300'   },
  { id: 'violet',  dot: 'bg-violet-400',  badge: 'bg-violet-500/20 text-violet-300'   },
];

// Derives display classes for a given colorId. Falls back to grey.
export function colorById(colorId) {
  return COLOR_OPTIONS.find((o) => o.id === colorId)
    ?? { id: colorId, dot: 'bg-[#3d4155]', badge: 'bg-[#2e3140] text-[#555b70]' };
}

// Priorities remain static (no user-editable priorities for now)
export const PRIORITIES = {
  none:   { label: 'Ninguna', color: 'text-[#3d4155]',  border: 'border-l-transparent', dot: ''              },
  low:    { label: 'Baja',    color: 'text-green-400',  border: 'border-l-green-500',   dot: 'bg-green-500'  },
  medium: { label: 'Media',   color: 'text-amber-400',  border: 'border-l-amber-500',   dot: 'bg-amber-500'  },
  high:   { label: 'Alta',    color: 'text-red-400',    border: 'border-l-red-500',     dot: 'bg-red-500'    },
  urgent: { label: 'Urgente', color: 'text-purple-400', border: 'border-l-purple-500',  dot: 'bg-purple-500' },
};

export const PRIORITY_LIST = Object.entries(PRIORITIES).map(([value, meta]) => ({ value, ...meta }));
