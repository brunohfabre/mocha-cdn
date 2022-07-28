import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    const { platform } = request.params;

    const filePath = path.resolve(__dirname, '..', 'uploads', platform);
    
    fs.rmSync(filePath, { recursive: true, force: true });

    fs.mkdirSync(filePath, { recursive: true });

    cb(null, filePath);
  },
  filename: function (request, file, cb) {
    const fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];

    cb(null, `${Date.now()}.${fileExtension}`)
  }
});

const upload = multer({ storage });

app.get('/download/:platform', (request, response) => {
  const { platform } = request.params;

  const [fileName] = fs.readdirSync(path.resolve(__dirname, '..', 'uploads', platform));

  const filePath = path.resolve(__dirname, '..', 'uploads', platform, fileName);

  return response.download(filePath);
});

app.post('/upload/:platform', upload.single('file'), (request, response) => {
  return response.json({ ok: true });
});

app.listen(5555, () => console.log('Server started on port 5555'));