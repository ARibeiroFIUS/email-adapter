import React, { useState } from 'react';

const EmailAdapter = () => {
  const [emailText, setEmailText] = useState('');
  const [profile, setProfile] = useState('');
  const [formalityLevel, setFormalityLevel] = useState(50);
  const [adjustedText, setAdjustedText] = useState('');
  const [comprehensibilityIndex, setComprehensibilityIndex] = useState(0);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/adjust-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailText, preset: profile, formalityLevel }),
      });
      const data = await response.json();
      setAdjustedText(data.adjustedText);
      setComprehensibilityIndex(data.comprehensibilityIndex);
    } catch (error) {
      console.error('Error adjusting email:', error);
      setAdjustedText('Erro ao ajustar o e-mail. Por favor, tente novamente.');
    }
  };

  const getComprehensibilityLabel = (index) => {
    if (index > 75) return 'Excelente';
    if (index > 50) return 'Bom';
    if (index > 25) return 'Moderado';
    return 'Precisa de Ajustes';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Adaptador de E-mails</h1>
      <textarea
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        placeholder="Insira o texto do e-mail"
        style={{ width: '100%', height: '150px', marginBottom: '10px' }}
      />
      <div style={{ marginBottom: '10px' }}>
        <select 
          value={profile} 
          onChange={(e) => setProfile(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="">Selecione o perfil</option>
          <option value="juridico">Jurídico</option>
          <option value="rh">RH</option>
          <option value="c-level">C-level</option>
          <option value="cliente">Cliente Pessoa Física</option>
          <option value="parte-contraria">Parte Contrária</option>
          <option value="advogado-contrario">Advogado da Parte Contrária</option>
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Nível de Formalidade: {formalityLevel}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={formalityLevel}
          onChange={(e) => setFormalityLevel(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <button 
        onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
      >
        Ajustar E-mail
      </button>
      {adjustedText && (
        <div style={{ marginTop: '20px' }}>
          <h2>Texto Ajustado:</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{adjustedText}</p>
          <div>
            <label>Índice de Compreensibilidade:</label>
            <div style={{ backgroundColor: '#ddd', borderRadius: '5px', marginTop: '5px' }}>
              <div 
                style={{ 
                  width: `${comprehensibilityIndex}%`, 
                  backgroundColor: '#4CAF50', 
                  height: '20px', 
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-in-out'
                }} 
              />
            </div>
            <p>{getComprehensibilityLabel(comprehensibilityIndex)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAdapter;
