const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        const { nombre, email, password, role } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe en la base de datos' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe en la base de datos' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' })
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: '1h'}
        )

        return res.status(200).json({
            token
        })
    } catch (error) {
        return res.status(500).json({ 
            msg: `Error al iniciar sesión: ${error.message}`
        });
    }
}

module.exports = { registerUser, loginUser }