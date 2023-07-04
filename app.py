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

    return jsonify(match=str(result[0]),role=str(result[1]),setup=str(result[2]))

@app.route("/register/<string:userName>/<string:password>")
def register_check(userName: str,password: str):
    result = cpa_sql.register_check(userName,password)

    return jsonify(match=str(result[0]),config=str(result[1]))

@app.route("/registerAccount/<string:userName>/<string:firstName>/<string:lastName>/<string:email>/<string:address>/<string:suburb>/<string:postCode>/<string:phone>")
def register_account(userName: str,firstName: str,lastName: str,email: str,address: str,suburb: str,postCode: str,phone: str):
    result = cpa_sql.register_account(userName,firstName,lastName,email,address,suburb,postCode,phone)

    return jsonify(success=str(result)) 

@app.route(f"/sendpayslip/<string:username>")
def sendpayslip(username: str):
    Payslip_Script.Payslip_Script(username)
    return jsonify(message="Payslip delivered succesfully")


if __name__ == "__main__":
    app.run(debug=True)