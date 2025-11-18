import { addKeyword } from '@builderbot/bot';
import { menuFlow } from 'src/app';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), 'assets', 'Bases.json');

interface Usuario {
  numero_de_documento: string | number;
  apellido_y_nombres: string;
  eps: string;
  afp: string;
  caja_compensacion: string;
  fondo_cesantias: string;
  ciudad_donde_labora: string;
}

const buscarUsuario = (documento: string): Usuario | null => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error(`❌ Archivo no encontrado: ${DB_PATH}`);
      return null;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const usuarios: Usuario[] = JSON.parse(data);
    return usuarios.find(user => 
      Number(user.numero_de_documento) === Number(documento)
    ) || null;
  } catch (error) {
    console.error('❌ Error buscando usuario:', error);
    return null;
  }
};

export const seguridadSocialFlow = addKeyword(['seguridad'])
  // Paso 1: Menú principal
  .addAnswer('🏦 *CONSULTA DE SEGURIDAD SOCIAL*')
  .addAnswer([
    'Elige una opción:',
    '',
    '1️⃣ Información de mi Seguridad Social',
    '9️⃣ Menú principal',
    '0️⃣ Salir'
  ].join('\n'), { capture: true }, async (ctx, tools) => {
    const { gotoFlow, endFlow, flowDynamic } = tools; // Extraer métodos del segundo argumento
    const option = ctx.body.trim();
    switch (option) {
      case '1': return; // Continuar al siguiente paso
      case '9': return gotoFlow(menuFlow);
      case '0': return endFlow();
      default:
        await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción del menú.');
        return gotoFlow(seguridadSocialFlow);
    }
  })

  // Paso 2: Capturar documento
  .addAnswer('📝 Ingresa tu número de documento:', { capture: true }, async (ctx, tools) => {
    const { flowDynamic } = tools; // Extraer flowDynamic
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
    } else {
      await flowDynamic([
        '❌ *DOCUMENTO NO ENCONTRADO*',
        'Verifica:',
        '📞 Contacta a Gestion Humana: Ext. 1822'
      ].join('\n'));
    }
  })

  // Paso 3: Opciones posteriores
  .addAnswer([
    'Selecciona:',
    '9️⃣ Menú principal',
    '0️⃣ Salir'
  ].join('\n'), { capture: true }, async (ctx, tools) => {
    const { gotoFlow, endFlow, flowDynamic } = tools; // Extraer métodos del segundo argumento
    const option = ctx.body.trim();
    switch (option) {
      case '9': return gotoFlow(menuFlow);
      case '0': return endFlow();
      default:
        await flowDynamic('❌ Opción no válida. Por favor, selecciona una opción del menú.');
        return gotoFlow(seguridadSocialFlow);
    }
  });

export default seguridadSocialFlow;