from app import db

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    descricao = db.Column(db.String(255), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    promocao = db.Column(db.Boolean, default=False, nullable=False)
    imagem_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        """Converte o objeto Produto para um dicionário serializável em JSON."""
        return {
            'id': self.id,
            'name': self.nome,
            'description': self.descricao,
            'price': self.preco,
            'category': self.categoria,
            'promotion': self.promocao,
            'image_url': self.imagem_url
        }

    def __repr__(self):
        return f'<Produto {self.nome}>' 