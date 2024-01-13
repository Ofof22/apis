const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const apiFolderPath = path.join(__dirname, 'api');
const jsonFile = 'apis.json';

// Klasörü oluştur
const uploadFolder = apiFolderPath; // Dosyaları doğrudan api klasörüne yükleyin
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const userDefinedTitle = req.body.title; // Kullanıcının belirlediği başlık
    const fileName = `${userDefinedTitle}.js`;
    cb(null, fileName);
  },
});


const upload = multer({ storage: storage });

// API dosyalarını yükleme fonksiyonu
const loadAPIs = () => {
  const apiFiles = fs.readdirSync(apiFolderPath);
  apiFiles.forEach((file) => {
    require(path.join(apiFolderPath, file))(app);
  });
};

// Uygulama başlatıldığında API'ları yükle
loadAPIs();

app.get('/babacikamcik', (req, res) => {
  res.render('babacikamcik');
});


// ...

// ...

// ...

app.post('/upload', upload.single('file'), (req, res) => {
  const { title, description, url } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'Dosya bulunamadı.' });
    return;
  }

  const fileName = `${title}.js`;
  const filePath = path.join(apiFolderPath, fileName);

  if (file.buffer) {
    fs.writeFileSync(filePath, file.buffer);
  } else {
    res.status(500).json({ error: 'Dosya içeriği boş veya tanımsız.' });
    return;
  }

  res.json({ message: 'Dosya başarıyla yüklendi.' });
});
app.get('/api/file', (req, res) => {
  // Dosya adını al
  const fileName = req.params.name;
  const filePath = path.join(apiFolderPath, fileName);

  try {
    // Dosya içeriğini oku
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    res.send(fileContent);
} catch (error) {
    // Hata durumunda 404 hatası gönder
    console.error(error); // Hatanın konsola yazdırılması
    res.status(404).send('Dosya bulunamadı veya içerik okunamadı.');
  }
});



app.get('/api/cac/:name', (req, res) => {
  // Dosya adını al
  const fileName = req.params.name;
  const filePath = path.join(apiFolderPath, fileName);

  try {
    // Dosya içeriğini oku
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    res.send(fileContent);
  } catch (error) {
    // Hata durumunda 404 hatası gönder
    res.status(404).send('Dosya bulunamadı.');
  }
});





function apileriGetir(callback) {
  fs.readFile("apis.json", "utf8", (err, data) => {
    if (err) {
      console.error("Apis.json dosyasını okuma hatası:", err);
      callback(err, null);
      return;
    }

    const apiler = JSON.parse(data);
    callback(null, apiler);
  });
}

// Örnek bir route
app.get("/api/veri", (req, res) => {
  apileriGetir((err, apiler) => {
    if (err) {
      // Hata durumunda gerekli işlemleri yapabilirsiniz
      res.status(500).send("Internal Server Error");
      return;
    }

    // Alınan API verisini kullanarak istediğiniz işlemleri yapabilirsiniz
    res.json(apiler);
  });
});


// ...


// ...


// ...


const jcsonFile = 'apis.json';

// 'share' endpoint'ini işle
app.post('/share', (req, res) => {
  const { title, description, url } = req.body;

  // Aynı bilgileri JSON dosyasına ekle
  const data = JSON.parse(fs.readFileSync(jcsonFile, 'utf-8') || '[]');
  data.push({ title, description, url });
  fs.writeFileSync(jcsonFile, JSON.stringify(data, null, 2));

  res.json({ succes: "Başarılı" });
});


app.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8') || '[]');
  res.render('list', { data });
});

app.listen(port, () => {
  console.log(`Uygulama ${port} portunda çalışıyor.`);
});
