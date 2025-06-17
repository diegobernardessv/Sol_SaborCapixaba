from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # A importação de models é necessária para que o Flask-Migrate os encontre.
    from app import models

    # Registra os comandos do CLI
    from app import commands
    app.cli.add_command(commands.seed)

    return app 