const User = require('../models/userSchema')
const bcryt = require('bcrypt')

const registerUser = async (req, res) => {
    try {
        const { nombre, email, password, role } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe en la base de datos' });
        }

        const hashedPassword = await bcryt.hash(password, 10);

        user = new User({
            nombre: nombre,
            email: email,
            password: hashedPassword,
            role: role
        })

        await user.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        return res.status(500).json({ 
            msg: `Error al registrar el usuario: ${error.message}`
        });
    }
}

module.exports = { registerUser }