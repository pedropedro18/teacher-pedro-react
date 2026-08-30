import express from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import db from './db.js'; // ajusta este caminho se o teu ficheiro de conexão MySQL tiver outro nome/local
import { verificarTokenAluno } from './alunoAuth.js';

const router = express.Router();

router.get('/certificado/:nivel', verificarTokenAluno, async (req, res) => {
  try {
    const alunoId = req.aluno.id;
    const { nivel } = req.params; // ex: 'A1'

    // 1. Buscar nome e email do aluno
    const [alunoRows] = await db.query(
      'SELECT nome, email FROM alunos WHERE id = ?',
      [alunoId]
    );

    if (alunoRows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const nomeAluno = alunoRows[0].nome;
    const emailAluno = alunoRows[0].email;

    // 2. Verificar se o aluno completou o nível
    const [resultado] = await db.query(
      `SELECT COUNT(*) as total, SUM(CASE WHEN nota >= 7 THEN 1 ELSE 0 END) as aprovadas
       FROM submissoes WHERE aluno_id = ? AND nivel = ?`,
      [alunoId, nivel]
    );

    const totalExercicios = 1; // ajusta este número conforme quantas lições/exercícios cada nível realmente tem
    const aprovadas = resultado[0].aprovadas || 0;

    if (aprovadas < totalExercicios) {
      return res.status(403).json({
        error: `Nível ainda não concluído (${aprovadas}/${totalExercicios} exercícios aprovados)`,
      });
    }

    // 3. Gerar o PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 paisagem
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const { width, height } = page.getSize();
    const azulEscuro = rgb(0.06, 0.2, 0.45);
    const azulClaro = rgb(0.15, 0.4, 0.7);
    const dourado = rgb(0.7, 0.55, 0.15);
    const cinza = rgb(0.4, 0.4, 0.4);
    const cinzaClaro = rgb(0.55, 0.55, 0.55);

    // Fundo com leve moldura externa
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(0.99, 0.98, 0.95),
    });

    // Borda externa dourada
    page.drawRectangle({
      x: 18,
      y: 18,
      width: width - 36,
      height: height - 36,
      borderColor: dourado,
      borderWidth: 2,
    });

    // Borda interna azul (moldura dupla)
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: azulEscuro,
      borderWidth: 1.5,
    });

    // Cantos decorativos (pequenos quadrados nos 4 cantos da moldura interna)
    const cantoSize = 10;
    const cantos = [
      [30, 30],
      [width - 30 - cantoSize, 30],
      [30, height - 30 - cantoSize],
      [width - 30 - cantoSize, height - 30 - cantoSize],
    ];
    cantos.forEach(([cx, cy]) => {
      page.drawRectangle({
        x: cx,
        y: cy,
        width: cantoSize,
        height: cantoSize,
        color: dourado,
      });
    });

    // Título
    const titulo = 'CERTIFICADO DE CONCLUSÃO';
    const tituloSize = 30;
    const tituloWidth = fontBold.widthOfTextAtSize(titulo, tituloSize);
    page.drawText(titulo, {
      x: (width - tituloWidth) / 2,
      y: height - 110,
      size: tituloSize,
      font: fontBold,
      color: azulEscuro,
    });

    // Linha decorativa curta sob o título
    const linhaWidth = 160;
    page.drawLine({
      start: { x: (width - linhaWidth) / 2, y: height - 128 },
      end: { x: (width + linhaWidth) / 2, y: height - 128 },
      thickness: 1.5,
      color: dourado,
    });

    // Subtítulo (nome da escola)
    const subtitulo = 'Pedro English School';
    const subtituloSize = 15;
    const subtituloWidth = fontItalic.widthOfTextAtSize(subtitulo, subtituloSize);
    page.drawText(subtitulo, {
      x: (width - subtituloWidth) / 2,
      y: height - 155,
      size: subtituloSize,
      font: fontItalic,
      color: azulClaro,
    });

    // Texto "Certificamos que"
    const certificamos = 'Certificamos que';
    const certificamosSize = 13;
    const certificamosWidth = fontRegular.widthOfTextAtSize(certificamos, certificamosSize);
    page.drawText(certificamos, {
      x: (width - certificamosWidth) / 2,
      y: height - 220,
      size: certificamosSize,
      font: fontRegular,
      color: cinza,
    });

    // Nome do aluno (destaque principal)
    const nomeSize = 30;
    const nomeWidth = fontBold.widthOfTextAtSize(nomeAluno, nomeSize);
    page.drawText(nomeAluno, {
      x: (width - nomeWidth) / 2,
      y: height - 262,
      size: nomeSize,
      font: fontBold,
      color: azulEscuro,
    });

    // Pequena linha sob o nome
    const linhaNomeWidth = Math.max(nomeWidth + 60, 220);
    page.drawLine({
      start: { x: (width - linhaNomeWidth) / 2, y: height - 272 },
      end: { x: (width + linhaNomeWidth) / 2, y: height - 272 },
      thickness: 0.75,
      color: cinzaClaro,
    });

    // Texto do nível
    const textoNivel = `concluiu com êxito o nível ${nivel} de Inglês (CEFR)`;
    const textoNivelSize = 15;
    const textoNivelWidth = fontRegular.widthOfTextAtSize(textoNivel, textoNivelSize);
    page.drawText(textoNivel, {
      x: (width - textoNivelWidth) / 2,
      y: height - 305,
      size: textoNivelSize,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    });

    // Email do aluno (discreto)
    const emailSize = 10;
    const textoEmailWidth = fontRegular.widthOfTextAtSize(emailAluno, emailSize);
    page.drawText(emailAluno, {
      x: (width - textoEmailWidth) / 2,
      y: height - 328,
      size: emailSize,
      font: fontRegular,
      color: cinzaClaro,
    });

    // Selo circular simples (canto inferior direito, decorativo)
    const seloX = width - 130;
    const seloY = 110;
    page.drawCircle({
      x: seloX,
      y: seloY,
      size: 38,
      borderColor: dourado,
      borderWidth: 2,
      color: rgb(0.99, 0.98, 0.95),
    });
    page.drawCircle({
      x: seloX,
      y: seloY,
      size: 30,
      borderColor: dourado,
      borderWidth: 1,
    });
    const seloTexto = 'PES';
    const seloTextoSize = 14;
    const seloTextoWidth = fontBold.widthOfTextAtSize(seloTexto, seloTextoSize);
    page.drawText(seloTexto, {
      x: seloX - seloTextoWidth / 2,
      y: seloY - 5,
      size: seloTextoSize,
      font: fontBold,
      color: dourado,
    });

    // Linha de assinatura (canto inferior esquerdo)
    const assinaturaLinhaWidth = 160;
    const assinaturaX = 110;
    page.drawLine({
      start: { x: assinaturaX, y: 130 },
      end: { x: assinaturaX + assinaturaLinhaWidth, y: 130 },
      thickness: 1,
      color: cinza,
    });
    const textoAssinatura = 'Pedro — Professor';
    const textoAssinaturaSize = 11;
    page.drawText(textoAssinatura, {
      x: assinaturaX,
      y: 112,
      size: textoAssinaturaSize,
      font: fontRegular,
      color: cinza,
    });

    // Data
    const dataFormatada = new Date().toLocaleDateString('pt-PT');
    const textoData = `Angola, ${dataFormatada}`;
    const textoDataSize = 11;
    const textoDataWidth = fontRegular.widthOfTextAtSize(textoData, textoDataSize);
    page.drawText(textoData, {
      x: (width - textoDataWidth) / 2,
      y: 70,
      size: textoDataSize,
      font: fontRegular,
      color: cinza,
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=certificado-${nivel}-${nomeAluno.replace(/\s+/g, '_')}.pdf`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Erro ao gerar certificado:', err);
    res.status(500).json({ error: 'Erro no servidor ao gerar certificado' });
  }
});

export default router;
