const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/career-guidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    const employeeSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    });
    const Employee = mongoose.model('Employee', employeeSchema);

    const hashedPassword = await bcrypt.hash('password123', 10);
    const employee = new Employee({ username: 'admin', password: hashedPassword });
    await employee.save();
    console.log('Employee created: admin/password123');
    mongoose.connection.close();
}).catch(err => console.error('Error:', err));