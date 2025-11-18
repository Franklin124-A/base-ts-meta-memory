import { addKeyword } from '@builderbot/bot';
import { menuFlow } from '../src/app';
import * as path from 'path';

type Provider = any;
type Database = any;

// Rutas de las imágenes con extensiones
const RUTAS = {
    PEREIRA_TURNOS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Pereira_Turnos.jpg'),
    PEREIRA_CENTRO: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Centro.jpg'),
    CARTAGO_TURNOS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Ruta_CartagoP.jpg'),
    CARTAGO: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Cartago.jpg'),
    SUR: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Sur.jpg'),
    DOSQUEBRADAS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_D-bradas.jpg'),
    INGENIERIA: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_I&P.jpg')
};

// Mensajes para cada ruta
const MENSAJES = {
    PEREIRA_TURNOS: '🚌 *Ruta Pereira - Turnos 1, 2 y 3*\n\n',
    PEREIRA_CENTRO: '🚌 *Ruta Pereira Centro - Turno 4*\n\n',
    CARTAGO_TURNOS: '🚌 *Ruta Cartago - Turnos 1, 2 y 3*\n\n',
    CARTAGO_4: '🚌 *Ruta Cartago - Turno 4*\n\n',
    SUR: '🚌 *Ruta Avenida Sur - Pereira*\n\n',
    DOSQUEBRADAS: '🚌 *Ruta Dosquebradas*\n\n',
    INGENIERIA: '🚌 *Ruta Ingeniería & Proyectos*\n\n'
};

export const rutasFlow = addKeyword(['rutas de transporte', 'información de rutas', 'transporte rutas'])
    .addAnswer('🚌 *Rutas de Transporte*')
    .addAnswer([
        '1️⃣🚌 Ruta *turno 1,2,3 Pereira*',
        '2️⃣🚌 Ruta turno 4 *Pereira CENTRO*',
        '3️⃣🚌 Ruta turno 1,2,3 *Cartago*',
        '4️⃣🚌 Ruta turno *4 Cartago*',
        '5️⃣🚌 Ruta *Av Sur Pereira*',
        '6️⃣🚌 Ruta *Dosquebradas*',
        '7️⃣⚙️ Ruta *Ingeniería & Proyectos*',
        '',
        '9️⃣↩️ Volver',
        '0️⃣👋 Salir'
    ].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
        const option = ctx.body.trim();

        const enviarRuta = async (mensaje: string, rutaImagen: string) => {
            try {
                await flowDynamic([{ body: mensaje, media: rutaImagen }]);
                await flowDynamic('🚏 ¿Deseas consultar otra ruta?\n\nVuelve al menú principal para más opciones.');
                return gotoFlow(rutasFlow);
            } catch (error) {
                console.error('❌ Error al enviar la imagen:', error);
                await flowDynamic('Lo siento, hubo un problema al cargar la imagen de la ruta.');
                return gotoFlow(rutasFlow);
            }
        };

        switch (option) {
            case '1':
                return enviarRuta(MENSAJES.PEREIRA_TURNOS, RUTAS.PEREIRA_TURNOS);

            case '2':
                return enviarRuta(MENSAJES.PEREIRA_CENTRO, RUTAS.PEREIRA_CENTRO);

            case '3':
                return enviarRuta(MENSAJES.CARTAGO_TURNOS, RUTAS.CARTAGO_TURNOS);

            case '4':
                return enviarRuta(MENSAJES.CARTAGO_4, RUTAS.CARTAGO);

            case '5':
                return enviarRuta(MENSAJES.SUR, RUTAS.SUR);

            case '6':
                return enviarRuta(MENSAJES.DOSQUEBRADAS, RUTAS.DOSQUEBRADAS);

            case '7':
                return enviarRuta(MENSAJES.INGENIERIA, RUTAS.INGENIERIA);

            case '0':
                await flowDynamic('👋 ¡Gracias por consultar nuestras rutas! ¡Hasta pronto!');
                return endFlow();

            case '9':
                return gotoFlow(menuFlow);

            default:
                await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción del menú.');
                return gotoFlow(rutasFlow);
        }
    });

export default rutasFlow;