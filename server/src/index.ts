import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

type Message = {
  id: string;
  author: string;
  text: string;
  image?: string;
  createdAt: string;
};

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, '..', 'data');
const uploadsDir = path.join(__dirname, '..', 'uploads');
const dbFile = path.join(dataDir, 'messages.json');

for (const dir of [dataDir, uploadsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify([], null, 2), 'utf-8');
}

function readMessages(): Message[] {
  const raw = fs.readFileSync(dbFile, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as Message[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMessages(messages: Message[]): void {
  fs.writeFileSync(dbFile, JSON.stringify(messages, null, 2), 'utf-8');
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${uuid()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

app.get('/messages', (_req: Request, res: Response) => {
  const messages = readMessages().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  res.json(messages);
});

app.post('/messages', upload.single('image'), (req: Request, res: Response) => {
  const { author, text } = req.body as { author?: string; text?: string };

  if (!text || typeof text !== 'string' || text.trim() === '') {
    if (req.file) {
      fs.unlink(path.join(uploadsDir, req.file.filename), () => undefined);
    }
    return res.status(400).json({ error: 'Field "text" is required.' });
  }

  const message: Message = {
    id: uuid(),
    author: author && author.trim() !== '' ? author.trim() : 'Anonymous',
    text: text.trim(),
    image: req.file ? `/uploads/${req.file.filename}` : undefined,
    createdAt: new Date().toISOString(),
  };

  const messages = readMessages();
  messages.push(message);
  writeMessages(messages);

  res.status(201).json(message);
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


