# api/commands.py
import click
from api.models import db, User
from api.utils import hash_password


def setup_commands(app):
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User(
                email=f"test_user{x}@test.com",
                password=hash_password("123456"),
                is_active=True
            )
            db.session.add(user)
            db.session.commit()
            print("User:", user.email, "created.")
        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
