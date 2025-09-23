const mongoose = require('mongoose');
const createApp = require('./app');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const app = createApp();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});