import * as dotenv from 'dotenv';
import { join } from 'path';
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { MetaProvider as Provider } from '@builderbot/provider-meta';
import * as fs from 'fs';
import * as path from 'path';

// Importación de tus flujos
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
        // console.log('Intentando leer archivo JSON en:', rutaJson); // Descomentar si necesitas depurar

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

/* ------------------------------- Menú Principal ------------------------------- */
export const menuFlow = addKeyword<Provider, Database>(utils.setEvent('MENU'))
    .addAnswer(
        [
            '🔍 *Menú Principal - Recursos Humanos*',
            '',
            '¿En qué podemos ayudarte?',
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
                case '1': return gotoFlow(seguridadSocialFlow);
                case '2': return gotoFlow(solicitudesFlow);
                case '3': return gotoFlow(beneficiosFlow);
                case '4': return gotoFlow(reclutamientoFlow);
                case '5': return gotoFlow(afiliacionesFlow);
                case '6': return gotoFlow(auxiliosFlow);
                case '7': return gotoFlow(rutasFlow);
                case '8': return gotoFlow(comprasFlow);
                case '9': return gotoFlow(actualizacionFlow);
                case '10': return gotoFlow(bienestarFlow);
                case '11': return gotoFlow(vacantesFlow);
                case '12': return gotoFlow(eventosFlow);
                default:
                    await flowDynamic('⚠️ Opción no válida, por favor intenta de nuevo.');
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
            '• *menu*: Ir al menú principal',
            '• *salir*: Terminar la conversación',
            '¿En qué más puedo ayudarte?',
        ].join('\n')
    );

/* ------------------------------- Bienvenida y verificación ------------------------------- */
const welcomeFlow = addKeyword<Provider, Database>([
    'hola', 'buenos dias', 'buenas', 'hi', 'hello', 'inicio', 'holi', 'buenas tardes', 'buenas noches',
])
    .addAnswer('👋 *¡Bienvenido a GrandBay Papeles Nacionales S.A.S.!*\nSoy tu Asistente Virtual de Recursos Humanos.')
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
                await flowDynamic(`✅ *Identidad verificada*. ¡Hola ${resultado.nombre}!`);
                return gotoFlow(menuFlow);
            } else {
                await flowDynamic('❌ *Cédula no reconocida*. Intenta nuevamente.');
                return gotoFlow(welcomeFlow);
            }
        }
    );

/* ------------------------------- Flujo genérico ------------------------------- */
const defaultFlow = addKeyword<Provider, Database>(['*'])
    .addAnswer('🤖 Escribe *hola* para iniciar o *menu* para ver opciones.');

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

    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.META_ACCESS_TOKEN,
        numberId: process.env.META_PHONE_NUMBER_ID,
        verifyToken: process.env.VERIFY_TOKEN,
        version: 'v24.0',
    });

    const adapterDB = new Database();

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    httpServer(Number(PORT)); // BuilderBot maneja el servidor aquí
    console.log(`🛜 Bot de RRHH ejecutándose en el puerto ${PORT}`);
};

main();