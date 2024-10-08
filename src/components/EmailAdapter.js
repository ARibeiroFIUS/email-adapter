import React, { useState } from 'react';

const EmailAdapter = () => {
  const [emailText, setEmailText] = useState('');
  const [profile, setProfile] = useState('');
  const [formalityLevel, setFormalityLevel] = useState(50);
  const [adjustedText, setAdjustedText] = useState('');
  const [comprehensibilityIndex, setComprehensibilityIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://chat.maritaca.ai/api/chat/inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Key YOUR_API_KEY_HERE' // Substitua pelo seu API key real
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `Você é um assistente especializado em adaptar e-mails para diferentes públicos. O perfil do destinatário é: ${profile}. O nível de formalidade desejado é: ${formalityLevel}%.` },
            { role: "user", content: `Por favor, adapte o seguinte e-mail:\n\n${emailText}` }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          model: "maritalk"
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setAdjustedText(data.choices[0].message.content);
        // Simulando um índice de compreensibilidade baseado no comprimento do texto
        setComprehensibilityIndex(Math.min(100, Math.floor(data.choices[0].message.content.length / 5)));
      } else {
        throw new Error('Resposta da API inválida');
      }
    } catch (error) {
      console.error('Erro ao processar o e-mail:', error);
      setAdjustedText('Ocorreu um erro ao processar o e-mail. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getComprehensibilityLabel = (index) => {
    if (index > 75) return 'Excelente';
    if (index > 50) return 'Bom';
    if (index > 25) return 'Moderado';
    return 'Precisa de Ajustes';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Adaptador de E-mails</h1>
      
      <textarea
        placeholder="Insira o texto do e-mail"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        className="w-full p-2 border rounded min-h-[200px]"
      />
      
      <div className="flex space-x-4">
        <select
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-[200px] p-2 border rounded"
        >
          <option value="">Selecione o perfil</option>
          <option value="juridico">Jurídico</option>
          <option value="rh">RH</option>
          <option value="c-level">C-level</option>
          <option value="cliente">Cliente Pessoa Física</option>
          <option value="parte-contraria">Parte Contrária</option>
          <option value="advogado-contrario">Advogado da Parte Contrária</option>
        </select>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Nível de Formalidade: {formalityLevel}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={formalityLevel}
            onChange={(e) => setFormalityLevel(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded`}
      >
        {isLoading ? 'Processando...' : 'Ajustar E-mail'}
      </button>
      
      {adjustedText && (
        <div className="space-y-4">
          <textarea
            value={adjustedText}
            readOnly
            className="w-full p-2 border rounded min-h-[200px]"
          />
          
          <div>
            <label className="block text-sm font-medium mb-2">Índice de Compreensibilidade</label>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
                style={{width: `${comprehensibilityIndex}%`}}
              >
                {comprehensibilityIndex}%
              </div>
            </div>
            <p className="mt-2 text-center font-semibold">
              {getComprehensibilityLabel(comprehensibilityIndex)}
            </p>
          </div>
          
          <div>
            <p className="mb-2">O texto ajustado está adequado?</p>
            <div className="flex space-x-2">
              <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Sim</button>
              <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAdapter;
