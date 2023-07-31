const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// URL koneksi MongoDB (ganti "default" sesuai dengan nama koneksi di MongoDB Compass)
const mongoURL = 'mongodb://127.0.0.1:27017/agenda';

// Fungsi untuk menghubungkan ke MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Terhubung ke MongoDB');
  } catch (error) {
    console.error('Gagal terhubung ke MongoDB:', error.message);
  }
};

// Panggil fungsi untuk menghubungkan ke MongoDB
connectToMongoDB();

// Middleware untuk parsing request body
app.use(cors());
app.use(express.json());

// Membuat model Agenda
const agendaSchema = new mongoose.Schema({
  id: String,
  nama: String,
  penanggungJawab: String,
  tanggal: String,
  tempat: String,
  status: String,
});

const Agenda = mongoose.model('Agenda', agendaSchema);

// API endpoint untuk menyimpan agenda
app.post('/api/Notifikasi', async (req, res) => {
  try {
    // Ambil data dari request body
    const { id, nama, penanggungJawab, tanggal, tempat, status } = req.body;

    // Simpan data agenda ke MongoDB
    const agenda = new Agenda({
      id,
      nama,
      penanggungJawab,
      tanggal,
      tempat,
      status,
    });

    await agenda.save();

    //console.log('Agenda berhasil disimpan:', agenda);
    res.json({ message: 'Agenda berhasil disimpan' });
  } catch (error) {
    console.error('Gagal menyimpan agenda:', error.message);
    res.status(500).json({ message: 'Gagal menyimpan agenda' });
  }
});

app.get('/api/ambil', async (req, res) => {
  try {
    // Ambil semua data agenda dari MongoDB
    const agendas = await Agenda.find();

    res.json(agendas);
  } catch (error) {
    console.error('Gagal mendapatkan data agenda:', error.message);
    res.status(500).json({ message: 'Gagal mendapatkan data agenda' });
  }
});

// API endpoint untuk menghapus agenda berdasarkan ID
app.delete('/api/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Hapus data agenda dari MongoDB berdasarkan ID
    await Agenda.findByIdAndDelete(id);

    res.json({ message: 'Agenda berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus agenda:', error.message);
    res.status(500).json({ message: 'Gagal menghapus agenda' });
  }
});

app.put('/api/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nama, penanggungJawab, tanggal, tempat, status } = req.body;

    // Cari data agenda berdasarkan ID dan lakukan update
    await Agenda.updateOne(
      { _id: id },
      { nama, penanggungJawab, tanggal, tempat, status }
    );

    res.json({ message: 'Agenda berhasil diupdate' });
  } catch (error) {
    console.error('Gagal mengupdate agenda:', error.message);
    res.status(500).json({ message: 'Gagal mengupdate agenda' });
  }
});

app.get('/api/dashboard-data', async (req, res) => {
  try {
    // Ambil total agenda
    const totalAgenda = await Agenda.countDocuments();

    // Hitung jumlah status
    const successCount = await Agenda.countDocuments({ status: 'Success' });
    const pendingCount = await Agenda.countDocuments({ status: 'Pending' });
    const cancelCount = await Agenda.countDocuments({ status: 'Cancel' });

    res.json({
      totalAgenda,
      successCount,
      pendingCount,
      cancelCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
