from flask import Flask
from Payslip_Generator.Payslip_Script import Payslip_Script
app = Flask(__name__)

@app.route(f"/sendpayslip/:email")
def sendpayslip():
    Payslip_Script()
    return {"success"}

@app.route("/members")
def members():
    input("email: ")
    return {"members": ["Member1", "Member2", "Member3"]}

if __name__ == "__main__":
    app.run(debug=True)