import nodemailer from 'nodemailer'

export async function sendEmail(email: string) {
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true para porta 465, false para outras portas (como 587)
    auth: {
      user: testAccount.user, // Usuário gerado pelo Ethereal
      pass: testAccount.pass, // Senha gerada pelo Ethereal
    },
  });

  // 3. Define as opções do e-mail
  const info = await transporter.sendMail({
    from: 'CoreNode <corenode@exemplo.com>', // Remetente
    to: email, // Destinatário(s)
    subject: "Recuperação de Senha", // Assunto
    text: "Olá! Este é um e-mail contendo o link para recuperação da sua senha", // Corpo em texto simples
    html: "<b>Olá!</b> Este é um e-mail contendo o link para recuperação da sua senha.", // Corpo em HTML
  });
  // 4. Exibe as informações e o link de visualização no terminal
  console.log("Mensagem enviada: %s", info.messageId);
  
  // A mágica acontece aqui: gera a URL do e-mail no Ethereal
  console.log("URL de visualização: %s", nodemailer.getTestMessageUrl(info));
}