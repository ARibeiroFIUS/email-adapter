from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

MARITALK_API_KEY = os.getenv('MARITALK_API_KEY')

PROMPTS = {
    "juridico": "Ajuste o texto do e-mail para um destinatário da área jurídica, usando linguagem formal e técnica.",
    "rh": "Adapte o e-mail para um profissional de RH, usando um tom amigável mas profissional.",
    "c-level": "Ajuste o e-mail para executivos de alto nível, sendo conciso e focando em impactos estratégicos.",
    "cliente": "Adapte o e-mail para um cliente individual, usando um tom amigável e acessível.",
    "parte-contraria": "Ajuste o e-mail para comunicação com uma parte contrária, mantendo um tom neutro e profissional.",
    "advogado-contrario": "Adapte o e-mail para comunicação com o advogado representando a parte oposta, usando linguagem formal e técnica."
}

@app.route('/api/adjust-email', methods=['POST'])
def adjust_email():
    data = request.json
    email_text = data.get('emailText')
    preset = data.get('preset')
    
    prompt = PROMPTS.get(preset, "Ajuste o texto do e-mail de forma profissional.")
    
    # Aqui você faria a chamada à API do MariTalk
    # Por enquanto, vamos apenas retornar o texto original com o prompt
    adjusted_text = f"[Usando o prompt: {prompt}]\n\nTexto ajustado: {email_text}"
    
    return jsonify({'adjustedText': adjusted_text})

if __name__ == '__main__':
    app.run(debug=True)
