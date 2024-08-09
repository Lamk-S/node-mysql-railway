import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pool as db } from './db.js';
import bcrypt from 'bcrypt';
import { PORT } from './config.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Ruta principal de prueba
app.get('/', (req, res) => {
    res.send('Welcome to Server');
});

// Ruta para el registro de datos
app.post('/api/registro', async (req, res) => {
    const {
        dni, nombre_apellido, edad, peso, altura, sexo, hmg, RBC, MCH, TLC, PLT, MCHC, RDW, PCV, MCV,
        fecha, hora, tipo_prediccion, resultado, usuario_id
    } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        const query = `
            INSERT INTO registro (dni, nombre_apellido, edad, peso, altura, sexo, hmg, RBC, MCH, TLC, PLT, MCHC, RDW, PCV, MCV, fecha, hora, tipo_prediccion, resultado, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [
            dni || null, nombre_apellido || null, edad || null, peso || null, altura || null, sexo || null,
            hmg || null, RBC || null, MCH || null, TLC || null, PLT || null, MCHC || null, RDW || null,
            PCV || null, MCV || null, fecha || null, hora || null, tipo_prediccion || null, resultado || null, usuario_id || null
        ]);

        res.status(201).send({ message: 'Registro guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        res.status(500).send({ error: 'Error al guardar el registro' });
    }
});

// Ruta para el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { nombre, dni } = req.body;

    try {
        const query = 'SELECT * FROM usuario WHERE nombre = ?';
        const [results] = await db.query(query, [nombre]);
        const user = results[0];

        if (user && user.dni) {
            const isMatch = await bcrypt.compare(dni, user.dni);
            console.log('DNI proporcionado:', dni);
            console.log('Hash almacenado:', user.dni);
            console.log('Resultado de la comparación:', isMatch);

            if (isMatch) {
                res.status(200).send({ message: 'Autenticación exitosa', user });
            } else {
                res.status(401).send({ error: 'Credenciales incorrectas' });
            }
        } else {
            res.status(401).send({ error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        res.status(500).send({ error: 'Error al autenticar el usuario' });
    }
});

// Ruta para el registro de usuario
app.post('/api/registro/usuario', async (req, res) => {
    const { nombre, dni } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(dni, 10);
        console.log('Hash generado para el DNI:', hashedPassword);

        const query = 'INSERT INTO usuario (nombre, dni) VALUES (?, ?)';
        await db.query(query, [nombre, hashedPassword]);

        res.status(201).send({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para obtener registros filtrados por tipo_prediccion
app.get('/api/ver/registro', async (req, res) => {
    try {
        const query = 'SELECT * FROM registro WHERE tipo_prediccion = 1';
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los registros:', error);
        res.status(500).send({ error: 'Error al obtener los registros' });
    }
});

// Ruta para obtener dni y nombre_apellido únicos para el gráfico
app.get('/api/ver/grafico', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT dni, nombre_apellido FROM registro WHERE tipo_prediccion = 1';
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los registros:', error);
        res.status(500).send({ error: 'Error al obtener los registros' });
    }
});

// Ruta para obtener datos del gráfico según el dni del paciente
app.get('/api/ver/grafico/:dni', async (req, res) => {
    const { dni } = req.params;

    try {
        const query = `
            SELECT fecha, hmg 
            FROM registro 
            WHERE dni = ? AND tipo_prediccion = 1
            ORDER BY fecha ASC
        `;
        const [rows] = await db.query(query, [dni]);

        if (rows.length === 0) {
            return res.status(404).send({ error: 'No se encontraron registros para este paciente' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los datos del gráfico:', error);
        res.status(500).send({ error: 'Error al obtener los datos del gráfico' });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});