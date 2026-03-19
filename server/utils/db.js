const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/tasks.json');

// Default categories — seeded once if tasks.json has no `categories` field.
// IDs match the old hardcoded keys so existing cards need no migration.
const DEFAULT_CATEGORIES = [
  { id: 'music',    label: 'Music',    colorId: 'pink'    },
  { id: 'projects', label: 'Projects', colorId: 'blue'    },
  { id: 'travel',   label: 'Travel',   colorId: 'emerald' },
  { id: 'health',   label: 'Health',   colorId: 'green'   },
  { id: 'finance',  label: 'Finance',  colorId: 'yellow'  },
  { id: 'shopping', label: 'Shopping', colorId: 'orange'  },
  { id: 'tech',     label: 'Tech',     colorId: 'cyan'    },
  { id: 'personal', label: 'Personal', colorId: 'violet'  },
];

function readData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);
  if (!data.categories) {
    data.categories = DEFAULT_CATEGORIES;
    writeData(data);
  }
  return data;
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readData, writeData };
