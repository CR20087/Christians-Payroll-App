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

@app.route("/registerAccount/manager/<string:userName>/<string:password>/<string:firstName>/<string:lastName>/<string:email>/<string:address>/<string:suburb>/<string:businessName>/<string:phone>/<string:entityName>/<string:contactMethod>")
def create_manager(userName: str,password: str,firstName: str,lastName: str,email: str,address: str,suburb: str,businessName: str,phone: str,entityName: str,contactMethod: str):
    result = cpa_sql.create_manager(userName,password,firstName,lastName,email,phone,address,suburb,contactMethod,businessName,entityName)

    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/settings/employee/<string:userName>")
def get_employee_settings(userName: str):
    result = cpa_sql.get_employee_settings(userName)

    return jsonify(userName=str(result[0]),password=str(result[1]),firstName=str(result[2]),lastName=str(result[3]),email=str(result[4]),address=str(result[5]),suburb=str(result[6]),postCode=str(result[7]),phone=str(result[8]))

@app.route("/settings/employee/update/<string:userNameOld>/<string:userName>/<string:password>/<string:firstName>/<string:lastName>/<string:email>/<string:phone>/<string:address>/<string:suburb>/<string:postCode>")
def update_employee_settings(userNameOld: str,userName: str,password: str,firstName: str,lastName: str,email: str,phone: str,address: str,suburb: str,postCode: str):
    result = cpa_sql.update_employee_settings(userNameOld,userName,password,firstName,lastName,email,phone,address,suburb,postCode)

    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-list/<string:userName>")
def get_manager_employees(userName: str):
    result = cpa_sql.get_manager_employees(userName)

    class Employee() :
        def __init__(self,employee):
            self.username = employee[0]
            self.first_name = employee[1]
            self.last_name = employee[2]
            self.phone = employee[3]
            self.email = employee[4]
            self.pay_rate = employee[5].__str__()
            self.bank_account = employee[6]
            self.kiwisaver = employee[7].__str__()
            self.student_loan = employee[8].__str__()
            self.one_off_deduction = employee[9].__str__()
            self.tax_rate = employee[10].__str__()
            self.final_pay = employee[11].__str__()
            self.weekly_allowance = employee[12].__str__()
            self.weekly_allowance_nontax = employee[13].__str__()
            self.year_to_date = employee[14].__str__()
            self.child_support = employee[15].__str__()
            self.tax_credit = employee[16].__str__()
            self.benefits = employee[17].__str__()
            self.created_on = employee[18].__str__()
        def string(self):
            return {
                'username':self.username,
                'first_name':self.first_name,
                'last_name':self.last_name,
                'phone':self.phone,
                'email':self.email,
                'pay_rate':self.pay_rate,
                'bank_account':self.bank_account,
                'kiwisaver':self.kiwisaver,
                'student_loan':self.student_loan,
                'one_off_deduction':self.one_off_deduction,
                'tax_rate':self.tax_rate,'final_pay':self.final_pay,
                'weekly_allowance':self.weekly_allowance,
                'weekly_allowance_nontax':self.weekly_allowance_nontax,
                'year_to_date':self.year_to_date,
                'child_support':self.child_support,
                'tax_credit':self.tax_credit,
                'benefits':self.benefits,
                'created_on':self.created_on}

    employees = []

    for i in result:
        emp = Employee(i)
        employees.append(emp)

    response = []
    for i in employees:
        response.append(i.string())
        

    return jsonify(results = response)
if __name__ == "__main__":
    app.run(debug=True)