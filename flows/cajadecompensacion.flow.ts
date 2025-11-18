import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app';

type Provider = any;
type Database = any;

export const afiliacionesFlow = addKeyword(['afiliaciones', 'requisitos', 'documentos'])
    .addAnswer('📝 *INFORMACIÓN DE AFILIACIONES*')
    .addAnswer([
        '*REQUISITOS PARA AFILIACIONES*:',
        '',
        '1️⃣ Requisitos para hijos',
        '2️⃣ Requisitos para cónyuge',
        '3️⃣ Requisitos para padres',
        '4️⃣ Requisitos para hijastros',
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
            case '1': // Requisitos para hijos
                await flowDynamic([
                    '👶 *Requisitos para hijos*',
                    '',
                    '• Fotocopia legible del documento de identidad de la persona a cargo. Deberá corresponder al documento vigente según su edad.',
                    '• Registro civil de nacimiento donde conste nombre de la madre, padre o ambos progenitores para demostrar parentesco.',
                    '• Certificado de escolaridad para los beneficiarios desde los 12 años. Emitido por la institución educativa aprobada por el Ministerio de Educación Nacional.',
                    '• En caso de que el hijo sea una persona con discapacidad, deberá adjuntar certificación expedida por el Ministerio de Salud y Protección Social.',
                    '',
                    '⚠️ *Importante:* Documentos vigentes y originales.',
                    '⚠️ *Importante:* Todos los documentos deben ser presentados en la oficina de Gestión Humana..',
                    '',
                    'Selecciona:',
               //      '8️⃣ Volver al menú de afiliaciones',
               //      '9️⃣ Ir al menú principal',
               //      '0️⃣ Salir'
                ].join('\n'));
                break;

            case '2': // Requisitos para esposa
                await flowDynamic([
                    '👩 *Requisitos para esposa*',
                    '',
                    '• Fotocopia legible del documento de identidad del trabajador.',
                    '• Fotocopia legible del documento de identidad del cónyuge o compañero(a) permanente.',
                    '• En caso de que el cónyuge o compañero(a) permanente sea pensionado, anexar certificado de la mesada pensional.',
                    '',
                    '⚠️ *Importante:* Documentos vigentes y originales.',
                    '⚠️ *Importante:* Todos los documentos deben ser presentados en la oficina de Gestión Humana..',
                    '',
                    'Selecciona:',
            //         '8️⃣ Volver al menú de afiliaciones',
            //         '9️⃣ Ir al menú principal',
            //         '0️⃣ Salir'
                ].join('\n'));
                break;

            case '3': // Requisitos para padres
                await flowDynamic([
                    '👨‍👩‍👧 *Requisitos para padres*',
                    '',
                    '• Fotocopia legible del documento de identidad del trabajador.',
                    '• Registro civil de nacimiento del trabajador, donde conste el nombre del padre y la madre, para demostrar parentesco.',
                    '• Fotocopia legible del documento de identidad del padre o madre.',
                    '• Certificado de EPS donde conste el tipo de afiliación como beneficiario del trabajador.',
                    '• Si el padre o la madre se encuentra afiliado al Régimen Subsidiado en Salud, puede ser beneficiario del trabajador y recibir cuota monetaria.',
                    '',
                    '⚠️ *Importante:* Documentos vigentes y originales.',
                    '⚠️ *Importante:* Todos los documentos deben ser presentados en la oficina de Gestión Humana..',
                    '',
                    'Selecciona:',
            //         '8️⃣ Volver al menú de afiliaciones',
            //         '9️⃣ Ir al menú principal',
            //         '0️⃣ Salir'
                ].join('\n'));
                break;

            case '4': // Requisitos para hijastros
                await flowDynamic([
                    '👶 *Requisitos para hijastros*',
                    '',
                    '• Fotocopia legible del documento de identidad del trabajador.',
                    '• Fotocopia legible del documento de identidad de la persona a cargo. Deberá corresponder al documento vigente según su edad.',
                    '• Registro civil de nacimiento donde conste nombre de la madre, padre o ambos progenitores para demostrar parentesco.',
                    '• Certificado de escolaridad para los beneficiarios desde los 12 años. Emitido por la institución educativa aprobada por el Ministerio de Educación Nacional.',
                    '• En caso de que el padre biológico haya fallecido, anexar registro civil de defunción.',
                    '• Certificado de la Entidad Promotora de Salud (EPS) que acredite el grupo familiar unificado.',
                    '',
                    '⚠️ *Importante:* Documentos vigentes y originales.',
                    '⚠️ *Importante:* Todos los documentos deben ser presentados en la oficina de Gestión Humana..',
                    '',
                    'Selecciona:',
            //         '8️⃣ Volver al menú de afiliaciones',
            //         '9️⃣ Ir al menú principal',
            //         '0️⃣ Salir'
                ].join('\n'));
                break;

            case '8': // Volver al menú de afiliaciones
                return gotoFlow(afiliacionesFlow);

            case '9': // Volver al menú principal
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0': // Salir
                await flowDynamic('👋 ¡Gracias por consultar información sobre afiliaciones!');
                return endFlow();

            default: // Opción no válida
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣ Requisitos para hijos',
                    '2️⃣ Requisitos para esposa',
                    '3️⃣ Requisitos para padres',
                    '4️⃣ Requisitos para hijastros',
                    '',
                    '9️⃣ Volver al menú principal',
                    '0️⃣ Salir'
                ].join('\n'));
                return gotoFlow(afiliacionesFlow);
        }
    })
    .addAnswer(
        [
            'Selecciona una opción:',
            '',
            '8️⃣ Volver al menú de afiliaciones',
            '9️⃣ Ir al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '8':
                    return gotoFlow(afiliacionesFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar información sobre afiliaciones!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(afiliacionesFlow);
            }
        }
    );

export default afiliacionesFlow;