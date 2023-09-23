from flask import Flask, jsonify, render_template, Request, request
from src.Flask.Payslip_Generator import Payslip_Script
from src.Flask import cpa_sql
from src.Flask import Password_Reset
import random

# Flask App configuration

app=Flask(__name__, template_folder='src/Flask/templates')
app.config['WKHTMLTOPDF_PATH']='/usr/bin/wkhtmltopdf' 

# Routes

@app.route('/')
def index():
    """Default/Home page has a basic rendered template"""
    return render_template('index.html')

@app.route("/login",methods=['POST'])
def login_verify():
    """Checks for login match.
    
    Returns hashed password role of account, (employee specific) if account
    has been registered.
    """
    data=request.get_json()
    result=cpa_sql.login_verify(data['username'])
    return jsonify(password=str(result[0]),role=str(result[1]),setup=str(result[2]))

@app.route("/register",methods=['POST'])
def register_check():
    """Checks if an employee account is registered.
        
    Returns hashed password, bool of if account is 'setup'.
    """
    data=request.get_json()
    result=cpa_sql.register_check(data['username'])
    return jsonify(password=str(result[0]),config=str(result[1]))

@app.route("/registerAccount",methods=['POST'])
def register_account():
    """Receives data, executes function to register employee account.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.register_account(data['username'],data['firstname'],
                                    data['lastname'],data['email'],
                                    data['address'],data['suburb'],
                                    data['postcode'],data['phone']
                                    )
    return jsonify(success=str(result[0]),error=str(result[1])) 

@app.route("/settings/manager",methods=['POST'])
def get_manager_settings():
    """Returns managers settings from a username"""
    data=request.get_json()
    result=cpa_sql.get_manager_settings(data['username'])
    return jsonify(userName=str(result[0]),password=str(result[1]),
                   firstName=str(result[2]),lastName=str(result[3]),
                   email=str(result[4]),address=str(result[5]),
                   suburb=str(result[6]),contactMethod=str(result[7]),
                   businessName=str(result[8]),entityName=str(result[9]),
                   phone=str(result[10])
                   )

@app.route("/settings/manager/update",methods=['POST'])
def update_manager_settings():
    """Recieves data to update managers settings.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.update_manager_settings(data['username_old'],data['username'],
                                           data['password'],data['firstname'],
                                           data['lastname'],data['email'],
                                           data['phone'],data['address'],
                                           data['suburb'],data['contact_method'],
                                           data['business_name'],data['entity_name']
                                           )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/registerAccount/manager",methods=['POST'])
def create_manager():
    """Receives data and executes method to create new
    manager account.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.create_manager(data['username'],data['password'],
                                  data['firstname'],data['lastname'],
                                  data['email'],data['phone'],
                                  data['address'],data['suburb'],
                                  data['contact_method'],data['business_name'],
                                  data['entity_name']
                                  )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/settings/employee",methods=['POST'])
def get_employee_settings():
    """Returns employee settings from username"""
    data=request.get_json()
    result=cpa_sql.get_employee_settings(data['username'])
    return jsonify(userName=str(result[0]),password=str(result[1]),
                   firstName=str(result[2]),lastName=str(result[3]),
                   email=str(result[4]),address=str(result[5]),
                   suburb=str(result[6]),postCode=str(result[7]),
                   phone=str(result[8])
                   )

@app.route("/settings/employee/update",methods=['POST'])
def update_employee_settings():
    """Receives new data and executes method to update
    employee settings.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.update_employee_settings(data['username_old'],data['username'],
                                            data['password'],data['firstname'],
                                            data['lastname'],data['email'],
                                            data['phone'],data['address'],
                                            data['suburb'],data['postcode']
                                            )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-list",methods=['POST'])
