from flask import Flask, request, jsonify
import sqlite3
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

# Enable CORS for all domains
CORS(app)

# Store your API key in an environment variable
api_key = os.getenv('kinky')

# SQLite setup
DATABASE = 'users.db'

def init_db():
    """ Initialize the database with users table if not exists """
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY,
                            username TEXT UNIQUE,
                            password TEXT)''')
        conn.commit()

init_db()

@app.route('/api/signup', methods=['POST'])
def signup():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    try:
        # Add user to the database
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
        
        return jsonify({"message": "Signup successful"}), 200

    except sqlite3.IntegrityError:
        return jsonify({"message": "Username already exists"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()

        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 400

if __name__ == "__main__":
    app.run(debug=True)
