import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app'

type Provider = any;
type Database = any;

export const auxiliosFlow = addKeyword(['Auxilio', 'transporte', 'funeral'])
    .addAnswer('📋 *INFORMACIÓN SOBRE AUXILIOS*')
    .addAnswer([
        'Selecciona una opción:',
        '',
        '1️⃣ Auxilio funerario',
        '2️⃣ Auxilio educativo',
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
                    '⚰️ *Auxilio Funerario*',
                    '',
                    '📝 *Descripción:*',
                    ' Por fallecimiento de cónyuge, compañero(a), padre,',
                    ' madre o hijo registrado, la empresa otorgará un auxilio de $726.669.',
                    '',
                    '📋 *Documentos requeridos:*',
                    '• Certificado de defunción',
                    '',
                    '',
                    '📞 *Contacto:*',
                    '• Departamento de Gestion Humana',
                    '• Tel: 602-2095000',
                    '• Extensión: 1822',
                    '',
                    'Selecciona:',
            //         '8️⃣ Volver al menú de auxilios',
            //         '9️⃣ Ir al menú principal',
            //         '0️⃣ Salir'
                ].join('\n'));
                break;

            case '2':
                await flowDynamic([
                    '📚 *Auxilio Educativo*',
                    '',
                    '📝 *Descripción:*',
                    ' En marzo, la empresa entregará un auxilio de',
                    ' $51.344.644 destinado a matrículas estudiantiles de hijos o trabajadores.',
                    ' Este fondo se distribuirá según las postulaciones con certificados de estudio.',
                    '',
                    '📋 *Requisitos:*',
                    '• Llevar a la oficina de gestión humana los certificados estudiantiles',
                    '',
                    'Selecciona:',
            //         '8️⃣ Volver al menú de auxilios',
            //         '9️⃣ Ir al menú principal',
            //         '0️⃣ Salir'
                ].join('\n'));
                break;

            case '8':
                return gotoFlow(auxiliosFlow);

            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic('👋 ¡Gracias por tu consulta sobre auxilios! Hasta pronto.');
                return endFlow();

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣ Auxilio funerario',
                    '2️⃣ Auxilio educativo',
                    '',
                    '9️⃣ Volver al menú principal',
                    '0️⃣ Salir'
                ].join('\n'));
                return gotoFlow(auxiliosFlow);
        }
    })
    .addAnswer(
        [
            'Selecciona una opción:',
            '',
            '8️⃣ Volver al menú de auxilios',
            '9️⃣ Ir al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '8':
                    return gotoFlow(auxiliosFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar información sobre nuestros auxilios!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(auxiliosFlow);
            }
        }
    );

export default auxiliosFlow;