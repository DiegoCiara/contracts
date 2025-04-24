const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  const data = req.body;
  const filename = `Contrato ${data.contratante.razaoSocial}: ${data.detalhes.nomeProjeto}.pdf`;
  const filePath = path.join('/tmp', filename); // /tmp é o único caminho gravável em serverless

  // Salva data.js temporariamente
  fs.writeFileSync('/tmp/data.js', `const data = ${JSON.stringify(data, null, 2)};\nmodule.exports = data;`);

  // Copia main.js para usar com data.js temporário
  fs.copyFileSync(path.join(process.cwd(), 'main.js'), '/tmp/main.js');

  // Executa main.js via Node dentro do /tmp
  exec(`node /tmp/main.js`, { cwd: '/tmp' }, (err) => {
    if (err) return res.status(500).send('Erro ao gerar contrato');

    fs.readFile(filePath, (err, file) => {
      if (err) return res.status(500).send('Erro ao ler o contrato');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(file);
    });
  });
}