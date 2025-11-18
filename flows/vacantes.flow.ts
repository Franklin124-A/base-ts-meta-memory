import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app'

type Provider = any;
type Database = any;

// URL de la página de vacantes
const VACANTES_URL = 'https://papelesnacionales.com';

export const vacantesFlow = addKeyword(['vacantes', 'empleos', 'oportunidades', 'trabajos'])
    .addAnswer('💼 *VACANTES DISPONIBLES*')
    .addAnswer([
        'Selecciona una opción:',
        '',
        '1️⃣ Ver vacantes disponibles',
        '',
        '9️⃣ Volver al menú principal',
        '0️⃣ Salir',
        '',
        'Responde con el número de la opción que te interesa'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
        const option = ctx.body.trim();

        switch (option) {
            case '1':
                await flowDynamic([
                    '🔍 *No tenemos vacantes Actuales*',
                    '',
            //        '📌 Vacantes disponibles:',
            //        '• Mecánico de Mantenimiento',
            //        '• Técnico Electricista',
            //        '• Operador de Producción',
            //        '• Analista de Calidad',
            //        '',
            //        '📋 *Beneficios de trabajar con nosotros*',
            //        '• Alimentacion ',
            //        '• Primas de vacaciones y extra legal & de antiguedad',
            //        '• Rutas en Cartago y Pereira',
            //        '• ',
            //        '',
            //        '🌐 Para más detalles y aplicar:',
            //        `Visita: ${VACANTES_URL}`,
            //        '',
            //        '📞 *Contacto Gestión Humana:*',
            //        '• Email: seleccion@papelesnacionales.com',
            //        '• Tel: (XX) XXXX-XXXX',
            //        '',
            //        '⚠️ *Importante:*',
            //        '• Actualiza tu hoja de vida',
            //        '• Verifica los requisitos específicos',
            //        '• Aplica solo a las vacantes de tu interés',
            //        '',
            //        'Selecciona:',
            //        '8️⃣ Volver al menú de vacantes',
            //        '9️⃣ Ir al menú principal',
            //        '0️⃣ Salir'
                ].join('\n'));
                break;

            case '8':
                return gotoFlow(vacantesFlow);

            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic([
                    '👋 ¡Gracias por tu interés en nuestras vacantes!',
                    'Recuerda visitar regularmente nuestra página web para nuevas oportunidades.'
                ].join('\n'));
                return endFlow();

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣ Ver vacantes disponibles',
                    '',
                    '9️⃣ Volver al menú principal',
                    '0️⃣ Salir'
                ].join('\n'));
                return gotoFlow(vacantesFlow);
        }
    })
    .addAnswer(
        [
            'Selecciona una opción:',
            '',
            '8️⃣ Volver al menú de vacantes',
            '9️⃣ Ir al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '8':
                    return gotoFlow(vacantesFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar nuestras vacantes!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(vacantesFlow);
            }
        }
    );

export default vacantesFlow;