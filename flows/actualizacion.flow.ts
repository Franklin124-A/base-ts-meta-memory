import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app'

export const actualizacionFlow = addKeyword(['datos'])
    .addAnswer('✏️ *MENU ALTERNO*')
    .addAnswer([
        ':',
        '',
        '1️⃣🍽️ Ingresa al Formulario del casino',
        '',
        '9️⃣🏠 Volver al menú principal',
        '0️⃣👋 Salir'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
        const option = ctx.body.trim();

        switch (option) {
            case '1':
                await flowDynamic([
                    '📝 *Menu alterno  *',
                    '',
                    '• Puedes programar el menú alterno de cada semana en el siguiente enlace::',
                    '🔗 https://forms.office.com/pages/responsepage.aspx?id=JoIBnapZZkW9EgMWxEhslCO7BLAfORFOg-pSYvdZKTZURDRSUUc1WjMyVDhNSFJTMEc2NzRaRjlaUi4u&origin=QRCode&qrcodeorigin=presentation&route=shorturl',
                    '',
                    '📌 Información importante:',
                    ' Completa todos los campos obligatorios',
                    '',
                    '',
                    '',
                    '',
                    '',
            //         '9️⃣🏠 Volver al menú principal',
            //         '0️⃣👋 Salir'
                ].join('\n'));
                break;

            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic('👋 ¡Gracias por usar nuestro servicio de actualización!');
                return;

            default:
                await flowDynamic([
                    '❌ Opción no válida',
                    'Por favor, selecciona una opción correcta:',
                    '',
                    '1️⃣🍽️ Ingresa al Formulario del casino',
                    '',
                    '9️⃣🏠 Volver al menú principal',
                    '0️⃣👋 Salir'
                ].join('\n'));
                return gotoFlow(actualizacionFlow);
        }
    })
    .addAnswer([
        'Selecciona una opción:',
        '',
        '9️⃣🏠 Volver al menú principal',
        '0️⃣👋 Salir'
    ].join('\n'),
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
        const option = ctx.body.trim();

        switch (option) {
            case '9':
                await flowDynamic('↩️ Regresando al menú principal...');
                return gotoFlow(menuFlow);

            case '0':
                await flowDynamic('👋 ¡Gracias por usar nuestro servicio!');
                return;

            default:
                await flowDynamic('❌ Opción no válida. Por favor, selecciona 9 para volver al menú o 0 para salir.');
                return gotoFlow(actualizacionFlow);
        }
    });

export default actualizacionFlow;