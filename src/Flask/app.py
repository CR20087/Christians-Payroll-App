from flask import Flask, jsonify
from Payslip_Generator.Payslip_Script import Payslip_Script
app = Flask(__name__)

@app.route(f"/sql/test")
def sql_test():
    return jsonify(message="Successfully reached thus url")

@app.route(f"/sendpayslip/<string:email>")
def sendpayslip(email: str):
    Payslip_Script(email)
    return jsonify(message="Payslip delivered succesfully")


if __name__ == "__main__":
    app.run(debug=True)