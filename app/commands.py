import click
import json
import os
from flask.cli import with_appcontext
from app import db
from app.models import Produto

@click.command('seed')
@with_appcontext
def seed():
    """
    Popula o banco de dados com os itens iniciais do menu a partir do menu.json.
    """
    
    # Constrói o caminho para o arquivo menu.json
    # Usamos os.path.join para garantir que funcione em qualquer sistema operacional.
    # 'app' é o diretório onde este comando está, então voltamos um nível (os.pardir)
    # para chegar na raiz do projeto e então encontrar menu.json.
    json_path = os.path.join(os.path.dirname(__file__), os.pardir, 'menu.json')

    click.echo('Lendo o arquivo menu.json...')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    click.echo('Iniciando o povoamento do banco de dados...')
    total_adicionados = 0
    total_existentes = 0

    for item_data in data['items']:
        # Verifica se um produto com este nome já existe no banco
        produto_existente = Produto.query.filter_by(nome=item_data['name']).first()
        
        if produto_existente:
            # Se já existe, pulamos para o próximo item
            total_existentes += 1
            continue

        # Se não existe, cria um novo objeto Produto
        novo_produto = Produto(
            nome=item_data['name'],
            descricao=item_data['description'],
            preco=item_data['price'],
            categoria=item_data['category'],
            promocao=item_data['promotion'],
            # Inicialmente, não temos imagens, então deixamos como None (null)
            imagem_url=None 
        )
        db.session.add(novo_produto)
        total_adicionados += 1

    # Após o loop, se adicionamos algum produto, salvamos as alterações
    if total_adicionados > 0:
        db.session.commit()
        click.echo(f'{total_adicionados} novos produtos foram adicionados com sucesso.')
    
    if total_existentes > 0:
        click.echo(f'{total_existentes} produtos já existiam no banco e foram ignorados.')

    if total_adicionados == 0 and total_existentes > 0:
        click.echo('O banco de dados já parece estar populado. Nenhum produto novo foi adicionado.')
    elif total_adicionados == 0 and total_existentes == 0:
        click.echo('Nenhum item encontrado no menu.json.')
    
    click.echo('Povoamento concluído.') 