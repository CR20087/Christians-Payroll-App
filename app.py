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
    """Default/Home page has aa basic rendered template"""
    return render_template('index.html')

@app.route("/login/<string:userName>/<string:password>")
def login_verify(userName:str,password:str):
    """Checks for login match.
    
    Returns bool of match, role of account, (employee specific) if account
    has been registered.
    """
    result=cpa_sql.login_verify(userName,password)
    return jsonify(match=str(result[0]),role=str(result[1]),setup=str(result[2]))

@app.route("/register/<string:userName>/<string:password>")
def register_check(userName:str,password:str):
    """Checks if an employee account is registered.
        
    Returns bool of whether a match was found, bool of if account is 'setup'"""
    result=cpa_sql.register_check(userName,password)
    return jsonify(match=str(result[0]),config=str(result[1]))

@app.route("/registerAccount/<string:username>/<string:firstname>/<string:lastname>/<string:email>/<string:address>/<string:suburb>/<string:postcode>/<string:phone>")
def register_account(username:str,firstname:str,
                     lastname:str,email:str,
                     address:str,suburb:str,
                     postcode:str,phone:str
                     ):
    """Receives data, executes function to register employee account.
    
    Returns success status and error if present.
    """
    result=cpa_sql.register_account(username,firstname,
                                    lastname,email,
                                    address,suburb,
                                    postcode,phone
                                    )
    return jsonify(success=str(result[0]),error=str(result[1])) 

@app.route("/settings/manager/<string:userName>")
def get_manager_settings(userName:str):
    """Returns managers settings from a username"""
    result=cpa_sql.get_manager_settings(userName)
    return jsonify(userName=str(result[0]),password=str(result[1]),
                   firstName=str(result[2]),lastName=str(result[3]),
                   email=str(result[4]),address=str(result[5]),
                   suburb=str(result[6]),contactMethod=str(result[7]),
                   businessName=str(result[8]),entityName=str(result[9]),
                   phone=str(result[10])
                   )

@app.route("/settings/manager/update/<string:username_old>/<string:username>/<string:password>/<string:firstName>/<string:lastName>/<string:email>/<string:phone>/<string:address>/<string:suburb>/<string:contact_method>/<string:business_name>/<string:entity_name>")
def update_manager_settings(username_old:str,username:str,
                            password:str,firstName:str,
                            lastName:str,email:str,
                            phone:str,address:str,suburb:str,
                            contact_method:str,business_name:str,
                            entity_name:str
                            ):
    """Recieves data to update managers settings.
    
    Returns success status and error if present.
    """
    result=cpa_sql.update_manager_settings(username_old,username,
                                           password,firstName,
                                           lastName,email,
                                           phone,address,
                                           suburb,contact_method,
                                           business_name,entity_name
                                           )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/registerAccount/manager/<string:userName>/<string:password>/<string:firstName>/<string:lastName>/<string:email>/<string:address>/<string:suburb>/<string:businessName>/<string:phone>/<string:entityName>/<string:contactMethod>")
def create_manager(userName:str,password:str,
                   firstName:str,lastName:str,
                   email:str,address:str,
                   suburb:str,businessName:str,
                   phone:str,entityName:str,
                   contactMethod:str
                   ):
    """Receives data and executes method to create new
    manager account.
    
    Returns success status and error if present.
    """
    result=cpa_sql.create_manager(userName,password,
                                  firstName,lastName,
                                  email,phone,
                                  address,suburb,
                                  contactMethod,businessName,
                                  entityName)
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/settings/employee/<string:username>")
def get_employee_settings(username:str):
    """Returns employee settings from username"""
    result=cpa_sql.get_employee_settings(username)
    return jsonify(userName=str(result[0]),password=str(result[1]),
                   firstName=str(result[2]),lastName=str(result[3]),
                   email=str(result[4]),address=str(result[5]),
                   suburb=str(result[6]),postCode=str(result[7]),
                   phone=str(result[8])
                   )

@app.route("/settings/employee/update/<string:username_old>/<string:username>/<string:password>/<string:firstname>/<string:lastname>/<string:email>/<string:phone>/<string:address>/<string:suburb>/<string:postcode>")
def update_employee_settings(username_old:str,username:str,
                             password:str,firstname:str,
                             lastname:str,email:str,
                             phone:str,address:str,
                             suburb:str,postcode:str
                             ):
    """Receives new data and executes method to update
    employee settings.
    
    Returns success status and error if present.
    """
    result=cpa_sql.update_employee_settings(username_old,username,
                                            password,firstname,
                                            lastname,email,
                                            phone,address,
                                            suburb,postcode
                                            )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-list/<string:username>")
def get_manager_employees(username:str):
    """Returns a list of managed employees and their setting from
    username.
    """
    result=cpa_sql.get_manager_employees(username)
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

