from flask import Flask, jsonify, render_template
from Payslip_Generator.Payslip_Script import Payslip_Script
app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/sql/test")
def sql_test():
    return jsonify(message="Successfully reached thus url")

@app.route(f"/sendpayslip/<string:email>")
def sendpayslip(email: str):
    Payslip_Script(email)
    return jsonify(message="Payslip delivered succesfully")


if __name__ == "__main__":
    app.run(debug=True)