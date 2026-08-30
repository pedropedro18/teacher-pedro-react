import express from 'express';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import db from './db.js'; // ajusta este caminho se o teu ficheiro de conexão MySQL tiver outro nome/local
import { verificarTokenAluno } from './alunoAuth.js';

const router = express.Router();

router.get('/certificado/:nivel', verificarTokenAluno, async (req, res) => {
  try {
    const alunoId = req.aluno.id; // confirma que é assim que o teu middleware guarda o id do aluno
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
    // AJUSTA: 'nivel' e 'nota' precisam existir na tua tabela 'submissoes'
    const [resultado] = await db.query(
      `SELECT COUNT(*) as total, SUM(CASE WHEN nota >= 7 THEN 1 ELSE 0 END) as aprovadas
       FROM submissoes WHERE aluno_id = ? AND nivel = ?`,
      [alunoId, nivel]
    );

    const totalExercicios = 10; // ajusta este número conforme quantas lições/exercícios cada nível realmente tem
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

    const { width, height } = page.getSize();
    const azul = rgb(0.1, 0.3, 0.6);

    // Borda decorativa
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: azul,
      borderWidth: 3,
    });

    // Título
    const titulo = 'CERTIFICADO DE CONCLUSÃO';
    const tituloSize = 28;
    const tituloWidth = fontBold.widthOfTextAtSize(titulo, tituloSize);
    page.drawText(titulo, {
      x: (width - tituloWidth) / 2,
      y: height - 120,
      size: tituloSize,
      font: fontBold,
      color: azul,
    });

    // Subtítulo
    const subtitulo = 'Teacher Pedro — English School';
    const subtituloSize = 14;
    const subtituloWidth = fontRegular.widthOfTextAtSize(subtitulo, subtituloSize);
    page.drawText(subtitulo, {
      x: (width - subtituloWidth) / 2,
      y: height - 155,
      size: subtituloSize,
      font: fontRegular,
    });

    // Texto "Certificamos que"
    const certificamos = 'Certificamos que';
    const certificamosWidth = fontRegular.widthOfTextAtSize(certificamos, 14);
    page.drawText(certificamos, {
      x: (width - certificamosWidth) / 2,
      y: height - 220,
      size: 14,
      font: fontRegular,
    });

    // Nome do aluno
    const nomeSize = 24;
    const nomeWidth = fontBold.widthOfTextAtSize(nomeAluno, nomeSize);
    page.drawText(nomeAluno, {
      x: (width - nomeWidth) / 2,
      y: height - 260,
      size: nomeSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Texto do nível
    const textoNivel = `concluiu com êxito o nível ${nivel} de Inglês (CEFR)`;
    const textoNivelWidth = fontRegular.widthOfTextAtSize(textoNivel, 14);
    page.drawText(textoNivel, {
      x: (width - textoNivelWidth) / 2,
      y: height - 300,
      size: 14,
      font: fontRegular,
    });

    // Email do aluno (discreto, abaixo do texto do nível)
    const emailSize = 10;
    const textoEmailWidth = fontRegular.widthOfTextAtSize(emailAluno, emailSize);
    page.drawText(emailAluno, {
      x: (width - textoEmailWidth) / 2,
      y: height - 325,
      size: emailSize,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Data
    const dataFormatada = new Date().toLocaleDateString('pt-PT');
    const textoData = `Angola, ${dataFormatada}`;
    const textoDataWidth = fontRegular.widthOfTextAtSize(textoData, 12);
    page.drawText(textoData, {
      x: (width - textoDataWidth) / 2,
      y: 100,
      size: 12,
      font: fontRegular,
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