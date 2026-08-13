import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, '../data');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure responses file exists
if (!fs.existsSync(RESPONSES_FILE)) {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify([], null, 2));
}

const getResponses = () => {
  try {
    const data = fs.readFileSync(RESPONSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading responses:', err);
    return [];
  }
};

const saveResponses = (responses) => {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify(responses, null, 2));
};

// CREATE (POST /api/responses)
app.post('/api/responses', (req, res) => {
  try {
    const { choice, preferredDate, preferredTime, message } = req.body;
    
    if (!choice || !['YES', 'NO'].includes(choice)) {
      return res.status(400).json({ error: 'Valid choice ("YES" or "NO") is required.' });
    }

    const responses = getResponses();
    const newResponse = {
      id: 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      choice,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      message: message ? message.trim() : null,
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown'
    };

    responses.unshift(newResponse);
    saveResponses(responses);

    console.log(`[API] Created response: ${choice}`);
    res.status(201).json({ success: true, data: newResponse });
  } catch (err) {
    console.error('[API] Error creating response:', err);
    res.status(500).json({ error: 'Failed to process response.' });
  }
});

// READ (GET /api/responses)
app.get('/api/responses', (req, res) => {
  try {
    const responses = getResponses();
    res.json({ success: true, count: responses.length, data: responses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch responses.' });
  }
});

// UPDATE (PUT /api/responses/:id)
app.put('/api/responses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { choice, preferredDate, preferredTime, message } = req.body;
    let responses = getResponses();
    const index = responses.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Response not found' });
    }

    responses[index] = {
      ...responses[index],
      choice: choice || responses[index].choice,
      preferredDate: preferredDate !== undefined ? preferredDate : responses[index].preferredDate,
      preferredTime: preferredTime !== undefined ? preferredTime : responses[index].preferredTime,
      message: message !== undefined ? message : responses[index].message,
    };

    saveResponses(responses);
    res.json({ success: true, data: responses[index] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update response.' });
  }
});

// DELETE (DELETE /api/responses/:id)
app.delete('/api/responses/:id', (req, res) => {
  try {
    const { id } = req.params;
    let responses = getResponses();
    responses = responses.filter(r => r.id !== id);
    saveResponses(responses);
    res.json({ success: true, message: 'Response deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete response.' });
  }
});

// GET /api/config
app.get('/api/config', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return res.json({ success: true, data: config });
    }
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config.' });
  }
});

// PUT /api/config
app.put('/api/config', (req, res) => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Config updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update config.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Confession App backend API running on port ${PORT}`);
});
