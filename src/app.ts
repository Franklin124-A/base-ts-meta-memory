import * as dotenv from 'dotenv';
import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import * as XLSX from 'xlsx'
import * as fs from 'fs';
import * as path from 'path';



import solicitudesFlow from '../flows/cesantias.flow';
import beneficiosFlow from '../flows/Cartalaboral.Flow';
import reclutamientoFlow from '../flows/concursos.Flow';
import auxiliosFlow from  '../flows/auxilios.Flow';
import rutasFlow  from 'flows/rutas.flow';
import comprasFlow  from 'flows/compras.flow';
import actualizacionFlow  from 'flows/actualizacion.flow'; 
import bienestarFlow  from 'flows/Bienestar.flow'; 
import afiliacionesFlow from 'flows/cajadecompensacion.flow';
import vacantesFlow from 'flows/vacantes.flow' 
import eventosFlow from 'flows/otros.flow'
import seguridadSocialFlow from 'flows/seguridad.flow'


dotenv.config()

const PORT = process.env.PORT || 3000


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
                nombre: usuario.nombre
            };
        } else {
            return { encontrado: false, nombre: null };
        }
    } catch (error) {
        console.error('Error al verificar cédula:', error);
        return { encontrado: false, nombre: null };
    }
}



export const menuFlow = addKeyword<Provider, Database>(utils.setEvent('MENU'))
    .addAnswer([
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
    //    '1️⃣1️⃣💼 *Vacantes*',
    //    '1️⃣2️⃣🎆 *Informacion de eventos o actividades actuales*',
        '0️⃣ *Salir*',
        
        '',
        '*Responde con el número de la opción que necesitas*',
        '',
        'ℹ️ Puedes salir del menu escribiendo *"Salir"*'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
        const option = ctx.body.trim().toLowerCase();
        
    
        if (option === '0' || option.includes('salir')) {
            await flowDynamic('Gracias por contactar con Recursos Humanos. ¡Hasta pronto! 👋');
            return endFlow();
        }
        

        if (option === '1' || option.includes('seguridad')) {
            return gotoFlow(seguridadSocialFlow);
        } else if (option === '2' || option.includes('vacacion') || option.includes('permiso')) {
            return gotoFlow(solicitudesFlow);
        } else if (option === '3' || option.includes('beneficio')) {
            return gotoFlow(beneficiosFlow);
        } else if (option === '4' || option.includes('reclutamiento')) {
            return gotoFlow(reclutamientoFlow);
        } else if (option === '5' || option.includes('agente') || option.includes('humano')) {
            return gotoFlow(afiliacionesFlow);
        } else if (option === '6' || option.includes('auxilio') || option.includes('transporte')) {
            return gotoFlow(auxiliosFlow);
        } else if (option === '7' || option.includes('rutas') || option.includes('transporte')) {
            return gotoFlow(rutasFlow);
        } else if (option === '8' || option.includes('compra') || option.includes('compras')) {
            return gotoFlow(comprasFlow);
        } else if (option === '9' || option.includes('actualizacion') || option.includes('datos')) {
            return gotoFlow(actualizacionFlow);
        } else if (option === '10' || option.includes('bienestar') || option.includes('datos')) {
            return gotoFlow(bienestarFlow);
        } else if (option === '11' || option.includes('bienestar') || option.includes('datos')) {
            return gotoFlow(vacantesFlow);
        } else if (option === '12' || option.includes('otros') || option.includes('eventos')) {
            return gotoFlow(eventosFlow);



        } else {

            await flowDynamic([
                '⚠️ No he entendido tu respuesta.',
                '',
                'Por favor selecciona una opción válida (1-10) o escribe "salir" para terminar la conversación.'
            ].join('\n'));
            return gotoFlow(menuFlow);
        }
    }
);


export const volverMenuFlow = addKeyword<Provider, Database>(['menu', 'volver', 'inicio', 'principal', 'regresar'])
    .addAction(async (_, { gotoFlow }) => {
        return gotoFlow(menuFlow);  
    })
    
const helpFlow = addKeyword<Provider, Database>(['ayuda', 'help', 'opciones', 'comandos'])
    .addAnswer('🆘 *Centro de Ayuda*')
    .addAnswer([
        'Estos son los comandos disponibles:',
        '',
        '• Escribe *menu* para ver el menú principal',
        '• Escribe *politicas* para consultar políticas de RRHH',
        '• Escribe *vacaciones* para solicitar tiempo libre',
        '• Escribe *beneficios* para ver compensaciones',
        '• Escribe *reclutamiento* para procesos de selección',
        '• Escribe *agente* para hablar con un humano',
        '• Escribe *auxilio* para ver el menu',
        '¿En qué más puedo ayudarte?'
    ].join('\n'))


const welcomeFlow = addKeyword<Provider, Database>(['hola', 'buenos dias', 'buenas', 'hi', 'hello', 'inicio','Holi','hola','holi','buenas tardes','buenas noches','Buenas tardes','Buenas noches','Hola como estan'])
    .addAnswer('👋 *¡Bienvenido a GrandBay Papeles Nacionales S.A.S., el mejor lugar para trabajar!*\n Soy tu Asistente Virtual de Recursos Humanos, diseñado exclusivamente para nuestros colaboradores .')

               
    .addAnswer([
        'Para acceder a nuestros servicios, *necesito verificar tu identidad.*',
        '',
        'Por favor, *ingresa tu número de cédula*:'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, state }) => {
        const cedula = ctx.body.trim();
        
        
        const resultado = verificarCedula(cedula);
        
        if (resultado.encontrado) {
            
            await state.update({ 
                cedula: cedula,
                nombre: resultado.nombre
            });
            
            await flowDynamic([
                '✅ *Identidad verificada correctamente*',
                '',
                `¡Hola ${resultado.nombre}! Tu cédula ${cedula} ha sido validada.`,
                '',
                'Accediendo al menú principal...'
            ].join('\n'));
            
            
            return gotoFlow(menuFlow);
        } else {
            await flowDynamic([
                '❌ *Cédula no reconocida*',
                '',
                'Lo siento, la cédula ingresada no se encuentra en nuestro sistema.',
                '',
                'Por favor, verifica el número e intenta nuevamente o contacta a soporte técnico.'
            ].join('\n'));
            
           
            return gotoFlow(welcomeFlow);
        }
    }
)

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
    ])
    
    
    const adapterProvider = createProvider(Provider, { // Asegúrate que 'Provider' esté bien importado
        jwtToken: process.env.META_ACCESS_TOKEN,     // <-- CAMBIADO: Usa el nombre del .env
        numberId: process.env.META_PHONE_NUMBER_ID, // <-- CAMBIADO: Usa el nombre del .env
        verifyToken: process.env.VERIFY_TOKEN,      // <-- CAMBIADO: Usa el nombre del .env
        version: 'v22.0',                           // <-- Mantén la versión que necesitas
        appSecret: process.env.META_APP_SECRET      // <-- AÑADIDO: Necesitas añadir el App Secret
      });
    
    const adapterDB = new Database()

    
    const { handleCtx, httpServer } = await createBot({
    
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/menu',
        handleCtx(async (bot, req, res) => {
            const { number } = req.body
            await bot.dispatch('MENU', { from: number, name: 'Usuario' })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )
    

    httpServer(+PORT)
}

main();