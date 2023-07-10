from flask import Flask, jsonify, render_template
from src.Flask.Payslip_Generator import Payslip_Script
from src.Flask import cpa_sql

app = Flask(__name__, template_folder='src/Flask/templates')
app.config['WKHTMLTOPDF_PATH'] = '/usr/bin/wkhtmltopdf' 

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

    return jsonify(success=str(result[0]),error=str(result[1])) 

@app.route(f"/sendpayslip/<string:username>")
def sendpayslip(username: str):
    Payslip_Script.Payslip_Script(username)
    return jsonify(message="Payslip delivered succesfully")

@app.route("/settings/manager/<string:userName>")
def get_manager_settings(userName: str):
    result = cpa_sql.get_manager_settings(userName)

    return jsonify(userName=str(result[0]),password=str(result[1]),firstName=str(result[2]),lastName=str(result[3]),email=str(result[4]),address=str(result[5]),suburb=str(result[6]),contactMethod=str(result[7]),businessName=str(result[8]),entityName=str(result[9]),phone=str(result[10]))

@app.route("/settings/manager/update/<string:userNameOld>/<string:userName>/<string:password>/<string:firstName>/<string:lastName>/<string:email>/<string:phone>/<string:address>/<string:suburb>/<string:contactMethod>/<string:businessName>/<string:entityName>")
def update_manager_settings(userNameOld: str,userName: str,password: str,firstName: str,lastName: str,email: str,phone: str,address: str,suburb: str,contactMethod: str,businessName: str,entityName: str):
    result = cpa_sql.update_manager_settings(userNameOld,userName,password,firstName,lastName,email,phone,address,suburb,contactMethod,businessName,entityName)

    return jsonify(success=str(result[0]),error=str(result[1]))
if __name__ == "__main__":
    app.run(debug=True)