@app.route("/manager/employee-list/update/<string:bank_account>/<string:benefits>/<string:child_support>/<string:email>/<string:final_pay>/<string:first_name>/<string:kiwisaver>/<string:last_name>/<string:one_off_deduction>/<string:pay_rate>/<string:phone>/<string:student_loan>/<string:tax_credit>/<string:tax_rate>/<string:username>/<string:username_old>/<string:weekly_allowance>/<string:weekly_allowance_nontax>/<string:ird_number>/<string:tax_code>")
def update_manager_employee_list(bank_account:str,benefits:str,
                                 child_support:str,email:str,
                                 final_pay:str,first_name:str,
                                 kiwisaver:str,last_name:str,
                                 one_off_deduction:str,pay_rate:str,
                                 phone:str,student_loan:str,
                                 tax_credit:str,tax_rate:str,
                                 username:str,username_old:str,
                                 weekly_allowance:str,weekly_allowance_nontax:str,
                                 ird_number:str,tax_code:str
                                 ):
    """Updates an employee with received data through an executed method.
    
    Returns success status and error if present.
    """
    result=cpa_sql.update_manager_employee_list(bank_account,benefits,
                                                child_support,email,
                                                final_pay,first_name,
                                                kiwisaver,last_name,
                                                one_off_deduction,pay_rate,
                                                phone,student_loan,tax_credit,
                                                tax_rate,username,
                                                username_old,weekly_allowance,
                                                weekly_allowance_nontax,ird_number,
                                                tax_code
                                                )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/employee/timesheet/<string:userName>")
def get_timesheet(userName:str):
    """Returns list of current and active employee timesheet from a username.
    """
    result=cpa_sql.get_timesheet(userName)
    return jsonify(results=result[0],
                   entry_start_date=result[1],
                   entry_end_date=result[2]
                   )

@app.route("/employee/timesheet-entrys/<string:username>/<string:startdate>/<string:enddate>")
def get_timesheet_entry(username:str,startdate:str,enddate:str):
    """Returns a list of employee timesheet entrys during the start/end of the
    active timesheet period.
    """
    result=cpa_sql.get_timesheet_entry(username,startdate,enddate)
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

