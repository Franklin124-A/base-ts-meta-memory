import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app'

type Provider = any;
type Database = any;

export const beneficiosFlow = addKeyword<Provider, Database>(['Cartalaboral', 'constancia', 'carta', 'bonos'])
    .addAnswer('📂 *Solicitud de carta laboral*')
    .addAnswer([
        '',
        '1️⃣➡️ *Ingresa al formulario (Carta laboral)*',
        '',
        '9️⃣🏠 *Volver al menú principal*',
        '0️⃣👋 *Salir del chat*',
        '',
        'Responde con el número de la opción que deseas'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
        const option = ctx.body.trim().toLowerCase();

        switch (option) {
            case '0':
                await flowDynamic([
                    '¡Esperamos que esta información haya sido útil! 😊',
                    'Hasta pronto. 👋'
                ].join('\n'));
                return;

            case '9':
                await flowDynamic('Regresando al menú principal... 🔄');
                return gotoFlow(menuFlow);

            case '1':
                await flowDynamic([
                    ' *¡Hola!* Para solicitar una carta laboral necesitamos los siguientes datos:',
                    ' ° Nombre completo',
                    ' ° Número de cédula',
                    ' Especificar si es con promedio o sin promedio',
                    '¡Gracias! En *tres días hábiles* te estaremos',
                    '',
                    '',
                    '📄https://forms.office.com/r/SP3zmLwELQ?origin=lprLink',
                    '',
                    '',
                    '¡Gracias! En un plazo de tres días hábiles te estaremos compartiendo tu solicitud.',
                    'reclamala en Gestión Humana o, si lo prefieres, te la enviaremos por correo electrónico.',
                    '',
                    '',
                    '📌 _¿Necesitas realizar otra consulta?_',
                ].join('\n'));
                break;

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción válida:',
                    '',
                    '1️⃣➡️ Ingresa al formulario',
                    '9️⃣🏠 Volver al menú principal',
                    '0️⃣👋 Salir del chat'
                ].join('\n'));
                break;
        }
    })
    .addAnswer([
        'Selecciona una opción:',
        '',
        '9️⃣🏠  Volver al menú principal',
        '0️⃣👋  Salir'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
        const option = ctx.body.trim().toLowerCase();

        if (option === '0') {
            await flowDynamic('¡Gracias por usar nuestro servicio! 👋');
            return;
        }

        if (option === '9') {
            return gotoFlow(menuFlow);
        }

        await flowDynamic('❌ Opción no válida. Por favor, selecciona 9 para volver al menú o 0 para salir.');
    });

export default beneficiosFlow;