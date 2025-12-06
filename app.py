import os
from flask import Flask, redirect, url_for, session
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/login')
def login():
    META_APP_ID = os.getenv('META_APP_ID')
    META_REDIRECT_URI = os.getenv('META_REDIRECT_URI')
    
    url_construida = f'https://www.facebook.com/v19.0/dialog/oauth?client_id={META_APP_ID}&redirect_uri={META_REDIRECT_URI}&scope=ads_read,read_insights,pages_show_list'
    
    print(f"URL GENERADA: {url_construida}")
    
    return redirect(url_construida)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
