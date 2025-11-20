import * as dotenv from 'dotenv';
import { join } from 'path';
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { MetaProvider as Provider } from '@builderbot/provider-meta';
import { MetaProvider } from '@builderbot/provider-meta';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

import solicitudesFlow from '../flows/cesantias.flow';
import beneficiosFlow from '../flows/Cartalaboral.Flow';
import reclutamientoFlow from '../flows/concursos.Flow';
import auxiliosFlow from '../flows/auxilios.Flow';
import rutasFlow from '../flows/rutas.flow';
import comprasFlow from '../flows/compras.flow';
import actualizacionFlow from '../flows/actualizacion.flow';
import bienestarFlow from '../flows/Bienestar.flow';
import afiliacionesFlow from '../flows/cajadecompensacion.flow';
import vacantesFlow from '../flows/vacantes.flow';
import eventosFlow from '../flows/otros.flow';
import seguridadSocialFlow from '../flows/seguridad.flow';

dotenv.config();

const PORT = process.env.PORT || 3000;

/* ------------------------------- Verificación de cédula ------------------------------- */
function verificarCedula(cedula: string) {
    try {
        const rutaJson = path.resolve(process.cwd(), 'assets', 'base_datos.json');
        console.log('Intentando leer archivo JSON en:', rutaJson);

        if (!fs.existsSync(rutaJson)) {
            console.error('El archivo JSON no existe en:', rutaJson);
            return { encontrado: false, nombre: null };
        }

        const datosRaw = fs.readFileSync(rutaJson, 'utf8');
        const datos = JSON.parse(datosRaw);

        interface Usuario {
            nombre: string;
            cedula: string;
            cargo: string;
        }

        const usuario = datos.find((row: Usuario) => String(row.cedula) === String(cedula));

        if (usuario) {
            return {
                encontrado: true,
                nombre: usuario.nombre,
            };
        } else {
            return { encontrado: false, nombre: null };
        }
    } catch (error) {
        console.error('Error al verificar cédula:', error);
        return { encontrado: false, nombre: null };
    }
}

/* ------------------------------- Webhook directo desde Meta ------------------------------- */
const app = express();
app.use(bodyParser.json());

// ✅ GET para verificación de Meta
app.get('/webhook', (req, res) => {
    const verifyToken = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === verifyToken) {
        console.log('✅ Webhook verificado correctamente con Meta');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Verificación fallida');
        res.sendStatus(403);
    }
});

