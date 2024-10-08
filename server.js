console.log('Iniciando o servidor...');

const express = require('express');
const cors = require('cors');
const { MariTalk } = require('maritalk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const model = new MariTalk({
  key: process.env.MARITALK_API_KEY,
  model: "sabia-3"
});

app.get('/', (req, res) => {
  res.send('Email Adapter API is running');
});

app.post('/api/adapt-email', async (req, res) => {
  try {
    const { emailText, profile, formalityLevel } = req.body;
    const prompt = generatePrompt(profile, formalityLevel, emailText);
    console.log('Enviando solicitação para a API MaritALK...');
    const response = await model.generate(prompt, { max_tokens: 1000 });
    console.log('Resposta recebida da API MaritALK');
    if (response && response.answer) {
      res.json({ 
        adjustedText: response.answer,
        comprehensibilityIndex: calculateComprehensibilityIndex(response.answer),
        usage: response.usage
      });
    } else {
      throw new Error('Resposta da API inválida');
    }
  } catch (error) {
    console.error('Erro ao processar o e-mail:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar o e-mail.' });
  }
});

function generatePrompt(profile, formalityLevel, emailText) {
  let prompt = "Você é um assistente especializado em adaptar e-mails para diferentes públicos. ";

  // Adiciona detalhes sobre o perfil selecionado
  switch(profile) {
    case 'juridico':
      prompt += "O destinatário é um profissional da área jurídica. Use termos técnicos apropriados e mantenha um tom profissional. ";
      break;
    case 'rh':
      prompt += "O destinatário trabalha em Recursos Humanos. Use uma linguagem empática e focada em pessoas. ";
      break;
    case 'c-level':
      prompt += "O destinatário é um executivo de alto nível. Seja direto, focado em resultados e use termos estratégicos. ";
      break;
    case 'cliente':
      prompt += "O destinatário é um cliente pessoa física. Use uma linguagem clara, evite jargões técnicos e mantenha um tom amigável. ";
      break;
    case 'parte-contraria':
      prompt += "O destinatário é a parte contrária em um processo. Mantenha um tom neutro, profissional e evite linguagem que possa ser interpretada como hostil. ";
      break;
    case 'advogado-contrario':
      prompt += "O destinatário é o advogado da parte contrária. Use linguagem técnica jurídica, mantenha um tom respeitoso e profissional. ";
      break;
    default:
      prompt += "Adapte o e-mail de forma geral para melhorar sua clareza e eficácia. ";
  }

  // Adiciona instruções sobre o nível de formalidade
  if (formalityLevel < 25) {
    prompt += "Use um tom muito informal, como se estivesse conversando com um amigo próximo. ";
  } else if (formalityLevel < 50) {
    prompt += "Use um tom casual, mas ainda profissional. ";
  } else if (formalityLevel < 75) {
    prompt += "Mantenha um tom formal, mas não excessivamente rígido. ";
  } else {
    prompt += "Use um tom muito formal e respeitoso. ";
  }

  prompt += `O nível de formalidade desejado é ${formalityLevel}%. `;
  prompt += "Por favor, adapte o seguinte e-mail de acordo com essas instruções:\n\n";
  prompt += emailText;

  return prompt;
}

function calculateComprehensibilityIndex(text) {
  // Implemente sua lógica de cálculo do índice de compreensibilidade aqui
  // Por enquanto, vamos usar um cálculo simples baseado no comprimento do texto
  return Math.min(100, Math.floor(text.length / 5));
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log('Variáveis de ambiente carregadas:', process.env.MARITALK_API_KEY ? 'MARITALK_API_KEY está definida' : 'MARITALK_API_KEY não está definida');
});
