import pyodbc 
from dotenv import load_dotenv
import os

def init():
    """Inizializes connection to SQL Server"""
    load_dotenv()
    database='CPA'
    server=os.getenv('CPA_SQL_SERVER_ID')
    username=os.getenv('CPA_SQL_AUTH_ID')
    password=os.getenv('CPA_SQL_AUTH_KEY')
    driver='{ODBC Driver 18 for SQL Server}'        
    conn=pyodbc.connect('DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';ENCRYPT=yes;UID='+username+';PWD='+password)
    cur=conn.cursor()
    return cur

# Functions designed for each specific route to exeecute data actions

def login_verify(username):
    """Used to grab hashed paassword from database for a login username."""
    cur=init()
    cur.execute(f"""SELECT password,role FROM login 
                WHERE username = {username}
                COLLATE Latin1_General_CS_AS
                """)
    result=cur.fetchone()
    if result:
        cur.execute(f"""UPDATE login 
                    SET last_login = CURRENT_TIMESTAMP 
                    WHERE username = {username}
                    """)
        cur.commit()
        cur.execute(f"SELECT * FROM employee where username = {username}")
        setup=bool(cur.fetchone())
        cur.close()
        return [result[0],result[1],setup]
    else:
        cur.close()
        return [False,'n/a','n/a'] 
    
def register_check(username):
    """Used during login to check if an employee account is registered"""
    cur=init()
    cur.execute(f"""SELECT password FROM login 
                WHERE login.username = {username}
                COLLATE Latin1_General_CS_AS
                """)
    results=cur.fetchone()
    cur.execute(f"Select * FROM employee where username = {username}")
    config=bool(cur.fetchone())
    cur.close()
    return [results[0],config]

def register_account(username,firstname,lastname,email,address,suburb,postcode,phone):
    """Used during regsiter process to register a new employee account"""
    cur=init()
    try:
        cur.execute(f"""Insert into employee(
                    [username]
                    ,[first_name]
                    ,[last_name]
                    ,[email]
                    ,[address_1]
                    ,[address_2]
                    ,[post_code]
                    ,[phone]) 
                    VALUES
                    ({username},
                    {firstname},
                    {lastname},
                    {email},
                    {address},
                    {suburb},
                    {postcode},
                    {phone})
                    """)
        cur.execute(f"""Insert into leave_details(username) VALUES ({username})""")
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'


def email_payslip_details(username):
    """Retrieves email datails of an employee.
    
    Used in payslip process.
    """
    cur=init()
    cur.execute(f"""
                SELECT [employee_email]
                ,[employee_name]
                ,[manager_name]
                ,[manager_contact] FROM email_details
                WHERE username = '{username}'
                """)
    result=cur.fetchone()
    cur.close()
    return result

def get_manager_settings(username):
    """Retrieves manager setting for manager settings page"""
    cur=init()
    cur.execute(f"""
                SELECT [login].[username]
                ,[login].[password]
                ,[first_name]
                ,[last_name]
                ,[email]
                ,[business_address_1]
                ,[business_address_2]
                ,[contact_method]
                ,[business_name]
                ,[entity_name]
                ,[phone]
                FROM [dbo].[manager] 
                INNER JOIN login ON login.username = manager.username 
                WHERE [login].[username] = '{username}'
                """)
    result=cur.fetchone()
    cur.close()

    return result

def update_manager_settings(username_old,username,password,
                            firstname,lastname,email,
                            phone,address,suburb,
                            contact_method,business_name,entity_name
                            ):
    """Updates manager settings using new infomration from settings form"""
    cur=init()
    try:
        cur.execute(f"""Update login
                    SET username = {username},
                    password = {password}
                    WHERE username = '{username_old}'
                    """)
        cur.execute(f"""Update manager
                    SET first_name={firstname}
                    ,last_name = {lastname}
                    ,email = {email}
                    ,phone = {phone}
                    ,contact_method = {contact_method}
                    ,business_name = {business_name}
                    ,entity_name = {entity_name}
                    ,business_address_1 = {address}
                    ,business_address_2 = {suburb} 
                    WHERE username = '{username_old}'
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def create_manager(username,password,firstname,
                   lastname,email,phone,
                   address,suburb,contact_method,
                   business_name,entity_name
                   ):
    """Creates a new manager account.
    
    Used during Manager register process.
    """
    cur=init()
    try:
        cur.execute(f"""INSERT INTO login(
                    username,
                    password,
                    created_on,
                    role )
                    VALUES
                    ( {username},
                    {password},
                    current_timestamp,
                    'manager' )
                    """)
        cur.execute(f"""INSERT INTO manager(
                    username
                    ,first_name
                    ,last_name 
                    ,email 
                    ,phone 
                    ,contact_method 
                    ,business_name 
                    ,entity_name 
                    ,business_address_1 
                    ,business_address_2 )
                    VALUES
                    ( {username}
                    ,{firstname}
                    ,{lastname}
                    ,{email}
                    ,{phone}
                    ,{contact_method}
                    ,{business_name}
                    ,{entity_name}
                    ,{address}
                    ,{suburb} )
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def get_employee_settings(username):
    """Retreives employee settings for employee settings page"""
    cur=init()
    cur.execute(f"""
                SELECT [login].[username]
                ,[login].[password]
                ,[first_name]
                ,[last_name]
                ,[email]
                ,[address_1]
                ,[address_2]
                ,[post_code]
                ,[phone]
                FROM [dbo].[employee] 
                INNER JOIN login ON login.username = employee.username 
                WHERE [login].[username] = '{username}'
                """)
    result=cur.fetchone()
    cur.close()
    return result

def update_employee_settings(username_old,username,password,
                            firstname,lastname,email,
                            phone,address,suburb,postcode
                            ):
    """Updates employee settings using infomration from employee
    settings form.
    """
    cur=init()
    try:
        cur.execute(f"""Update login
                    SET username = {username}
                    ,password = {password}
                    WHERE username = '{username_old}'
                    """)
        cur.execute(f"""Update employee
                    SET first_name={firstname}
                    ,last_name = {lastname}
                    ,email = {email}
                    ,phone = {phone}
                    ,post_code = {postcode}
                    ,address_1 = {address}
                    ,address_2 = {suburb}
                    WHERE username = '{username_old}'
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def get_manager_employees(username):
    """Retreives list of employees managed by a manager account and
    their pay details and contact information.
    """
    cur=init()
    cur.execute(f""" SELECT [username]
                ,[first_name]
                ,[last_name]
                ,[phone]
                ,[email]
                ,[pay_rate]
                ,[bank_account]
                ,[ird_number]
                ,[tax_code]
                ,[kiwisaver]
                ,[student_loan]
                ,[one_off_deduction]
                ,[tax_rate]
                ,[final_pay]
                ,[weekly_allowance]
                ,[weekly_allowance_nontax]
                ,[year_to_date]
                ,[child_support]
                ,[tax_credit]
                ,[benefits]
                ,[created_on]
                FROM [manager_employee_list] 
                WHERE manager = '{username}'
                """)
    result=cur.fetchall()
    cur.close()
    return result

def update_manager_employee_list(bank_account,benefits,child_support,
                                 email,final_pay,first_name,kiwisaver,
                                 last_name,one_off_deduction,pay_rate,
                                 phone,student_loan,tax_credit,tax_rate,
                                 username,username_old,weekly_allowance,
                                 weekly_allowance_nontax,ird_number,tax_code
                                 ):
    """Updates an employees settings, changed by a manager."""
    cur=init()
    try:
        cur.execute(f"""Update login
                    SET username = {username}
                    WHERE username = {username_old}
                    """)
        cur.execute(f"""Update pay_details
                    SET bank_account = {bank_account}
                    ,benefits = {benefits}
                    ,child_support = {child_support}
                    ,final_pay = {final_pay}
                    ,kiwisaver = {kiwisaver}
                    ,one_off_deduction = {one_off_deduction}
                    ,pay_rate = {pay_rate}
                    ,student_loan = {student_loan}
                    ,tax_credit = {tax_credit}
                    ,tax_rate = {tax_rate}
                    ,weekly_allowance = {weekly_allowance}
                    ,weekly_allowance_nontax = {weekly_allowance_nontax}
                    ,ird_number = {ird_number}
                    ,tax_code = {tax_code}
                    WHERE username = {username_old}
                    """)
        cur.execute(f"""Update employee
                    SET email = {email}
                    ,first_name = {first_name}
                    ,last_name = {last_name}
                    ,phone = {phone}             
                    WHERE username = {username_old}
                    """)
        cur.commit()
        cur.close()
    except Exception as E:
        cur.close()
        return 'Failed',E
    return 'Success','n/a'

def get_timesheet(username):
    """Retrieves all current and active timesheets for employees."""
    cur=init()
    cur.execute(f"""SELECT [WeekStartDate]
                ,[WeekEndDate]
                ,[monday_hours_worked]
                ,[tuesday_hours_worked]
                ,[wednesday_hours_worked]
                ,[thursday_hours_worked]
                ,[friday_hours_worked]
                ,[saturday_hours_worked]
                ,[sunday_hours_worked]
                ,[total_hours_worked]
                FROM [dbo].[timesheet]
                WHERE username = '{username}' AND completed = 'false' 
                ORDER BY WeekStartDate DESC
                """)
    res=cur.fetchall()
    cur.execute(f"""SELECT [WeekStartDate] 
                FROM [dbo].[timesheet]
                WHERE username = '{username}' AND completed = 'false' 
                ORDER BY WeekStartDate ASC
                """)
    try: 
        start_date=cur.fetchone()[0].__str__() 
    except:
        start_date='' 
    cur.execute(f"""SELECT [WeekEndDate] 
                FROM [dbo].[timesheet]
                WHERE username = '{username}' AND completed = 'false'
                ORDER BY WeekEndDate DESC
                """)
    try: 
        end_date=cur.fetchone()[0].__str__() 
    except:
        end_date=''
    cur.close()
    response=[]
    for sheet in res:
        dict_sheet={'period_start':sheet[0].strftime('%a, %d %b'),
                      'period_end':sheet[1].strftime('%a, %d %b'),
                      'monday_hours_worked':sheet[2],
                      'tuesday_hours_worked':sheet[3],
                      'wednesday_hours_worked':sheet[4],
                      'thursday_hours_worked':sheet[5],
                      'friday_hours_worked':sheet[6],
                      'saturday_hours_worked':sheet[7],
                      'sunday_hours_worked':sheet[8],
                      'total_hours_worked':sheet[9]
                      }
        response.append(dict_sheet)
    return response,start_date,end_date

def get_timesheet_entry(username,start_date,end_date):
    """Retrieves all current/active timesheet entries related to timesheets."""
    cur=init()
    cur.execute(f"""SELECT [timesheet_entry_id]
                ,[date]
                ,[start_time]
                ,[end_time]
                ,[unpaid_break]
                ,[pay_type]
                ,[comments]
                FROM [dbo].[timesheet_entry]
                WHERE username = '{username}' 
                AND date >= {start_date} 
                AND date <= {end_date} 
                AND completed = 'false'
                """)
    result=cur.fetchall()
    cur.close()
    return result

def update_timesheet_entry(timesheet_entry_id,date,start_time,
                           end_time,unpaid_break,pay_type,
                           comment
                           ):
    """Updates an active timesheet entry"""
    cur=init()
    try:
        cur.execute(f"""Update timesheet_entry SET 
                    date = {date},
                    start_time = {start_time},
                    end_time = {end_time},
                    unpaid_break = {unpaid_break},
                    pay_type = {pay_type},
                    comments = {comment}
                    WHERE timesheet_entry_id = {timesheet_entry_id}
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def delete_timesheet_entrys(entrys):
    """Delete an active timesheet entry"""
    cur=init()
    try:
        cur.execute(f"""Delete From timesheet_entry 
                    WHERE timesheet_entry_id in {entrys}
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def new_timesheet_entry(username,date,start_time,
                        end_time,unpaid_break,pay_type,
                        comment
                        ):
    """Creates a new timesheet entry"""
    cur=init()
    try:
        cur.execute(f"""INSERT INTO timesheet_entry(
                    username
                    ,date
                    ,start_time
                    ,end_time
                    ,unpaid_break
                    ,pay_type
                    ,comments )
                    VALUES
                    ( '{username}',
                    {date},
                    {start_time},
                    {end_time},
                    {unpaid_break},
                    {pay_type},
                    {comment} )
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def get_employee_timesheets(username):
    """Used by manager timesheet view page, to view all active
    employee timesheets."""
    cur=init()
    class employee_Timesheet() :
        def __init__(self,sheet):
            self.WeekStartDate=sheet[0].strftime('%a, %d %b')
            self.WeekEndDate=sheet[1].strftime('%a, %d %b')
            self.monday_hours_worked=sheet[2]
            self.tuesday_hours_worked=sheet[3]
            self.wednesday_hours_worked=sheet[4]
            self.thursday_hours_worked=sheet[5]
            self.friday_hours_worked=sheet[6]
            self.saturday_hours_worked=sheet[7]
            self.sunday_hours_worked=sheet[8]
            self.total_hours_worked=sheet[9]
            self.total_unpaid_break=sheet[10]
            self.username=sheet[11]
            self.timesheet_entrys=sheet[12]
        def string(self):
            return {'WeekStartDate':self.WeekStartDate,
                    'WeekEndDate':self.WeekEndDate,
                    'monday_hours_worked':self.monday_hours_worked,
                    'tuesday_hours_worked':self.tuesday_hours_worked,
                    'wednesday_hours_worked':self.wednesday_hours_worked,
                    'thursday_hours_worked':self.thursday_hours_worked,
                    'friday_hours_worked':self.friday_hours_worked,
                    'saturday_hours_worked':self.saturday_hours_worked,
                    'sunday_hours_worked':self.sunday_hours_worked,
                    'total_hours_worked':self.total_hours_worked,
                    'total_unpaid_break':self.total_unpaid_break,
                    'username':self.username,
                    'timesheet_entrys':self.timesheet_entrys
                    }
    class employee_timesheet_entry():
        def __init__(self,entry):
            self.timesheet_entry_id=entry[0]
            self.date=entry[1].strftime('%a, %d %b')
            self.start_time=entry[2].__str__()
            self.end_time=entry[3].__str__()
            self.unpaid_break=entry[4].__str__()
            self.pay_type=entry[5]
            self.comment=entry[6]
        def string(self):
            return {'timesheet_entry_id': self.timesheet_entry_id,
                    'date':self.date,
                    'start_time':self.start_time,
                    'end_time':self.end_time,
                    'unpaid_break':self.unpaid_break,
                    'pay_type':self.pay_type,
                    'comments':self.comment
                    }
    timesheet_response=[]
    cur.execute(f"""SELECT [employee] 
                FROM employee_manager
                WHERE [manager] = '{username}'
                """)
    employee_usernames=cur.fetchall()
    for emp in employee_usernames:
        try:
            cur.execute(f"""SELECT TOP (1) [WeekStartDate]
                        ,[WeekEndDate]
                        ,[monday_hours_worked]
                        ,[tuesday_hours_worked]
                        ,[wednesday_hours_worked]
                        ,[thursday_hours_worked]
                        ,[friday_hours_worked]
                        ,[saturday_hours_worked]
                        ,[sunday_hours_worked]
                        ,[total_hours_worked]
                        ,[total_unpaid_break]
                        ,[username]
                        FROM [dbo].[timesheet]
                        WHERE username = '{emp[0]}'
                        ORDER BY WeekStartDate ASC
                        """)
            timesheet=cur.fetchone()
            cur.execute(f"""SELECT TOP(1) [timesheet_entry_id]
                        ,[date]
                        ,[start_time]
                        ,[end_time]
                        ,[unpaid_break]
                        ,[pay_type]
                        ,[comments]
                        FROM [timesheet_entry]
                        Where [date] >= '{timesheet[0].__str__()}' 
                        AND date <= '{timesheet[1].__str__()}'
                        AND username = '{emp[0]}'
                        """)
            timesheet_entrys=cur.fetchall()
            entry_list=[]
            for entry in timesheet_entrys:
                classed=employee_timesheet_entry(entry)
                entry_list.append(classed.string())
            timesheet=list(timesheet)
            timesheet.append(entry_list)
            timesheet_classed=employee_Timesheet(timesheet)
            timesheet_response.append(timesheet_classed.string())
        except:
            continue
    cur.close()
    return timesheet_response

def get_employee_leave(username):
    """Used for employee leave page to view leave balances and active leave
    requests
    """
    cur=init()
    cur.execute(f"""SELECT [leave_balance]
                ,[leave_balance_hours]
                FROM [leave_details]
                WHERE username = '{username}'
                """)
    details=list(cur.fetchone())
    cur.execute(f"""SELECT [leave_entry_id]
                ,[leave_start_date]
                ,[leave_end_date]
                ,[leave_type]
                ,[status]
                FROM [dbo].[leave_entry]
                WHERE username = '{username}'
                AND leave_end_date >= CURRENT_TIMESTAMP
                """)
    entrys=cur.fetchall()
    dict_entrys=[]
    for ent in entrys:
        dict_entrys.append({'leave_entry_id':ent[0],
                            'leave_start_date':ent[1].__str__(),
                            'leave_end_date':ent[2].__str__(),
                            'leave_type':ent[3],
                            'status':ent[4].capitalize()
                            })
    details.append(dict_entrys)
    cur.close()
    return details

def update_employee_leave(leave_id,leave_start,leave_end,leave_type):
    """Update an active employee leave entry"""
    cur=init()
    try:
        cur.execute(f"""Update leave_entry SET
                    [leave_start_date] = {leave_start}
                    ,[leave_end_date] = {leave_end}
                    ,[leave_type] = {leave_type}
                    WHERE leave_entry_id = {leave_id}
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def new_employee_leave_entry(username,leave_start,leave_end,leave_type):
    """Create a new employee leave entry"""
    cur=init()
    try:
        cur.execute(f"""INSERT INTO leave_entry(
                    [username]
                    ,[leave_start_date]
                    ,[leave_end_date]
                    ,[leave_type] )
                    VALUES
                    ( '{username}'
                    ,{leave_start}
                    ,{leave_end}
                    ,{leave_type} )
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def manager_employee_leave(username):
    """Used by manager leave page to view all active or upcoming
    leave entrys.
    """
    cur=init()
    cur.execute(f"""SELECT [username]
                ,[leave_entry_id]
                ,[leave_start_date]
                ,[leave_end_date]
                ,[leave_type]
                ,[status]
                FROM [dbo].[leave_entry]
                INNER JOIN employee_manager ON leave_entry.username = employee_manager.employee
                WHERE manager = '{username}' AND leave_end_date >= CURRENT_TIMESTAMP
                """)
    entrys=cur.fetchall()
    response=[]
    for entry in entrys:
        dict_entry={'username':entry[0],
                      'leave_entry_id':entry[1],
                      'leave_start_date':entry[2].strftime('%a, %d %b'),
                      'leave_end_date':entry[3].strftime('%a, %d %b'),
                      'leave_type':entry[4],
                      'status':entry[5]
                      }
        response.append(dict_entry)
    cur.close()
    return response

def manager_employee_leave_accept(entry_id):
    """Manager action to accept a leave entry"""
    cur=init()
    try:
        cur.execute(f"""UPDATE leave_entry SET status = 'Approved' 
                    WHERE leave_entry_id = {entry_id}
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def manager_employee_leave_decline(entry_id):
    """Manager action to decline a leave entry"""
    cur=init()
    try:
        cur.execute(f"""UPDATE leave_entry SET status = 'Declined' 
                    WHERE leave_entry_id = {entry_id}
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def pay_run_info(username):
    """Used by manager pay run page to retrieve summarised totals of
    a upcoming pay run per payslip."""
    cur=init()
    cur.execute(f"""SELECT [name]
                ,[WeekStartDate]
                ,[WeekEndDate]
                ,[total_hours_worked]
                ,[pay_rate]
                ,[leave_taken]
                ,[days]
                ,[gross_pay]
                ,[one_off_deduction]
                ,[total_deductions]
                ,[net_pay]
                ,[username]
                From pay_run_info
                WHERE manager = '{username}'
                """)
    info=cur.fetchall()
    response=[]
    for entry in info:
        dict_entry={'name':entry[0],
                      'pay_period_start':entry[1].__str__(),
                      'pay_period_end':entry[2].__str__(),
                      'total_hours':str(entry[3]),
                      'pay_rate':str(entry[4]),
                      'leave_taken':entry[5],
                      'leave_days':entry[6],
                      'gross_pay':str(entry[7]),
                      'one_off_deduction':str(entry[8]),
                      'total_deductions':str(entry[9]),
                      'net_pay':str(entry[10]),
                      'username':entry[11]
                      }
        response.append(dict_entry)
    cur.close()
    return response

def pay_run_execute_all(username):
    """Manager action to execute pay runs for all active payslips."""
    cur=init()
    try:
        cur.execute(f"""SELECT [username]
                    ,[WeekStartDate]
                    ,[WeekEndDate]
                    ,[total_hours_worked]
                    ,[pay_rate]
                    ,[pay_type]
                    ,[pay_amount]
                    ,[pay_and_leave]
                    ,[leave_taken]
                    ,[days]
                    ,[leave_pay]
                    ,[gross_pay]
                    ,[one_off_deduction]
                    ,[total_deductions]
                    ,[net_pay]
                    ,[kiwisaver_total]
                    ,[student_loan_total]
                    ,[final_pay]
                    ,[paye]
                    ,[weekly_allowance]
                    ,[weekly_allowance_nontax]
                    ,[year_to_date]
                    ,[child_support]
                    ,[tax_credit]
                    ,[benefits] FROM [dbo].[pay_run_info]\
                    WHERE manager = '{username}'
                    """)
        payslip_data=cur.fetchall()
        payslip_ids=[]
        for payslip in payslip_data:
            cur.execute(f"""INSERT INTO payslips(
                        [username]
                        ,[pay_period_start]
                        ,[pay_period_end]
                        ,[total_hours_worked]
                        ,[pay_rate]
                        ,[pay_type]
                        ,[pay_amount]
                        ,[pay_and_leave]
                        ,[leave_taken]
                        ,[leave_days]
                        ,[leave_pay]
                        ,[gross_pay]
                        ,[one_off_deduction]
                        ,[total_deductions]
                        ,[net_pay]
                        ,[kiwisaver]
                        ,[student_loan]
                        ,[final_pay]
                        ,[paye]
                        ,[weekly_allowance]
                        ,[weekly_allowance_nontax]
                        ,[year_to_date]
                        ,[child_support]
                        ,[tax_credit]
                        ,[benefits]
                        ,[pay_date] )
                        VALUES 
                        ( '{payslip[0]}',
                        '{payslip[1].isoformat()}',
                        '{payslip[2].isoformat()}',
                        {payslip[3]},
                        {payslip[4]},
                        '{payslip[5]}',
                        {payslip[6]},
                        {payslip[7]},
                        '{payslip[8]}',
                        {payslip[9]},
                        {payslip[10]},
                        {payslip[11]},
                        {payslip[12]},
                        {payslip[13]},
                        {payslip[14]},
                        {payslip[15]},
                        {payslip[16]},
                        {payslip[17]},
                        {payslip[18]},
                        {payslip[19]},
                        {payslip[20]},
                        {payslip[21]},
                        {payslip[22]},
                        {payslip[23]},
                        {payslip[24]},
                        CURRENT_TIMESTAMP )
                        """)
            cur.execute("Select SCOPE_IDENTITY()")
            payslip_ids.append(cur.fetchone()[0])
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return payslip_ids,'n/a'

def get_payslip_data(id):
    """Used during payslip process to retrieve all data used in payslip.
    
    Fetches data using a payslip ID as the filter.
    """
    cur=init()
    cur.execute(f"""SELECT TOP (1000) [username]
                ,[entity_name]
                ,[business_name]
                ,[business_address_1]
                ,[business_address_2]
                ,[last_name]
                ,[first_name]
                ,[initials]
                ,[address_1]
                ,[address_2]
                ,[post_code]
                ,[bank_account]
                ,[tax_code]
                ,[ird_number]
                ,[pay_type]
                ,[pay_rate]
                ,[total_hours_worked]
                ,[pay_amount]
                ,[pay_period_end]
                ,[pay_date]
                ,[total_hours]
                ,[total_pay_amount]
                ,[leave_taken]
                ,[leave_balance]
                ,[leave_pay]
                ,[total_pay_and_leave]
                ,[weekly_allowance]
                ,[weekly_allowance_nontax]
                ,[one_off_deduction]
                ,[final_pay]
                ,[gross_pay]
                ,[kiwisaver]
                ,[year_to_date]
                ,[total_deductions]
                ,[paye]
                ,[student_loan]
                ,[child_support]
                ,[tax_credit]
                ,[net_pay]
                ,[benefits]
                FROM [dbo].[payslip_data] WHERE payslip_id = {id}
                """)
    results=cur.fetchone()
    cur.close()
    return results

def get_payslip_leave_entrys(period_end,username):
    """"Used during payslip process to get a list of leave entries of which are
     within the current payslip """
    cur=init()
    cur.execute(f"""SELECT [pay_amount]
                ,[days]
                ,[leave_hours]
                ,[leave_start_date]
                ,[leave_end_date]
                ,[leave_type]
                FROM [dbo].[leave_by_calendar_week]
                WHERE status = 'Approved' 
                AND WeekEndDate = '{period_end}' AND username = '{username}'
                """)
    results=cur.fetchall()
    cur.close()
    return results

def exit_payrun_update(id,bal,username):
    """Function is used to exit the payrun proceess per payslip.

    Completes actions such as updating leave balances, timesheet entries
    to either a new balance for leave, or a completed status for timesheet entries.
    """
    cur=init()
    cur.execute(f"""Select
                [pay_period_start],
                [pay_period_end]
                FROM payslips WHERE payslip_id = {id}
                """)
    period=cur.fetchone()
    cur.execute(f"""UPDATE timesheet_entry 
                SET completed = 'True' 
                WHERE username = '{username}' AND date 
                BETWEEN '{period[0].isoformat()}' AND '{period[1].isoformat()}'
                """)
    cur.execute(f"""SELECT 
                FORMAT(AVG(CAST(total_hours_worked AS DECIMAL(7,3)))*(CAST(leave_balance as decimal(18,2))),'0.00') AS avg_hours       
                FROM timesheet
                INNER JOIN leave_details on timesheet.username = leave_details.username
                WHERE timesheet.username = '{username}'
                GROUP BY timesheet.username,leave_balance
                """)
    hours_bal=cur.fetchone() 
    cur.execute(f"""UPDATE leave_details SET
                leave_balance = {bal},
                leave_balance_hours = {hours_bal[0]}
                Where username = '{username}'
                """)
    cur.commit()
    cur.close()

def new_manager_employee(password,bank_account,benefits,
                         child_support,final_pay,kiwisaver,
                         one_off_deduction,pay_rate,student_loan,
                         tax_credit,tax_rate,username,
                         weekly_allowance,weekly_allowance_nontax,ird_number,
                         tax_code,manager
                         ):
    """Create new employee account.
    
    Inserts into both login table and pay details table.
    """
    cur=init()
    try:
        cur.execute(f"""
                    Insert into login(username,password,created_on,role)
                    VALUES ( {username},
                    {password},
                    CURRENT_TIMESTAMP,
                    'employee' )
                    """)
        cur.execute(f"""
                    INSERT INTO pay_details(
                    username
                    ,bank_account
                    ,benefits
                    ,child_support
                    ,final_pay
                    ,kiwisaver
                    ,one_off_deduction
                    ,pay_rate
                    ,student_loan
                    ,tax_credit
                    ,tax_rate
                    ,weekly_allowance
                    ,weekly_allowance_nontax
                    ,ird_number
                    ,tax_code )
                    VALUES 
                    ( {username}
                    ,{bank_account}
                    ,cast({benefits} as decimal(18,2))
                    ,cast({child_support} as decimal(18,2))
                    ,cast({final_pay} as decimal(18,2))
                    ,cast({kiwisaver} as decimal(18,2))
                    ,cast({one_off_deduction} as decimal(18,2))
                    ,cast({pay_rate} as decimal(18,2))
                    ,cast({student_loan} as decimal(18,2))
                    ,cast({tax_credit} as decimal(18,2))
                    ,cast({tax_rate} as decimal(18,2))
                    ,cast({weekly_allowance} as decimal(18,2))
                    ,cast({weekly_allowance_nontax} as decimal(18,2))
                    ,{ird_number}
                    ,{tax_code} )
                    """)
        cur.execute(f"""INSERT INTO employee_manager(manager,employee)
                    VALUES ('{manager}',{username})""")
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e,'n/a'
    return 'Success','n/a',password

def add_new_stat_day(username,date,stat_length):
    """Add new statutory holiday, default status is approved"""
    cur=init()
    try:
        cur.execute(f"""
                    INSERT INTO leave_entry(
                    [username]
                    ,[leave_start_date]
                    ,[leave_end_date]
                    ,[leave_type]
                    ,[stat_hours]
                    ,[status] )
                    VALUES
                    ( {username}
                    ,{date}
                    ,{date}
                    ,'Statutory Holiday'
                    ,{stat_length}
                    ,'Approved' )
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a' 
    
def pay_run_execute_selected(data_array):
    """Data Array is a list of tuples with a username and week end date.
    
    Function grabs data in a select order and inserts it into a past payslip
    table.
    
    Completes this for all selected payslips and is returned for use by other
    processes.
    """
    cur=init()
    for i in data_array:
        try:
            cur.execute(f"""SELECT [username]
                        ,[WeekStartDate]
                        ,[WeekEndDate]
                        ,[total_hours_worked]
                        ,[pay_rate]
                        ,[pay_type]
                        ,[pay_amount]
                        ,[pay_and_leave]
                        ,[leave_taken]
                        ,[days]
                        ,[leave_pay]
                        ,[gross_pay]
                        ,[one_off_deduction]
                        ,[total_deductions]
                        ,[net_pay]
                        ,[kiwisaver_total]
                        ,[student_loan_total]
                        ,[final_pay]
                        ,[paye]
                        ,[weekly_allowance]
                        ,[weekly_allowance_nontax]
                        ,[year_to_date]
                        ,[child_support]
                        ,[tax_credit]
                        ,[benefits] 
                        FROM [dbo].[pay_run_info] 
                        WHERE username = '{i[0]}' AND WeekEndDate = '{i[1]}'
                        """)
            payslip_data=cur.fetchall()
            payslip_ids=[]
            for payslip in payslip_data:
                cur.execute(f"""
                            INSERT INTO payslips(
                            [username]
                            ,[pay_period_start]
                            ,[pay_period_end]
                            ,[total_hours_worked]
                            ,[pay_rate]
                            ,[pay_type]
                            ,[pay_amount]
                            ,[pay_and_leave]
                            ,[leave_taken]
                            ,[leave_days]
                            ,[leave_pay]
                            ,[gross_pay]
                            ,[one_off_deduction]
                            ,[total_deductions]
                            ,[net_pay]
                            ,[kiwisaver]
                            ,[student_loan]
                            ,[final_pay]
                            ,[paye]
                            ,[weekly_allowance]
                            ,[weekly_allowance_nontax]
                            ,[year_to_date]
                            ,[child_support]
                            ,[tax_credit]
                            ,[benefits]
                            ,[pay_date] )
                            VALUES 
                            ( '{payslip[0]}',
                            '{payslip[1].isoformat()}',
                            '{payslip[2].isoformat()}',
                            {payslip[3]},
                            {payslip[4]},
                            '{payslip[5]}',
                            {payslip[6]},
                            {payslip[7]},
                            '{payslip[8]}',
                            {payslip[9]},
                            {payslip[10]},
                            {payslip[11]},
                            {payslip[12]},
                            {payslip[13]},
                            {payslip[14]},
                            {payslip[15]},
                            {payslip[16]},
                            {payslip[17]},
                            {payslip[18]},
                            {payslip[19]},
                            {payslip[20]},
                            {payslip[21]},
                            {payslip[22]},
                            {payslip[23]},
                            {payslip[24]},
                            CURRENT_TIMESTAMP )
                            """)                
                cur.execute("Select SCOPE_IDENTITY()")            
                payslip_ids.append(cur.fetchone()[0])       
        except Exception as e:
            cur.close()
            return 'Failed',e
    cur.commit()
    cur.close()
    return payslip_ids,'n/a'

def login_reset_match(email):
    """Check to see if email exists and linked to account"""
    cur=init()
    cur.execute(f"""    
                Select
                username        
                from employee
                where email = '{email}'
                union
                select
                username                
                From manager
                Where email = '{email}'
                """)
    result=cur.fetchone()      
    cur.close()  
    if not result:
        return False
    return True,result[0]

def login_reset(username,password):
    """Update login password to new password using username for where clause"""
    cur=init()
    try:
        cur.execute(f"""
                    Update login set
                    password = {password}
                    Where username = {username}
                    """)
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a','false'
