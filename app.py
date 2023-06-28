from flask import Flask, jsonify, render_template
from src.Flask.Payslip_Generator import Payslip_Script
from src.Flask import cpa_sql

app = Flask(__name__, template_folder='src/Flask/templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/login/<string:userName>/<string:password>")
def login_verify(userName: str,password: str):
    result = cpa_sql.login_verify(userName,password)

    return jsonify(match=str(result))

@app.route(f"/sendpayslip/<string:email>")
def sendpayslip(email: str):
    Payslip_Script(email)
    return jsonify(message="Payslip delivered succesfully")


if __name__ == "__main__":
    app.run(debug=True)