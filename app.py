from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
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
    formality_level = data.get('formalityLevel')
    
    prompt = PROMPTS.get(preset, "Ajuste o texto do e-mail de forma profissional.")
    
    # Aqui você faria a chamada à API do MariTalk
    # Por enquanto, vamos apenas retornar o texto original com o prompt
    adjusted_text = f"[Usando o prompt: {prompt}]\n\nTexto ajustado para o preset {preset} com nível de formalidade {formality_level}%: {email_text}"
    
    return jsonify({
        'adjustedText': adjusted_text,
        'comprehensibilityIndex': 75  # Valor de exemplo
    })

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
