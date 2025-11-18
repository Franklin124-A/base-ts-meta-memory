import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app'

type Provider = any;
type Database = any;

export const concursosFlow = addKeyword(['concursos', 'concurso', 'oportunidades', 'procesos'])
    .addAnswer('🏆 *CONCURSOS Y OPORTUNIDADES INTERNAS*')
    .addAnswer([
        'Selecciona una opción:',
        '',
        '1️⃣ Información de concursos vigentes',
    //   '2️⃣ Requisitos generales',
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
                    '📌 *Información de concursos vigentes*',
                    '',
                      'Actualmente *NO* tenemos concursos abiertos',
            //        '• Concurso interno (Mecánico)',
            //        '• Concurso interno (Eléctrico)',
            //        '',
             //       '📝 *Proceso de inscripción:*',
            //        '• Si cumples con los requisitos y estás interesado',
            //        '• Inscríbete al concurso de tu preferencia',
            //        '• Acércate a la oficina de Gestión Humana',
            //        '',
            //        '📅 *Fechas importantes:*',
            //        '• Inicio de inscripciones: 15 de abril',
            //        '• Cierre de inscripciones: 30 de abril',
             //       '• Evaluaciones: 5-10 de mayo',
             //       '• Publicación de resultados: 15 de mayo',
             //       '',
             //       'Selecciona:',
             //       '8️⃣ Volver al menú de concursos',
             //       '9️⃣ Ir al menú principal',
             //       '0️⃣ Salir'
                ].join('\n'));
                break;

            case '2':
                await flowDynamic([
                    '📝 *Requisitos generales*',
                    '',
                    '✅ *Requisitos básicos:*',
                    '• Tener mínimo un año en la empresa',
                    '• Cumplir con el perfil requerido para el cargo',

                    '',
            //        '📋 *Documentación requerida:*',
             //       '• Formato de inscripción completamente diligenciado',
            //        '• Hoja de vida actualizada',
            //        '• Certificados de formación académica',
             //       '• Certificados de experiencia laboral (si aplica)',
             //       '',
              //      '⚠️ *Importante:*',
             //       '• Toda la documentación debe entregarse en físico',
             //       '• No se aceptarán inscripciones fuera de las fechas establecidas',
             //       '• El proceso es confidencial y transparente',
             //       '',
             //       'Selecciona:',
            //        '8️⃣ Volver al menú de concursos',
              //      '9️⃣ Ir al menú principal',
              //      '0️⃣ Salir'
                ].join('\n'));
                break;

            case '8':
                return gotoFlow(concursosFlow);

            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic([
                    '👋 ¡Gracias por tu interés en nuestros concursos internos!',
                    'Si tienes más preguntas, no dudes en contactarnos.'
                ].join('\n'));
                return endFlow();

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣ Información de concursos vigentes',
                    '2️⃣ Requisitos generales',
                    '',
                    '9️⃣ Volver al menú principal',
                    '0️⃣ Salir'
                ].join('\n'));
                return gotoFlow(concursosFlow);
        }
    })
    .addAnswer(
        [
            'Selecciona una opción:',
            '',
            '8️⃣ Volver al menú de concursos',
            '9️⃣ Ir al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '8':
                    return gotoFlow(concursosFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar información sobre nuestros concursos!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(concursosFlow);
            }
        }
    );

export default concursosFlow;