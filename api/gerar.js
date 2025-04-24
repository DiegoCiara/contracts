
import fs from 'fs';
import path from 'path';
import generateContract from '../main'; // agora é importável
import { tmpdir } from 'os';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const data = req.body;
  const filename = `Contrato - ${data.contratante.razaoSocial}.pdf`;
  const filePath = path.join(tmpdir(), filename);

  try {
    await generateContract(data, filePath);

    // Aguarda o PDF terminar de ser escrito
    await new Promise(resolve => setTimeout(resolve, 1500));

    const file = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(file);
  } catch (err) {
    console.error('Erro ao gerar contrato:', err);
    res.status(500).send(`Erro ao gerar contrato: ${err.message}`);
  }
}