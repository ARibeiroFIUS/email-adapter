import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const EmailAdapter = () => {
  const [emailText, setEmailText] = useState('');
  const [profile, setProfile] = useState('');
  const [formalityLevel, setFormalityLevel] = useState(50);
  const [adjustedText, setAdjustedText] = useState('');
  const [comprehensibilityIndex, setComprehensibilityIndex] = useState(0);

  const handleSubmit = () => {
    // Simulação de processamento do e-mail
    setAdjustedText(`Texto ajustado para o perfil ${profile} com nível de formalidade ${formalityLevel}%:\n\n${emailText}`);
    setComprehensibilityIndex(Math.floor(Math.random() * 100));
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
      
      <Textarea
        placeholder="Insira o texto do e-mail"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        className="min-h-[200px]"
      />
      
      <div className="flex space-x-4">
        <Select onValueChange={setProfile}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione o perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="juridico">Jurídico</SelectItem>
            <SelectItem value="rh">RH</SelectItem>
            <SelectItem value="c-level">C-level</SelectItem>
            <SelectItem value="cliente">Cliente Pessoa Física</SelectItem>
            <SelectItem value="parte-contraria">Parte Contrária</SelectItem>
            <SelectItem value="advogado-contrario">Advogado da Parte Contrária</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Nível de Formalidade</label>
          <Slider
            value={[formalityLevel]}
            onValueChange={(value) => setFormalityLevel(value[0])}
            max={100}
            step={1}
          />
        </div>
      </div>
      
      <Button onClick={handleSubmit} className="w-full">Ajustar E-mail</Button>
      
      {adjustedText && (
        <div className="space-y-4">
          <Textarea
            value={adjustedText}
            readOnly
            className="min-h-[200px]"
          />
          
          <div>
            <label className="block text-sm font-medium mb-2">Índice de Compreensibilidade</label>
            <Progress value={comprehensibilityIndex} className="w-full" />
            <p className="mt-2 text-center font-semibold">
              {getComprehensibilityLabel(comprehensibilityIndex)}
            </p>
          </div>
          
          <div>
            <p className="mb-2">O texto ajustado está adequado?</p>
            <div className="flex space-x-2">
              <Button variant="outline">Sim</Button>
              <Button variant="outline">Não</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAdapter;
