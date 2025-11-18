import { addKeyword } from '@builderbot/bot';
import { menuFlow } from '../src/app';

type Provider = any;
type Database = any;

// Subflujo para el Día de la Familia
const diaFamiliaSubFlow = addKeyword(['evento_familia']) // Trigger interno
    .addAnswer('👨‍👩‍👧‍👦 *DÍA DE LA FAMILIA*')
    .addAnswer([
        '*No tenemos eventos disponibles para el Día de la Familia en este momento.*',
        '',
        '8️⃣ Volver al menú de eventos',
        '9️⃣ Ir al menú principal',
        '0️⃣ Salir'
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
        const option = ctx.body.trim();
        switch (option) {
            case '8':
                return gotoFlow(eventosFlow);
            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);
            case '0':
                await flowDynamic('👋 ¡Gracias por tu interés!');
                return endFlow();
            default:
                await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                return gotoFlow(diaFamiliaSubFlow);
        }
    });

// Subflujo para la Fiesta de la Empresa
const fiestaEmpresaSubFlow = addKeyword(['evento_empresa']) // Trigger interno
    .addAnswer('🎄 *FIESTA DE LA EMPRESA*')
    .addAnswer([
        '*No tenemos eventos programados .*',
        '',
        '8️⃣ Volver al menú de eventos',
        '9️⃣ Ir al menú principal',
        '0️⃣ Salir'
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
        const option = ctx.body.trim();
        switch (option) {
            case '8':
                return gotoFlow(eventosFlow);
            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);
            case '0':
                await flowDynamic('👋 ¡Gracias por tu consulta!');
                return endFlow();
            default:
                await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                return gotoFlow(fiestaEmpresaSubFlow);
        }
    });

// Subflujo para la Fiesta de Disfraces
const fiestaDisfracesSubFlow = addKeyword(['evento_disfraces']) // Trigger interno
    .addAnswer('🎭 *FIESTA DE DISFRACES*')
    .addAnswer([
        '*Por el momento no hay información disponible sobre la Fiesta de Disfraces.*',
        '',
        '8️⃣ Volver al menú de eventos',
        '9️⃣ Ir al menú principal',
        '0️⃣ Salir'
    ].join('\n'),
    { capture: true },
    async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
        const option = ctx.body.trim();
        switch (option) {
            case '8':
                return gotoFlow(eventosFlow);
            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);
            case '0':
                await flowDynamic('👋 ¡Gracias por tu interés en la Fiesta de Disfraces!');
                return endFlow();
            default:
                await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                return gotoFlow(fiestaDisfracesSubFlow);
        }
    });

export const eventosFlow = addKeyword(['eventos', 'celebraciones', 'fiestas'])
    .addAnswer('🎉 *EVENTOS Y CELEBRACIONES*')
    .addAnswer(
        [
            'Selecciona el evento que deseas consultar:',
            '',
            '1️⃣ Día de la Familia',
            '2️⃣ Fiesta de la Empresa',
            '3️⃣ Fiesta de Disfraces',
            '',
            '9️⃣ Volver al menú principal',
            '0️⃣ Salir'
        ].join('\n'),
        { capture: true },
        async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
            const option = ctx.body.trim();

            switch (option) {
                case '1':
                    return gotoFlow(diaFamiliaSubFlow);
                case '2':
                    return gotoFlow(fiestaEmpresaSubFlow);
                case '3':
                    return gotoFlow(fiestaDisfracesSubFlow);
                case '9':
                    await flowDynamic('↩️ Regresando al menú principal...');
                    return gotoFlow(menuFlow);
                case '0':
                    await flowDynamic('👋 ¡Gracias por consultar nuestros eventos!');
                    return endFlow();
                default:
                    await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción válida.');
                    return gotoFlow(eventosFlow);
            }
        }
    );

export default eventosFlow;