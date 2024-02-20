import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express();
app.use(cors());
// MongoDB bağlantısı
mongoose.connect('mongodb+srv://emirhan:fCRYG7y3bEZSgRdq@emirhan.1gsm5of.mongodb.net/Hello-Mongo?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası', err));

    const Schema = mongoose.Schema
    const formDataSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        tel: {
            type: String,
            required: true
        }
    });

// Model oluşturma
const FormData = mongoose.model('FormData', formDataSchema);

app.use(express.json());

// Form verilerini alma ve MongoDB'ye kaydetme
app.post('/submit-form', async (req, res) => {
    try {
        const { firstName, lastName, tel, } = req.body;

        // Yeni form verisi oluşturma
        const newFormData = new FormData({
            firstName,
            lastName,
            tel,
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Veriyi MongoDB'ye kaydetme
        await newFormData.save();

        console.log('Form verisi kaydedildi:', newFormData);
        
        res.status(200).send('Form başarıyla kaydedildi.');
    } catch (err) {
        console.error('Form kaydetme hatası:', err);
        res.status(500).send('Form kaydedilirken bir hata oluştu.');
    }
});
app.get('/submit-form', async (req, res) => {
    try {
        // Veritabanından kaydedilen verileri al
        const savedFormData = await FormData.find();
        res.json(savedFormData); // Kaydedilen verileri JSON formatında istemciye gönder
    } catch (error) {
        console.error('Kaydedilen verileri alırken bir hata oluştu:', error);
        res.status(500).send('Kaydedilen verileri alırken bir hata oluştu.');
    }
});
// Form verilerini silme
app.delete('/submit-form/:id', async (req, res) => {
    try {
        const deletedFormData = await FormData.findByIdAndDelete(req.params.id);
        if (!deletedFormData) {
            return res.status(404).send('Silinecek veri bulunamadı.');
        }
        res.status(200).send('Form verisi başarıyla silindi.');
    } catch (error) {
        console.error('Form silme hatası:', error);
        res.status(500).send('Form silinirken bir hata oluştu.');
    }
});
// Form verilerini güncelleme
app.put('/submit-form/:id', async (req, res) => {
    try {
        const { firstName, lastName, tel } = req.body;
        const updatedFormData = await FormData.findByIdAndUpdate(req.params.id, { firstName: req.body.firstName, lastName: req.body.lastName, tel: req.body.tel }, { new: true });
        if (!updatedFormData) {
            return res.status(404).send('Güncellenecek veri bulunamadı.');
        }
        res.status(200).send('Form verisi başarıyla güncellendi.');
    } catch (error) {
        console.error('Form güncelleme hatası:', error);
        res.status(500).send('Form güncellenirken bir hata oluştu.');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
