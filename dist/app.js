import * as dotenv from 'dotenv';
import { addKeyword, utils, createFlow, createProvider, MemoryDB, createBot } from '@builderbot/bot';
import { MetaProvider } from '@builderbot/provider-meta';
import * as fs from 'fs';
import * as path from 'path';

const RUTAS$1 = {
    CESANTIAS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Retiro_Cesantias.jpg'),
    CAJA_COMPENSACION: path.join(process.cwd(), 'assets', 'imagenesruta', 'Retiro_Cesantias.jpg')
};
const MENSAJES$1 = {
    CESANTIAS: '📄 *Documentos necesarios para retirar cesantías*\n\nAquí encontrarás los requisitos para el retiro de tus cesantías.',
};
const solicitudesFlow = addKeyword(['cesantias', 'caja', 'compensacion'])
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
].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
    const option = ctx.body.trim();
    switch (option) {
        case '1':
            try {
                await flowDynamic([{
                        body: [
                            MENSAJES$1.CESANTIAS,
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
                        media: RUTAS$1.CESANTIAS
                    }]);
            }
            catch (error) {
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
    .addAnswer([
    'Selecciona una opción:',
    '',
    '8️⃣ Volver al menú de cesantías',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
});

const beneficiosFlow = addKeyword(['Cartalaboral', 'constancia', 'carta', 'bonos'])
    .addAnswer('📂 *Solicitud de carta laboral*')
    .addAnswer([
    '',
    '1️⃣➡️ *Ingresa al formulario (Carta laboral)*',
    '',
    '9️⃣🏠 *Volver al menú principal*',
    '0️⃣👋 *Salir del chat*',
    '',
    'Responde con el número de la opción que deseas'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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

const concursosFlow = addKeyword(['concursos', 'concurso', 'oportunidades', 'procesos'])
    .addAnswer('🏆 *CONCURSOS Y OPORTUNIDADES INTERNAS*')
    .addAnswer([
    'Selecciona una opción:',
    '',
    '1️⃣ Información de concursos vigentes',
    '',
    '9️⃣ Volver al menú principal',
    '0️⃣ Salir',
    '',
    'Responde con el número de la opción que te interesa'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const option = ctx.body.trim();
    switch (option) {
        case '1':
            await flowDynamic([
                '📌 *Información de concursos vigentes*',
                '',
                'Actualmente *NO* tenemos concursos abiertos',
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
    .addAnswer([
    'Selecciona una opción:',
    '',
    '8️⃣ Volver al menú de concursos',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
});

const auxiliosFlow = addKeyword(['Auxilio', 'transporte', 'funeral'])
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
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
    .addAnswer([
    'Selecciona una opción:',
    '',
    '8️⃣ Volver al menú de auxilios',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
});

const RUTAS = {
    PEREIRA_TURNOS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Pereira_Turnos.jpg'),
    PEREIRA_CENTRO: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Centro.jpg'),
    CARTAGO_TURNOS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Ruta_CartagoP.jpg'),
    CARTAGO: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Cartago.jpg'),
    SUR: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_Sur.jpg'),
    DOSQUEBRADAS: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_D-bradas.jpg'),
    INGENIERIA: path.join(process.cwd(), 'assets', 'imagenesruta', 'Rutas_Panasa_I&P.jpg')
};
const MENSAJES = {
    PEREIRA_TURNOS: '🚌 *Ruta Pereira - Turnos 1, 2 y 3*\n\n',
    PEREIRA_CENTRO: '🚌 *Ruta Pereira Centro - Turno 4*\n\n',
    CARTAGO_TURNOS: '🚌 *Ruta Cartago - Turnos 1, 2 y 3*\n\n',
    CARTAGO_4: '🚌 *Ruta Cartago - Turno 4*\n\n',
    SUR: '🚌 *Ruta Avenida Sur - Pereira*\n\n',
    DOSQUEBRADAS: '🚌 *Ruta Dosquebradas*\n\n',
    INGENIERIA: '🚌 *Ruta Ingeniería & Proyectos*\n\n'
};
const rutasFlow = addKeyword(['rutas de transporte', 'información de rutas', 'transporte rutas'])
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
    const enviarRuta = async (mensaje, rutaImagen) => {
        try {
            await flowDynamic([{ body: mensaje, media: rutaImagen }]);
            await flowDynamic('🚏 ¿Deseas consultar otra ruta?\n\nVuelve al menú principal para más opciones.');
            return gotoFlow(rutasFlow);
        }
        catch (error) {
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

const comprasFlow = addKeyword(['Cartalaboral', 'constancia', 'carta', 'bonos'])
    .addAnswer('📂 *MENÚ DE COMPRAS DE PRODUCTOS*')
    .addAnswer([
    '',
    '1️⃣➡️ *Ingresa al formulario*',
    '',
    '9️⃣🏠 *Volver al menú principal*',
    '0️⃣👋 *Salir del chat*',
    '',
    'Responde con el número de la opción que deseas'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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
                '• *¡Hola!* Para solicitar la compra de un producto, por favor ingresa al siguiente enlace.',
                ' ',
                ' ',
                '',
                '📄 https://forms.office.com/r/S7ZDn1MfPf',
                '',
                '📌 ¿Necesitas hacer otra consulta?',
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
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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

const actualizacionFlow = addKeyword(['datos'])
    .addAnswer('✏️ *MENU ALTERNO*')
    .addAnswer([
    ':',
    '',
    '1️⃣🍽️ Ingresa al Formulario del casino',
    '',
    '9️⃣🏠 Volver al menú principal',
    '0️⃣👋 Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
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

const bienestarFlow = addKeyword(['bienestar', 'salud', 'accidente', 'incapacidad'])
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
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
                '',
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
    .addAnswer([
    'Selecciona una opción:',
    '',
    '8️⃣ Volver al menú de bienestar',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
});

const afiliacionesFlow = addKeyword(['afiliaciones', 'requisitos', 'documentos'])
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
].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
    const option = ctx.body.trim();
    switch (option) {
        case '1':
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
            ].join('\n'));
            break;
        case '2':
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
            ].join('\n'));
            break;
        case '3':
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
            ].join('\n'));
            break;
        case '4':
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
            ].join('\n'));
            break;
        case '8':
            return gotoFlow(afiliacionesFlow);
        case '9':
            await flowDynamic('↩️ Regresando al menú principal...');
            return gotoFlow(menuFlow);
        case '0':
            await flowDynamic('👋 ¡Gracias por consultar información sobre afiliaciones!');
            return endFlow();
        default:
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
    .addAnswer([
    'Selecciona una opción:',
    '',
    '8️⃣ Volver al menú de afiliaciones',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
});

const vacantesFlow = addKeyword(['vacantes', 'empleos', 'oportunidades', 'trabajos'])
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
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const option = ctx.body.trim();
    switch (option) {
        case '1':
            await flowDynamic([
                '🔍 *No tenemos vacantes Actuales*',
                '',
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
    .addAnswer([
    'Selecciona una opción:',
    '',
    '8️⃣ Volver al menú de vacantes',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
});

const diaFamiliaSubFlow = addKeyword(['evento_familia'])
    .addAnswer('👨‍👩‍👧‍👦 *DÍA DE LA FAMILIA*')
    .addAnswer([
    '*No tenemos eventos disponibles para el Día de la Familia en este momento.*',
    '',
    '8️⃣ Volver al menú de eventos',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
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
const fiestaEmpresaSubFlow = addKeyword(['evento_empresa'])
    .addAnswer('🎄 *FIESTA DE LA EMPRESA*')
    .addAnswer([
    '*No tenemos eventos programados .*',
    '',
    '8️⃣ Volver al menú de eventos',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
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
const fiestaDisfracesSubFlow = addKeyword(['evento_disfraces'])
    .addAnswer('🎭 *FIESTA DE DISFRACES*')
    .addAnswer([
    '*Por el momento no hay información disponible sobre la Fiesta de Disfraces.*',
    '',
    '8️⃣ Volver al menú de eventos',
    '9️⃣ Ir al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
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
const eventosFlow = addKeyword(['eventos', 'celebraciones', 'fiestas'])
    .addAnswer('🎉 *EVENTOS Y CELEBRACIONES*')
    .addAnswer([
    'Selecciona el evento que deseas consultar:',
    '',
    '1️⃣ Día de la Familia',
    '2️⃣ Fiesta de la Empresa',
    '3️⃣ Fiesta de Disfraces',
    '',
    '9️⃣ Volver al menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, { gotoFlow, endFlow, flowDynamic }) => {
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
});

const DB_PATH = path.join(process.cwd(), 'assets', 'Bases.json');
const buscarUsuario = (documento) => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            console.error(`❌ Archivo no encontrado: ${DB_PATH}`);
            return null;
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const usuarios = JSON.parse(data);
        return usuarios.find(user => Number(user.numero_de_documento) === Number(documento)) || null;
    }
    catch (error) {
        console.error('❌ Error buscando usuario:', error);
        return null;
    }
};
const seguridadSocialFlow = addKeyword(['seguridad'])
    .addAnswer('🏦 *CONSULTA DE SEGURIDAD SOCIAL*')
    .addAnswer([
    'Elige una opción:',
    '',
    '1️⃣ Información de mi Seguridad Social',
    '9️⃣ Menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, tools) => {
    const { gotoFlow, endFlow, flowDynamic } = tools;
    const option = ctx.body.trim();
    switch (option) {
        case '1': return;
        case '9': return gotoFlow(menuFlow);
        case '0': return endFlow();
        default:
            await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción del menú.');
            return gotoFlow(seguridadSocialFlow);
    }
})
    .addAnswer('📝 Ingresa tu número de documento:', { capture: true }, async (ctx, tools) => {
    const { flowDynamic } = tools;
    const doc = ctx.body.trim();
    const usuario = buscarUsuario(doc);
    if (usuario) {
        await flowDynamic([
            '✅ *INFORMACIÓN ENCONTRADA*',
            `👤 Nombre: ${usuario.apellido_y_nombres}`,
            `🆔 Documento: ${usuario.numero_de_documento}`,
            `🏥  ${usuario.eps}`,
            `💰 AFP: ${usuario.afp}`,
            `🏦 Caja: ${usuario.caja_compensacion}`,
            `💼 Cesantías: ${usuario.fondo_cesantias}`,
            `📍 ARL: ${usuario.ciudad_donde_labora}`
        ].join('\n'));
    }
    else {
        await flowDynamic([
            '❌ *DOCUMENTO NO ENCONTRADO*',
            'Verifica:',
            '📞 Contacta a Gestion Humana: Ext. 1822'
        ].join('\n'));
    }
})
    .addAnswer([
    'Selecciona:',
    '9️⃣ Menú principal',
    '0️⃣ Salir'
].join('\n'), { capture: true }, async (ctx, tools) => {
    const { gotoFlow, endFlow, flowDynamic } = tools;
    const option = ctx.body.trim();
    switch (option) {
        case '9': return gotoFlow(menuFlow);
        case '0': return endFlow();
        default:
            await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción del menú.');
            return gotoFlow(seguridadSocialFlow);
    }
});

dotenv.config();
const PORT = process.env.PORT || 3000;
function verificarCedula(cedula) {
    try {
        const rutaJson = path.resolve(process.cwd(), 'assets', 'base_datos.json');
        console.log('Intentando leer archivo JSON en:', rutaJson);
        if (!fs.existsSync(rutaJson)) {
            console.error('El archivo JSON no existe en:', rutaJson);
            return { encontrado: false, nombre: null };
        }
        const datosRaw = fs.readFileSync(rutaJson, 'utf8');
        const datos = JSON.parse(datosRaw);
        const usuario = datos.find((row) => String(row.cedula) === String(cedula));
        if (usuario) {
            return {
                encontrado: true,
                nombre: usuario.nombre,
            };
        }
        else {
            return { encontrado: false, nombre: null };
        }
    }
    catch (error) {
        console.error('Error al verificar cédula:', error);
        return { encontrado: false, nombre: null };
    }
}
const menuFlow = addKeyword(utils.setEvent('MENU'))
    .addAnswer([
    '🔍 *Menú Principal - Recursos Humanos*',
    '',
    '¿En qué puedemos ayudarte?',
    '',
    '1️⃣ 🏦 *Informacion de mi Seguridad Social*',
    '2️⃣ 💰 *Cesantias*',
    '3️⃣ 📄 *Carta Laboral*',
    '4️⃣ 🏆 *Concursos Internos*',
    '5️⃣ 🔍 *Caja de Compensacion*',
    '6️⃣ 📚 *Auxilios y Beneficios*',
    '7️⃣ 🚌 *Información de Rutas*',
    '8️⃣ 🛒 *Compra de Productos*',
    '9️⃣ 🍽️ *Menu alternativo del casino*',
    '🔟 🧘 *Seguridad y Salud en el trabajo*',
    '0️⃣ *Salir*',
    '',
    '*Responde con el número de la opción que necesitas*',
    '',
    'ℹ️ Puedes salir del menu escribiendo *"Salir"*',
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const option = ctx.body.trim().toLowerCase();
    if (option === '0' || option.includes('salir')) {
        await flowDynamic('Gracias por contactar con Recursos Humanos. ¡Hasta pronto! 👋');
        return endFlow();
    }
    switch (option) {
        case '1':
            return gotoFlow(seguridadSocialFlow);
        case '2':
            return gotoFlow(solicitudesFlow);
        case '3':
            return gotoFlow(beneficiosFlow);
        case '4':
            return gotoFlow(concursosFlow);
        case '5':
            return gotoFlow(afiliacionesFlow);
        case '6':
            return gotoFlow(auxiliosFlow);
        case '7':
            return gotoFlow(rutasFlow);
        case '8':
            return gotoFlow(comprasFlow);
        case '9':
            return gotoFlow(actualizacionFlow);
        case '10':
            return gotoFlow(bienestarFlow);
        case '11':
            return gotoFlow(vacantesFlow);
        case '12':
            return gotoFlow(eventosFlow);
        default:
            await flowDynamic([
                '⚠️ No he entendido tu respuesta.',
                '',
                'Por favor selecciona una opción válida (1-10) o escribe "salir" para terminar la conversación.',
            ].join('\n'));
            return gotoFlow(menuFlow);
    }
});
const volverMenuFlow = addKeyword(['menu', 'volver', 'inicio', 'principal', 'regresar'])
    .addAction(async (_, { gotoFlow }) => gotoFlow(menuFlow));
const helpFlow = addKeyword(['ayuda', 'help', 'opciones', 'comandos'])
    .addAnswer('🆘 *Centro de Ayuda*')
    .addAnswer([
    'Estos son los comandos disponibles:',
    '',
    '• Escribe *menu* para ver el menú principal',
    '• Escribe *politicas* para consultar políticas de RRHH',
    '• Escribe *vacaciones* para solicitar tiempo libre',
    '• Escribe *beneficios* para ver compensaciones',
    '• Escribe *reclutamiento* para procesos de selección',
    '• Escribe *agente* para hablar con un humano',
    '• Escribe *auxilio* para ver el menu',
    '¿En qué más puedo ayudarte?',
].join('\n'));
const welcomeFlow = addKeyword([
    'hola', 'buenos dias', 'buenas', 'hi', 'hello', 'inicio', 'holi', 'buenas tardes', 'buenas noches',
])
    .addAnswer('👋 *¡Bienvenido a GrandBay Papeles Nacionales S.A.S.!*\nSoy tu Asistente Virtual de Recursos Humanos.')
    .addAnswer([
    'Para acceder a nuestros servicios, *necesito verificar tu identidad.*',
    '',
    'Por favor, *ingresa tu número de cédula*:',
].join('\n'), { capture: true }, async (ctx, { flowDynamic, gotoFlow, state }) => {
    const cedula = ctx.body.trim();
    const resultado = verificarCedula(cedula);
    if (resultado.encontrado) {
        await state.update({ cedula, nombre: resultado.nombre });
        await flowDynamic([
            '✅ *Identidad verificada correctamente*',
            '',
            `¡Hola ${resultado.nombre}! Tu cédula ${cedula} ha sido validada.`,
            '',
            'Accediendo al menú principal...',
        ].join('\n'));
        return gotoFlow(menuFlow);
    }
    else {
        await flowDynamic([
            '❌ *Cédula no reconocida*',
            '',
            'Lo siento, la cédula ingresada no se encuentra en nuestro sistema.',
            '',
            'Por favor, verifica el número e intenta nuevamente o contacta a soporte técnico.',
        ].join('\n'));
        return gotoFlow(welcomeFlow);
    }
});
const main = async () => {
    const adapterFlow = createFlow([
        seguridadSocialFlow,
        welcomeFlow,
        menuFlow,
        solicitudesFlow,
        beneficiosFlow,
        concursosFlow,
        afiliacionesFlow,
        helpFlow,
        volverMenuFlow,
        auxiliosFlow,
        rutasFlow,
        comprasFlow,
        actualizacionFlow,
        bienestarFlow,
        vacantesFlow,
        eventosFlow,
    ]);
    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: process.env.META_ACCESS_TOKEN,
        numberId: process.env.META_PHONE_NUMBER_ID,
        verifyToken: process.env.VERIFY_TOKEN,
        version: 'v22.0',
        appSecret: process.env.META_APP_SECRET,
    });
    const adapterDB = new MemoryDB();
    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    adapterProvider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message, urlMedia } = req.body;
        await bot.sendMessage(number, message, { media: urlMedia ?? null });
        return res.end('sended');
    }));
    adapterProvider.server.post('/v1/menu', handleCtx(async (bot, req, res) => {
        const { number } = req.body;
        await bot.dispatch('MENU', { from: number, name: 'Usuario' });
        return res.end('trigger');
    }));
    adapterProvider.server.post('/v1/blacklist', handleCtx(async (bot, req, res) => {
        const { number, intent } = req.body;
        if (intent === 'remove')
            bot.blacklist.remove(number);
        if (intent === 'add')
            bot.blacklist.add(number);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok', number, intent }));
    }));
    httpServer(Number(PORT));
    console.log(`🛜 Server running on port ${PORT}`);
};
main();

export { menuFlow, volverMenuFlow };
