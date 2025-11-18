import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app'

type Provider = any;
type Database = any;

export const bienestarFlow = addKeyword(['bienestar', 'salud', 'accidente', 'incapacidad'])
    .addAnswer('🏥 *BIENESTAR Y SALUD LABORAL*')
    .addAnswer([
        'Selecciona una opción:',
        '',
        '1️⃣ ¿Qué hacer ante un accidente de trabajo?',
        '2️⃣ ¿Qué hacer en caso de incapacidad?',
        '3️⃣ Programa de Salud Mental',
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
                    '🚨 *¿Qué hacer ante un accidente de trabajo?*',
                    '',
                    '1. Reporta inmediatamente a tu jefe inmediato',
                    '',
                    '2. Contacta a Seguridad en el trabajo:',
                    '• Extensión: 1840',
                    '• ',
                    '• Email: coseguridad.indu@papelesnacionales.com',
                    '',
                   // '⚠️ *Importante:*',
                    //'• No te retires de la empresa sin autorización',
                 //   '• Guarda todos los documentos médicos',
                 //   '• Sigue todas las indicaciones médicas',//
                 //   '',
                 //   'Selecciona:',
                 //   '8️⃣ Volver al menú de bienestar',
                 //   '9️⃣ Ir al menú principal',
                 //   '0️⃣ Salir'
                ].join('\n'));
                break;

            case '2':
                await flowDynamic([
                    '🏥 *¿Qué hacer en caso de incapacidad?*',
                    '',
                    '1. Al momento de ir a un servicio de salud (IPS o urgencias) debes notificar al jefe inmediato y al área de Salud en el trabajo.',
                    ' Una vez te emitan la incapacidad, debes reportarla de manera inmediata al área de Salud en el trabajo. Debes solicitar la historia clínica completa del evento y la respectiva incapacidad, antes de retirarte de la IPS.     ',
                    ' Una vez tengas los documentos de incapacidad e historia clínica debes entregarlas físicamente en Salud en el trabajo inmediatamente, con un plazo máximo de 2 días para la entrega de los documentos.',
                    ' Recuerda que, dependiendo del motivo de tu incapacidad, se te solicitarán unos documentos adicionales para realizar el proceso.',
                    '2.*Contacta a emfermeria*:321 492 8344',
                    ' Extensión: 1841',
                    ' Email: enfermeria@papelesnacionales.com',
                    '',
                    '📝 *Documentos necesarios:*',
                    ' Incapacidad original',
                    ' Historia clínica',
             //       '• Documentos de la EPS',
                    '',
              //      '⚠️ *Recuerda:*',
              //      '• Tienes 2 días para entregar la incapacidad',
              //      '• Debe ser documento original',
              //      '• Mantén informado a tu supervisor',
              //      '',
              //      'Selecciona:',
              //      '8️⃣ Volver al menú de bienestar',
              //      '9️⃣ Ir al menú principal',
              //      '0️⃣ Salir'
                ].join('\n'));
                break;

            case '3':
                await flowDynamic([
                    '🧠 *Programa de Salud Mental*',
                    '',
                    '¡Sabías que!',
                    'En Panasa, nos preocupamos por tu bienestar mental.',
                    'Por eso, tenemos una excelente noticia: contamos con un aliado estratégico para brindarte apoyo.',
                    '',
                    '📅 A partir del 1 de abril, podrás acceder a consultas de psicología clínica.',
                    '',
                    '📝 *¿Cómo solicitar la atención?*',
                    'Contacta a Roberto Guerra Testa,',
                    'Numero de celular: 321 492 8344 ,',
                    'Coordinador de Salud en el trabajo',
                    '',
                    '📧 *Correo:*',
                    'roberto.g.testa@papelesnacionales.com>',
                    '',
                    '📞 *Teléfono:*',
                    '602-2095000',
                    '',
                    '💭 En Panasa, la salud mental y el bienestar',
                    'de nuestros colaboradores son nuestra prioridad.',
                    '',
              //      'Selecciona:',
              //      '8️⃣ Volver al menú de bienestar',
              //      '9️⃣ Ir al menú principal',
              //      '0️⃣ Salir'
                ].join('\n'));
                break;

            case '8':
                return gotoFlow(bienestarFlow);

            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic('👋 ¡Gracias por consultar información de bienestar!');
                return endFlow();

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣ ¿Qué hacer ante un accidente de trabajo?',
                    '2️⃣ ¿Qué hacer en caso de incapacidad?',
                    '3️⃣ Programa de Salud Mental',
                    '',
                    '9️⃣ Volver al menú principal',
                    '0️⃣ Salir'
                ].join('\n'));
                return gotoFlow(bienestarFlow);
        }
    })
    .addAnswer(
        [
            'Selecciona una opción:',
            '',
            '8️⃣ Volver al menú de bienestar',
            '9️⃣ Ir al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '8':
                    return gotoFlow(bienestarFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar información de bienestar!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(bienestarFlow);
            }
        }
    );

export default bienestarFlow;