def get_manager_employees():
    """Returns a list of managed employees and their setting from
    username.
    """
    data=request.get_json()
    result=cpa_sql.get_manager_employees(data['username'])
    class Employee() :
        def __init__(self,employee):
            self.username=employee[0]
            self.first_name=employee[1]
            self.last_name=employee[2]
            self.phone=employee[3]
            self.email=employee[4]
            self.pay_rate=employee[5].__str__()
            self.bank_account=employee[6]
            self.ird_number=employee[7]
            self.tax_code=employee[8]
            self.kiwisaver=employee[9].__str__()
            self.student_loan=employee[10].__str__()
            self.one_off_deduction=employee[11].__str__()
            self.tax_rate=employee[12].__str__()
            self.final_pay=employee[13].__str__()
            self.weekly_allowance=employee[14].__str__()
            self.weekly_allowance_nontax=employee[15].__str__()
            self.year_to_date=employee[16].__str__()
            self.child_support=employee[17].__str__()
            self.tax_credit=employee[18].__str__()
            self.benefits=employee[19].__str__()
            self.created_on=employee[20].__str__()
        def string(self):
            return {
                'username':self.username,
                'first_name':self.first_name,
                'last_name':self.last_name,
                'phone':self.phone,
                'email':self.email,
                'pay_rate':self.pay_rate,
                'bank_account':self.bank_account,
                'ird_number':self.ird_number,
                'tax_code':self.tax_code,
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
    employees=[]
    for i in result:
        emp=Employee(i)
        employees.append(emp)
    response=[]
    for i in employees:
        response.append(i.string())
    return jsonify(results=response)

@app.route("/manager/employee-list/update",methods=['POST'])
def update_manager_employee_list():
    """Updates an employee with received data through an executed method.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.update_manager_employee_list(data['bank_account'],data['benefits'],
                                                data['child_support'],data['email'],
                                                data['final_pay'],data['first_name'],
                                                data['kiwisaver'],data['last_name'],
                                                data['one_off_deduction'],data['pay_rate'],
                                                data['phone'],data['student_loan'],data['tax_credit'],
                                                data['tax_rate'],data['username'],
                                                data['username_old'],data['weekly_allowance'],
                                                data['weekly_allowance_nontax'],data['ird_number'],
                                                data['tax_code']
                                                )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/employee/timesheet",methods=['POST'])
def get_timesheet():
    """Returns list of current and active employee timesheet from a username.
    """
    data=request.get_json()
    result=cpa_sql.get_timesheet(data['username'])
    return jsonify(results=result[0],
                   entry_start_date=result[1],
                   entry_end_date=result[2]
                   )

@app.route("/employee/timesheet-entrys",methods=['POST'])
def get_timesheet_entry():
    """Returns a list of employee timesheet entrys during the start/end of the
    active timesheet period.
    """
    data=request.get_json()
    result=cpa_sql.get_timesheet_entry(data['username'],data['start_date'],data['end_date'])
    class Timesheet_entry() :
        def __init__(self,sheet):
            self.timesheet_entry_id=sheet[0]
            self.date=sheet[1].__str__()
            self.start_time=sheet[2].__str__()
            self.end_time=sheet[3].__str__()
            self.unpaid_break=sheet[4].__str__()
            self.pay_type=sheet[5]
            self.comments=sheet[6]
        def string(self):
            return {'timesheet_entry_id':self.timesheet_entry_id,
                     'date':self.date,
                     'start_time':self.start_time,
                     'end_time':self.end_time,
                     'unpaid_break':self.unpaid_break,
                     'pay_type':self.pay_type,
                     'comments':self.comments}
    entrys=[]
    for i in result:
        ent=Timesheet_entry(i)
        entrys.append(ent)
    response=[]
    for i in entrys:
        response.append(i.string())
    return jsonify(results=response)

@app.route("/employee/timesheet-entrys/update",methods=['POST'])
def update_timesheet_entry():
    """Receives new data, executes method to update relevant timesheet entry.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.update_timesheet_entry(data['timesheet_entry_id'],data['date'],
                                          data['start_time'],data['end_time'],
                                          data['unpaid_break'],data['pay_type'],
                                          data['comment']
                                          )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/employee/timesheet-entrys/delete",methods=['POST'])
def delete_timesheet_entrys():
    """Deletes timesheet entry from a entry ID.
    
    Returns success status and error if present.
    """
    data_array=request.get_json()
    data_tuple=tuple(data_array.split(','))
    if len(data_tuple) == 1:
        data_tuple=data_tuple*2
    result=cpa_sql.delete_timesheet_entrys(data_tuple)
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/employee/timesheet-entrys/new",methods=['POST'])
def new_timesheet_entry():
    """Creates a new timesheet entry from received data using an executed
    method.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.new_timesheet_entry(data['username'],data['date'],
                                       data['start_time'],data['end_time'],
                                       data['unpaid_break'],data['pay_type'],
                                       data['comment']
                                       )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/timesheets",methods=['POST'])
def get_employee_timesheets():
    """Returns an array of managed employee timesheets from a
    manager username.
    """
    data=request.get_json()
    result=cpa_sql.get_employee_timesheets(data['username'])
    return jsonify(results=result)

@app.route("/employee/leave",methods=['POST'])
def get_employee_leave():
    """Returns employee's leave balance and active/upcoming leave requests.
    """
    data=request.get_json()
    result=cpa_sql.get_employee_leave(data['username'])
    return jsonify(leave_balance=str(result[0]),
                   leave_balance_hours=str(result[1]),
                   leave_entrys=result[2]
                   )

@app.route("/employee/leave/update",methods=['POST'])
def update_employee_leave():
    """Receives new data and executes method to update employee leave entry.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.update_employee_leave(data['leave_id'],data['leave_start_date'],
                                         data['leave_end_date'],data['leave_type']
                                         )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/employee/leave/new",methods=['POST'])
def new_employee_leave_entry():
    """Receives data and executes method to create new leave entry.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.new_employee_leave_entry(data['username'],data['leave_start_date'],
                                            data['leave_end_date'],data['leave_type']
                                            )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-leave",methods=['POST'])
def manager_employee_leave():
    """Returns an array of managed employee's leave entries,
    from a manager username.
    """
    data=request.get_json()
    result=cpa_sql.manager_employee_leave(data['username'])
    return jsonify(results=result)

@app.route("/manager/employee-leave/decline",methods=['POST'])
def manager_employee_leave_decline():
    """Action to update an employee's leave entry to declined
    status.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.manager_employee_leave_decline(data['leave_entry_id'])
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-leave/accept",methods=['POST'])
def manager_employee_leave_accept():
    """Action to update an employee's leave entry to accepted
    status.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.manager_employee_leave_accept(data['leave_entry_id'])
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/pay-run",methods=['POST'])
def pay_run_info():
    """Returns an array of manaaged employee payruns with summarised data,
    from a manager username.
    """
    data=request.get_json()
    result=cpa_sql.pay_run_info(data['username'])
    return jsonify(results=result)

@app.route("/manager/pay-run/execute/all",methods=['POST'])
def pay_run_execute_all():
    """Function to execute all active payruns for managed employees,
    from a manager username.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.pay_run_execute_all(data['username'])
    if result[0] == 'Failed':
        return jsonify(success=str(result[0]),error=str(result[1]))
    else:
        for id in result[0]:
            Payslip_Script.Payslip_Script(id)
        return jsonify(success='Success',error='n/a')
        
@app.route("/manager/employee-list/new",methods=['POST'])
def new_manager_employee():
    """Receives data from new-employee form and executes method to create
    a new employee account.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.new_manager_employee(data['password'],data['bank_account'],
                                        data['benefits'],data['child_support'],
                                        data['final_pay'],data['kiwisaver'],
                                        data['one_off_deduction'],data['pay_rate'],
                                        data['student_loan'],data['tax_credit'],
                                        data['tax_rate'],data['username'],
                                        data['weekly_allowance'],data['weekly_allowance_nontax'],
                                        data['ird_number'],data['tax_code'],
                                        data['manager']
                                        )
    return jsonify(success=str(result[0]),
                   error=str(result[1])
                   )

@app.route("/manager/pay-run/add-stat",methods=['POST'])
def add_new_stat_day():
    """Receives data from statutory-holiday form and execute function to
    create a new leave entry for the specified date.
    
    Default acceptance status is 'Accepted'.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.add_new_stat_day(data['username'],data['date'],data['stat_length'])
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/pay-run/execute/selected",methods=['POST'])
def pay_run_execute_selected():
    """Executes payrun process for selected payruns.
    
    Receives list of tuples containing employee username and
    period end, as this is always unique.
    
    Returns success status and error if present.
    """
    data_array=request.get_json()
    list_of_tuples=[tuple(data.split(',')) for data in data_array]
    result=cpa_sql.pay_run_execute_selected(list_of_tuples)
    if result[0] == 'Failed':
        return jsonify(success=str(result[0]),error=str(result[1]))
    else:
        for id in result[0]:
            Payslip_Script.Payslip_Script(id)
        return jsonify(success='Success',error ='n/a')

@app.route("/auth/add",methods=['POST'])
def auth_add():
    """Adds authentication key and username to auth table.
    
    Clears all existing auth keys for given username.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.auth_add(data['username'],data['auth_key'])
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/auth/validate",methods=['POST'])
def auth_validate():
    """Validates received data against auth table to check for
    match.

    Returns success status, bool of auth match and error if present.
    """
    data=request.get_json()
    result=cpa_sql.auth_validate(data['username'],data['auth_key'])
    return jsonify(success=str(result[0]),error=str(result[1]),match=str(result[2]))

@app.route("/login/forgot",methods=['POST'])
def login_reset_match():
    """Receives email, check for a match of email to an account.
    
    Returns success status, bool of email match and error if present.
    """
    data=request.get_json()
    result=cpa_sql.login_reset_match(data['email'])
    if result[0]:
        code=''
        for x in range(0,6): code += str(random.randint(0,9))
        Password_Reset.Reset(result[1],data['email'],code)
        return jsonify(match=str(result[0]),username=str(result[1]), code=code)
    return jsonify(match=str(result[0]),username ='n/a',code='n/a')

@app.route("/login/reset",methods=['POST'])
def login_reset():
    """Recieves new data, executes a method to change password
    using username as filter.
    
    Returns success status and error if present.
    """
    data=request.get_json()
    result=cpa_sql.login_reset(data['username'],data['password'],)
    return jsonify(success=str(result[0]),error=str(result[1]))

if __name__ == "__main__":
    app.run(debug=True)