@app.route("/employee/timesheet-entrys/update/<string:timesheet_entry_id>/<string:date>/<string:start_time>/<string:end_time>/<string:unpaid_break>/<string:pay_type>/<string:comment>")
def update_timesheet_entry(timesheet_entry_id:str,date:str,
                           start_time:str,end_time:str,
                           unpaid_break:str,pay_type:str,
                           comment:str
                           ):
    """Receives new data, executes method to update relevant timesheet entry.
    
    Returns success status and error if present.
    """
    result=cpa_sql.update_timesheet_entry(timesheet_entry_id,date,
                                          start_time,end_time,
                                          unpaid_break,pay_type,
                                          comment
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

@app.route("/employee/timesheet-entrys/new/<string:username>/<string:date>/<string:start_time>/<string:end_time>/<string:unpaid_break>/<string:pay_type>/<string:comment>")
def new_timesheet_entry(username:str,date:str,
                        start_time:str,end_time:str,
                        unpaid_break:str,pay_type:str,
                        comment:str
                        ):
    """Creates a new timesheet entry from received data using an executed
    method.
    
    Returns success status and error if present.
    """
    result=cpa_sql.new_timesheet_entry(username,date,
                                       start_time,end_time,
                                       unpaid_break,pay_type,
                                       comment
                                       )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/timesheets/<string:username>")
def get_employee_timesheets(username:str):
    """Returns an array of managed employee timesheets from a
    manager username.
    """
    result=cpa_sql.get_employee_timesheets(username)
    return jsonify(results=result)

@app.route("/employee/leave/<string:username>")
def get_employee_leave(username:str):
    """Returns employee's leave balance and active/upcoming leave requests.
    """
    result=cpa_sql.get_employee_leave(username)
    return jsonify(leave_balance=str(result[0]),
                   leave_balance_hours=str(result[1]),
                   leave_entrys=result[2]
                   )

@app.route("/employee/leave/update/<string:leave_id>/<string:leave_start_date>/<string:leave_end_date>/<string:leave_type>")
def update_employee_leave(leave_id:str,leave_start_date:str,
                          leave_end_date:str,leave_type:str
                          ):
    """Receives new data and executes method to update employee leave entry.
    
    Returns success status and error if present.
    """
    result=cpa_sql.update_employee_leave(leave_id,leave_start_date,
                                         leave_end_date,leave_type
                                         )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/employee/leave/new/<string:username>/<string:leave_start_date>/<string:leave_end_date>/<string:leave_type>")
def new_employee_leave_entry(username:str,leave_start_date:str,
                             leave_end_date:str,leave_type:str
                             ):
    """Receives data nd executes method to create new leave entry.
    
    Returns success status and error if present.
    """
    result=cpa_sql.new_employee_leave_entry(username,leave_start_date,
                                            leave_end_date,leave_type
                                            )
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-leave/<string:username>")
def manager_employee_leave(username:str):
    """Returns an array of managed employee's leave entries,
    from a manager username.
    """
    result=cpa_sql.manager_employee_leave(username)
    return jsonify(results=result)

@app.route("/manager/employee-leave/decline/<string:leave_entry_id>")
def manager_employee_leave_decline(leave_entry_id:str):
    """Action to update an employee's leave entry to declined
    status.
    
    Returns success status and error if present.
    """
    result=cpa_sql.manager_employee_leave_decline(leave_entry_id)
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/employee-leave/accept/<string:leave_entry_id>")
def manager_employee_leave_accept(leave_entry_id:str):
    """Action to update an employee's leave entry to accepted
    status.
    
    Returns success status and error if present.
    """
    result=cpa_sql.manager_employee_leave_accept(leave_entry_id)
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/manager/pay-run/<string:username>")
def pay_run_info(username:str):
    """Returns an array of manaaged employee payruns with summarised data,
    from a manager username.
    """
    result=cpa_sql.pay_run_info(username)
    return jsonify(results=result)

@app.route("/manager/pay-run/execute/all/<string:username>")
def pay_run_execute_all(username:str):
    """Function to execute all active payruns for managed employees,
    from a manager username.
    
    Returns success status and error if present."""
    result=cpa_sql.pay_run_execute_all(username)
    if result[0] == 'Failed':
        return jsonify(success=str(result[0]),error=str(result[1]))
    else:
        for id in result[0]:
            Payslip_Script.Payslip_Script(id)
        return jsonify(success='Success',error='n/a')
        
@app.route("/manager/employee-list/new/<string:bank_account>/<string:benefits>/<string:child_support>/<string:final_pay>/<string:kiwisaver>/<string:one_off_deduction>/<string:pay_rate>/<string:student_loan>/<string:tax_credit>/<string:tax_rate>/<string:username>/<string:weekly_allowance>/<string:weekly_allowance_nontax>/<string:ird_number>/<string:tax_code>/<string:manager>")
def new_manager_employee(bank_account:str,benefits:str,
                         child_support:str,final_pay:str,
                         kiwisaver:str,one_off_deduction:str,
                         pay_rate:str,student_loan:str,
                         tax_credit:str,tax_rate:str,
                         username:str,weekly_allowance:str,
                         weekly_allowance_nontax:str,ird_number:str,
                         tax_code:str,manager:str
                         ):
    """Receives data from new-employee form and executes method to create
    a new employee account.
    
    Returns success status,temporary password for account and error if present.
    """
    string=list('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    random.shuffle(string)
    password_string=''.join(string)[:9]
    result=cpa_sql.new_manager_employee(password_string,bank_account,
                                        benefits,child_support,
                                        final_pay,kiwisaver,
                                        one_off_deduction,pay_rate,
                                        student_loan,tax_credit,
                                        tax_rate,username,
                                        weekly_allowance,weekly_allowance_nontax,
                                        ird_number,tax_code,
                                        manager
                                        )
    return jsonify(success=str(result[0]),
                   error=str(result[1]),
                   password=str(result[2])
                   )

@app.route("/manager/pay-run/add-stat/<string:username>/<string:date>/<string:stat_length>")
def add_new_stat_day(username:str,date:str,stat_length:str):
    """Receives data from statutory-holiday form and execute function to
    create a new leave entry for the specified date.
    
    Default acceptance status is 'Accepted'.
    
    Returns success status and error if present.
    """
    result=cpa_sql.add_new_stat_day(username,date,stat_length)
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

@app.route("/auth/add/<string:username>/<string:auth_key>")
def auth_add(username:str,auth_key:str):
    """Adds authentication key and username to auth table.
    
    Clears all existing auth keys for given username.
    
    Returns success status and error if present.
    """
    result=cpa_sql.auth_add(username,auth_key)
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/auth/validate/<string:username>/<string:auth_key>")
def auth_validate(username:str,auth_key:str):
    """Validates received data against auth table to check for
    match.

    Returns success status, bool of auth match and error if present.
    """
    result=cpa_sql.auth_validate(username,auth_key)
    return jsonify(success=str(result[0]),error=str(result[1]),match=str(result[2]))

@app.route("/login/forgot/<string:email>")
def login_reset_match(email:str):
    """Receives email, check for a match of email to an account.
    
    Returns success status, bool of email match and error if present.
    """
    result=cpa_sql.login_reset_match(email)
    if result[0]:
        code=''
        for x in range(0,6): code += str(random.randint(0,9))
        Password_Reset.Reset(result[1],email,code)
        return jsonify(match=str(result[0]),username=str(result[1]), code=code)
    return jsonify(match=str(result[0]),username ='n/a',code='n/a')

@app.route("/login/reset/<string:username>/<string:password>")
def login_reset(username:str,password:str):
    """Recieves new data, executes a method to change password
    using username as filter.
    
    Returns success status and error if present.
    """
    result=cpa_sql.login_reset(username,password)
    return jsonify(success=str(result[0]),error=str(result[1]))

@app.route("/testing/postmethod", methods=['POST'])
def pay_run_execute_selected():
    data_array = request.get_json()
    
    print('Data')
    print(data_array)
    print('object')
    print(data_array['test'])
    print('object2')
    print(data_array.test)

if __name__ == "__main__":
    app.run(debug=True)
