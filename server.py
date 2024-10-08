import os
from flask import Flask, request, jsonify
from maritalk import MariTalk
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

model = MariTalk(
    key=os.getenv('MARITALK_API_KEY'),
    model="sabia-3"
)

@app.route('/')
def home():
    return "Email Adapter API is running"

@app.route('/api/adapt-email', methods=['POST'])
def adapt_email():
    try:
        data = request.json
        email_text = data['emailText']
        profile = data['profile']
        formality_level = data['formalityLevel']

        prompt = generate_prompt(profile, formality_level, email_text)
        response = model.generate(prompt, max_tokens=1000)

        if response and response.get('answer'):
            return jsonify({
                'adjustedText': response['answer'],
                'comprehensibilityIndex': calculate_comprehensibility_index(response['answer']),
                'usage': response.get('usage')
            })
        else:
            raise ValueError('Resposta da API inválida')
    except Exception as e:
        print(f'Erro ao processar o e-mail: {str(e)}')
        return jsonify({'error': 'Ocorreu um erro ao processar o e-mail.'}), 500

def generate_prompt(profile, formality_level, email_text):
    prompt = "Você é um assistente especializado em adaptar e-mails para diferentes públicos. "

    # Adiciona detalhes sobre o perfil selecionado
    if profile == 'juridico':
        prompt += "O destinatário é um profissional da área jurídica. Use termos técnicos apropriados e mantenha um tom profissional. "
    elif profile == 'rh':
        prompt += "O destinatário trabalha em Recursos Humanos. Use uma linguagem empática e focada em pessoas. "
    elif profile == 'c-level':
        prompt += "O destinatário é um executivo de alto nível. Seja direto, focado em resultados e use termos estratégicos. "
    elif profile == 'cliente':
        prompt += "O destinatário é um cliente pessoa física. Use uma linguagem clara, evite jargões técnicos e mantenha um tom amigável. "
    elif profile == 'parte-contraria':
        prompt += "O destinatário é a parte contrária em um processo. Mantenha um tom neutro, profissional e evite linguagem que possa ser interpretada como hostil. "
    elif profile == 'advogado-contrario':
        prompt += "O destinatário é o advogado da parte contrária. Use linguagem técnica jurídica, mantenha um tom respeitoso e profissional. "
    else:
        prompt += "Adapte o e-mail de forma geral para melhorar sua clareza e eficácia. "

    # Adiciona instruções sobre o nível de formalidade
    if formality_level < 25:
        prompt += "Use um tom muito informal, como se estivesse conversando com um amigo próximo. "
    elif formality_level < 50:
        prompt += "Use um tom casual, mas ainda profissional. "
    elif formality_level < 75:
        prompt += "Mantenha um tom formal, mas não excessivamente rígido. "
    else:
        prompt += "Use um tom muito formal e respeitoso. "

    prompt += f"O nível de formalidade desejado é {formality_level}%. "
    prompt += "Por favor, adapte o seguinte e-mail de acordo com essas instruções:\n\n"
    prompt += email_text

    return prompt

def calculate_comprehensibility_index(text):
    # Implemente sua lógica de cálculo do índice de compreensibilidade aqui
    # Por enquanto, vamos usar um cálculo simples baseado no comprimento do texto
    return min(100, int(len(text) / 5))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
