from flask import Blueprint, render_template, jsonify
from app import db
from app.models import Produto

# Criamos o Blueprint
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/produtos')
def api_produtos():
    """Endpoint da API para obter todos os produtos do cardápio."""
    produtos = Produto.query.all()
    lista_produtos = [produto.to_dict() for produto in produtos]
    return jsonify(items=lista_produtos) 