const fs = require('fs');
const PDFDocument = require('pdfkit');
const data = require('./data'); // Importando os dados do contrato de um arquivo JSON


// Função para gerar o contrato
function generateContract(data, filename) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Configurações de fonte e formatação
  doc.registerFont('bold', './OpenSans-Bold.ttf');
  doc.registerFont('medium', './OpenSans-Medium.ttf');
  doc.fontSize(12);
  doc.lineGap(8);

  // Pipe para salvar o arquivo
  doc.pipe(fs.createWriteStream(`./contracts/${filename}`));

  // Cabeçalho
  doc.fontSize(14).font('bold').text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE', {
    align: 'center',
    underline: true
  }).moveDown(2);

  doc.fontSize(12).font('medium').text(`Pelo presente instrumento particular, de um lado:`).moveDown();

  doc.font('bold').text(`CONTRATANTE:`);
  doc.font('medium').text(`${data.contratante.razaoSocial}, inscrita no CNPJ sob o nº ${data.contratante.cnpj}, com sede na ${data.contratante.endereco}, neste ato representada por ${data.contratante.representante}, CPF ${data.contratante.cpf}, doravante denominada CONTRATANTE.`).moveDown();

  doc.text(`E de outro lado:`).moveDown();

  doc.font('bold').text(`CONTRATADO:`);

  doc.font('medium').text(`${data.contratado.nome}, CPF ${data.contratado.cpf}, residente na ${data.contratado.endereco}, e-mail: ${data.contratado.email}, doravante denominado CONTRATADO.`).moveDown();

  doc.text(`Têm entre si justo e contratado o que segue:`).moveDown(2);

  doc.font('bold').text(`CLÁUSULA 1 - DO OBJETO`, { underline: true }).moveDown();
  doc.font('medium').text(`O presente contrato tem como objeto a prestação de serviços de desenvolvimento de software conforme os requisitos especificados no Anexo I, denominado ${data.detalhes.nomeProjeto}.`).moveDown(2);

  doc.font('bold').text(`\n\n\nCLÁUSULA 2 - DO PRAZO`, { underline: true }).moveDown();
  doc.font('medium').text(`O prazo máximo para entrega do projeto é de ${data.detalhes.prazoEntrega}, contados a partir do início dos trabalhos.`).moveDown(2);

  doc.font('bold').text(`CLÁUSULA 3 - DO VALOR E FORMA DE PAGAMENTO`, { underline: true }).moveDown();
  doc.font('medium').text(`O valor total do presente contrato é de R$ ${data.detalhes.valorTotal} (${data.detalhes.valorPorExtenso}), apurado com base no valor da hora técnica de R$ ${data.detalhes.valorHora} (${data.detalhes.valorHoraPorExtenso}), considerando-se o total estimado de ${data.detalhes.totalHoras} (${data.detalhes.horasPorExtenso}) horas de trabalho.`).moveDown();
  doc.font('medium').text(`O pagamento será efetuado em ${data.detalhes.numeroParcelas} (${data.detalhes.parcelasPorExtenso}) parcelas iguais e sucessivas de R$ ${data.detalhes.valorParcela} (${data.detalhes.valorParcelaPorExtenso}), com vencimento semanal, sempre às ${data.detalhes.diaVencimento}, iniciando-se em ${data.detalhes.dataPrimeiroVencimento}.`).moveDown();
  doc.font('medium').text(`O adimplemento das parcelas deverá ocorrer, impreterivelmente, por meio de transferência via PIX, utilizando a chave ${data.detalhes.dadosPagamento.pix}, correspondente ao ${data.detalhes.dadosPagamento.banco} (código ${data.detalhes.dadosPagamento.codigoBanco}), titular: ${data.detalhes.dadosPagamento.titular}.`).moveDown(2);

  doc.font('bold').text(`CLÁUSULA 4 - DAS PENALIDADES`, { underline: true }).moveDown();
  doc.font('medium').text(`Em caso de atraso superior a 7 (sete) dias no pagamento, este contrato será considerado rescindido, garantindo-se ao CONTRATADO o direito ao recebimento proporcional das horas trabalhadas. Será aplicada multa de 2% ao dia de atraso.`).moveDown(2);

  doc.font('bold').text(`\n\n\nCLÁUSULA 5 - DAS OBRIGAÇÕES DA CONTRATANTE`, { underline: true }).moveDown();
  doc.font('medium').text(`A CONTRATANTE se compromete a custear os serviços essenciais ao projeto, incluindo AWS, OpenAI, SURI, API bancária e demais ferramentas conforme necessidade do sistema.`).moveDown(2);

  doc.font('bold').text(`CLÁUSULA 6 – DAS OBRIGAÇÕES DO CONTRATADO`, { underline: true }).moveDown();
  doc.font('medium').text(`Desenvolver as funcionalidades descritas no anexo técnico do projeto, respeitando os requisitos funcionais, integrações e segurança conforme a LGPD.`).moveDown(2);

  doc.font('bold').text(`\nCLÁUSULA 7 – DA SEGURANÇA E PRIVACIDADE`, { underline: true }).moveDown();
  doc.font('medium').text(`Todos os dados do sistema serão armazenados em banco de dados privado, sem compartilhamento com terceiros, atendendo à LGPD.`).moveDown(2);

  doc.font('bold').text(`CLÁUSULA 8 - DA RESCISÃO`, { underline: true }).moveDown();
  doc.font('medium').text(`O contrato poderá ser rescindido por qualquer das partes, mediante notificação prévia com 7 (sete) dias de antecedência, garantido o pagamento proporcional ao trabalho realizado.`).moveDown(2);

  doc.font('bold').text(`CLÁUSULA 9 – DAS CONDIÇÕES GERAIS`, { underline: true }).moveDown();
  doc.font('medium').text(`Após assinatura e pagamento, o CONTRATADO iniciará os processos de infraestrutura, conforme cronograma acordado.`).moveDown(2);

  doc.font('bold').text(`\nCLÁUSULA 10 - DO FORO`, { underline: true }).moveDown();
  doc.font('medium').text(`Fica eleito o foro da comarca de ${data.detalhes.localForo} para dirimir quaisquer dúvidas oriundas deste contrato, renunciando a qualquer outro por mais privilegiado que seja.`).moveDown(4);

  // Assinaturas
  const lineY = doc.y;
  doc.moveTo(50, lineY).lineTo(250, lineY).stroke();
  doc.text('CONTRATANTE', 50, lineY + 10, { width: 200, align: 'center' });

  doc.moveTo(300, lineY).lineTo(500, lineY).stroke();
  doc.text('CONTRATADO', 300, lineY + 10, { width: 200, align: 'center' });

  doc.text(data.contratante.representante, 50, lineY + 30, { width: 200, align: 'center' });
  doc.text(data.contratado.nome, 300, lineY + 30, { width: 200, align: 'center' });

  // Finaliza o documento
  doc.end();

  console.log(`Contrato gerado com sucesso: ${filename}`);
}

// Uso
generateContract(data, `Contrato ${data.contratante.razaoSocial}: ${data.detalhes.nomeProjeto}.pdf`);