const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

function serveStaticFile(res, filepath, contentType, statusCode = 200) {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.writeHead(500);
      console.error(`Erro ao ler o arquivo ${filepath}:`, err);
      res.end('Erro interno');
    } else {
      res.writeHead(statusCode, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    serveStaticFile(res, './public/index.html', 'text/html');
  } else if (req.method === 'POST' && req.url === '/gerar') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const dados = JSON.parse(body);
      const conteudo = `const data = ${JSON.stringify(dados, null, 2)};\nmodule.exports = data;`;
      fs.writeFileSync('./data.js', conteudo);

      exec('node main.js', (err) => {
        if (err) {
          res.writeHead(500);
          return res.end(`Erro ao gerar contrato ${JSON.stringify(err)}`);
        }

        const filename = `Contrato ${dados.contratante.razaoSocial}: ${dados.detalhes.nomeProjeto}.pdf`;
        const filePath = path.join(__dirname, 'contracts', filename);

        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);

        stream.on('close', () => {
          fs.unlink(filePath, () => {});
        });
      });
    });
  } else {
    res.writeHead(404);
    res.end('Não encontrado');
  }
});

server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));