import { addKeyword } from '@builderbot/bot';
import { menuFlow } from '../src/app';
import * as path from 'path';

type Provider = any;
type Database = any;

// Rutas de las imágenes con extensiones
const RUTAS = {
    CESANTIAS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Retiro_Cesantias.jpg'),
    CAJA_COMPENSACION: path.join(process.cwd(), 'assets', 'imagenesruta', 'Retiro_Cesantias.jpg')
};

// Mensajes para cada opción
const MENSAJES = {
    CESANTIAS: '📄 *Documentos necesarios para retirar cesantías*\n\nAquí encontrarás los requisitos para el retiro de tus cesantías.',
};

export const solicitudesFlow = addKeyword(['cesantias', 'caja', 'compensacion'])
    .addAnswer('📋 *INFORMACIÓN DE CESANTÍAS*')
    .addAnswer([
        'Selecciona una opción:',
        '',
        '1️⃣ *¿Qué documentos necesito para retirar mis cesantías?*',
        '',
        '9️⃣ Volver al menú principal',
        '0️⃣ Salir',
        '',
        'Responde con el número de la opción que te interesa'
    ].join('\n'), 
    { capture: true }, 
    async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
        const option = ctx.body.trim();

        switch (option) {
            case '1':
                try {
                    await flowDynamic([{
                        body: [
                            MENSAJES.CESANTIAS,
                            '⚠️ *Importante:*',
                            '• Documentos vigentes menor a 30 dias',
                            '• Tiempo de respuesta: 5 días hábiles',
                            '• Radicar en Gestion Humana',
                            '',
                            'Selecciona:',
                           '8️⃣ Volver al menú anterior',
                           '9️⃣ Ir al menú principal',
                           '0️⃣ Salir'
                        ].join('\n'),
                        media: RUTAS.CESANTIAS
                    }]);
                } catch (error) {
                    console.error('❌ Error al enviar la imagen:', error);
                    await flowDynamic('Lo siento, hubo un problema al cargar la información. Por favor, intenta nuevamente.');
                    return gotoFlow(solicitudesFlow);
                }
                break;

            case '8':
                return gotoFlow(solicitudesFlow);

            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic('👋 ¡Gracias por tu consulta! ¡Hasta pronto!');
                return endFlow();

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣ Documentos para cesantías',
                    '',
                    '9️⃣ Volver al menú principal',
                    '0️⃣ Salir'
                ].join('\n'));
                return gotoFlow(solicitudesFlow);
        }
    })
    .addAnswer(
        [
            'Selecciona una opción:',
            '',
            '8️⃣ Volver al menú de cesantías',
            '9️⃣ Ir al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '8':
                    return gotoFlow(solicitudesFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar información sobre cesantías!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(solicitudesFlow);
            }
        }
    );

export default solicitudesFlow;