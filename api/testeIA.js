// api/testeIA.js
import 'dotenv/config';
import { corrigirComIA } from './corrigirIA.js';

async function teste() {
  const resultado = await corrigirComIA(
    'I go to school yesterday and I seen my friends there.',
    'A2'
  );
  console.log('Resultado:', JSON.stringify(resultado, null, 2));
}

teste();