// ✅ POST para recibir y responder mensajes de WhatsApp
app.post('/webhook', async (req, res) => {
    try {
        console.log('📨 Webhook recibido desde Meta:');
        console.log(JSON.stringify(req.body, null, 2));

        res.sendStatus(200); // Confirma recepción a Meta

        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const message = changes?.value?.messages?.[0];
        const from = message?.from;
        const text = message?.text?.body;

        if (text && from) {
            console.log(`💬 Mensaje recibido de ${from}: ${text}`);

            // 🔹 Enviar una respuesta automática al remitente
            await axios.post(
                `https://graph.facebook.com/v24.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    type: 'text',
                    text: {
                        body: '👋 Hola, soy tu Asistente Virtual de Recursos Humanos.\n' +
                              'Escribe *menu* para ver las opciones o *ayuda* para más información.'
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('📤 Respuesta enviada correctamente a WhatsApp ✅');
        } else {
            console.log('⚠️ No se encontró texto o número en el mensaje entrante.');
        }
    } catch (error) {
        console.error('❌ Error procesando webhook:', error.response?.data || error.message);
    }
});

/* ------------------------------- Menú Principal ------------------------------- */
export const menuFlow = addKeyword<Provider, Database>(utils.setEvent('MENU'))
    .addAnswer(
        [
            '🔍 *Menú Principal - Recursos Humanos*',
            '',
            '¿En qué puedemos ayudarte?',
            '',
            '1️⃣ 🏦 *Informacion de mi Seguridad Social*',
            '2️⃣ 💰 *Cesantias*',
            '3️⃣ 📄 *Carta Laboral*',
            '4️⃣ 🏆 *Concursos Internos*',
            '5️⃣ 🔍 *Caja de Compensacion*',
            '6️⃣ 📚 *Auxilios y Beneficios*',
            '7️⃣ 🚌 *Información de Rutas*',
            '8️⃣ 🛒 *Compra de Productos*',
            '9️⃣ 🍽️ *Menu alternativo del casino*',
            '🔟 🧘 *Seguridad y Salud en el trabajo*',
            '0️⃣ *Salir*',
            '',
            '*Responde con el número de la opción que necesitas*',
            '',
            'ℹ️ Puedes salir del menu escribiendo *"Salir"*',
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim().toLowerCase();

            if (option === '0' || option.includes('salir')) {
                await flowDynamic('Gracias por contactar con Recursos Humanos. ¡Hasta pronto! 👋');
                return endFlow();
            }

            switch (option) {
                case '1':
                    return gotoFlow(seguridadSocialFlow);
                case '2':
                    return gotoFlow(solicitudesFlow);
                case '3':
                    return gotoFlow(beneficiosFlow);
                case '4':
                    return gotoFlow(reclutamientoFlow);
                case '5':
                    return gotoFlow(afiliacionesFlow);
                case '6':
                    return gotoFlow(auxiliosFlow);
                case '7':
                    return gotoFlow(rutasFlow);
                case '8':
                    return gotoFlow(comprasFlow);
                case '9':
                    return gotoFlow(actualizacionFlow);
                case '10':
                    return gotoFlow(bienestarFlow);
                case '11':
                    return gotoFlow(vacantesFlow);
                case '12':
                    return gotoFlow(eventosFlow);
                default:
                    await flowDynamic([
                        '⚠️ No he entendido tu respuesta.',
                        '',
                        'Por favor selecciona una opción válida (1-10) o escribe "salir" para terminar la conversación.',
                    ].join('\n'));
                    return gotoFlow(menuFlow);
            }
        }
    );

/* ------------------------------- Flujos auxiliares ------------------------------- */
export const volverMenuFlow = addKeyword<Provider, Database>(['menu', 'volver', 'inicio', 'principal', 'regresar'])
    .addAction(async (_, { gotoFlow }) => gotoFlow(menuFlow));

const helpFlow = addKeyword<Provider, Database>(['ayuda', 'help', 'opciones', 'comandos'])
    .addAnswer('🆘 *Centro de Ayuda*')
    .addAnswer(
        [
            'Estos son los comandos disponibles:',
            '',
            '• Escribe *menu* para ver el menú principal',
            '• Escribe *politicas* para consultar políticas de RRHH',
            '• Escribe *vacaciones* para solicitar tiempo libre',
            '• Escribe *beneficios* para ver compensaciones',
            '• Escribe *reclutamiento* para procesos de selección',
            '• Escribe *agente* para hablar con un humano',
            '• Escribe *auxilio* para ver el menu',
            '¿En qué más puedo ayudarte?',
        ].join('\n')
    );

/* ------------------------------- Bienvenida y verificación ------------------------------- */
const welcomeFlow = addKeyword<Provider, Database>([
    'hola', 'buenos dias', 'buenas', 'hi', 'hello', 'inicio', 'holi', 'buenas tardes', 'buenas noches',
])
    .addAnswer(
        '👋 *¡Bienvenido a GrandBay Papeles Nacionales S.A.S.!*\nSoy tu Asistente Virtual de Recursos Humanos.'
    )
    .addAnswer(
        [
            'Para acceder a nuestros servicios, *necesito verificar tu identidad.*',
            '',
            'Por favor, *ingresa tu número de cédula*:',
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, state }) => {
            const cedula = ctx.body.trim();
            const resultado = verificarCedula(cedula);

            if (resultado.encontrado) {
                await state.update({ cedula, nombre: resultado.nombre });
                await flowDynamic(
                    [
                        '✅ *Identidad verificada correctamente*',
                        '',
                        `¡Hola ${resultado.nombre}! Tu cédula ${cedula} ha sido validada.`,
                        '',
                        'Accediendo al menú principal...',
                    ].join('\n')
                );
                return gotoFlow(menuFlow);
            } else {
                await flowDynamic(
                    [
                        '❌ *Cédula no reconocida*',
                        '',
                        'Lo siento, la cédula ingresada no se encuentra en nuestro sistema.',
                        '',
                        'Por favor, verifica el número e intenta nuevamente o contacta a soporte técnico.',
                    ].join('\n')
                );
                return gotoFlow(welcomeFlow);
            }
        }
    );

/* ------------------------------- Flujo genérico de fallback ------------------------------- */
const defaultFlow = addKeyword<Provider, Database>(['*'])
    .addAnswer(
        '🤖 Hola 👋, soy tu asistente virtual de Recursos Humanos.\n' +
        'Escribe *menu* para ver las opciones principales o *ayuda* para más comandos.'
    );

/* ------------------------------- Inicio del bot ------------------------------- */
const main = async () => {
    const adapterFlow = createFlow([
        seguridadSocialFlow,
        welcomeFlow,
        menuFlow,
        solicitudesFlow,
        beneficiosFlow,
        reclutamientoFlow,
        afiliacionesFlow,
        helpFlow,
        volverMenuFlow,
        auxiliosFlow,
        rutasFlow,
        comprasFlow,
        actualizacionFlow,
        bienestarFlow,
        vacantesFlow,
        eventosFlow,
        defaultFlow
    ]);
    
  const adapterProvider: any = createProvider(Provider, {
  jwtToken: process.env.META_ACCESS_TOKEN,
  numberId: process.env.META_PHONE_NUMBER_ID,
  verifyToken: process.env.VERIFY_TOKEN,
  version: 'v24.0',
  appSecret: process.env.META_APP_SECRET,
});

    const adapterDB = new Database();

// @ts-ignore
const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
});

    httpServer(Number(PORT));
    console.log(`🛜 Server running on port ${PORT}`);
};

main();

// 🔹 Express listener adicional
app.listen(Number(PORT), () => {
    console.log(`🛜 Express escuchando Webhook en el puerto ${PORT}`);
});
