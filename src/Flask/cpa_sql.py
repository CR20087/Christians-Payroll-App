import pyodbc 

def init():
    database = 'CPA'
    server = 'cpa-server.database.windows.net'
    username = 'CReid' 
    password = 'iKErTyTZupa789@' 
    driver='{ODBC Driver 18 for SQL Server}'
        
    conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';ENCRYPT=yes;UID='+username+';PWD='+ password)
    cur = conn.cursor()
    return cur

def payslip(username, date):
    ID = f"WHERE [username] = {username}"
    ID2 = f"WHERE [username] = {username} AND [period_end] = {date}"
    cur = init()
    
    cur.execute(f"""
            DECLARE @payRate AS DECIMAL(18,2) = (SELECT [pay_rate] FROM [pay_detail]s {ID} )
            DECLARE @ordinaryPay AS BIT = (SELECT [alternative_hours] FROM [timesheet] {ID2})
            DECLARE @leaveTaken AS VARCHAR(5) = (IF (SELECT COUNT(*) FROM leave_request {ID} AND {date} >= leave_start_date AND {date} <= leave_end_date AND status = 'approved' GROUP BY leave_entry_id) > 0 SELECT 'true' ELSE SELECT 'false')
            DECLARE @leaveStartDate AS DATE = (IF @leaveTaken = 'true' (SELECT leave_start_date FROM leave_request {ID} AND {date} >= leave_start_date AND {date} <= leave_end_date AND status = 'approved' GROUP BY leave_entry_id) ELSE null),               
            DECLARE @leaveEndDate AS DATE = (IF @leaveTaken = 'true' (SELECT leave_end_date FROM leave_request {ID} AND {date} >= leave_start_date AND {date} <= leave_end_date AND status = 'approved' GROUP BY leave_entry_id) ELSE null),


            INSERT INTO [payslip_data](
                [username],
                [pay_period_end],
                [payment_1_type],
                [pay_rate],
                [payment_1_time_length],
                [payment_1_name],
                [payment_1_amount],
                [pay_date],
                [total_time_length],
                [payment_2_name],
                [payment_2_amount],
                [total_pay],
                [leave_taken],
                [leave_start_date],
                [leave_end_date],
                [leave _days],
                [leave_hours],
                [leave_amount_paid],
                [leave_type],
                [total_leave_paid],
                [leave_balance],
                [pay_and_leave_amount],
                [tax_allowance],
                [nontax_allowance],
                [one_off_pay],
                [final_pay],
                [gross_pay],
                [year_to_date],
                [deductions],
                [paye],
                [student_loan],
                [child_support],
                [tax_credit],
                [net_pay],
                [benefits]
            )
            VALUES(
                {username},
                (SELECT [period_end] FROM [timesheet] {ID2}),
                (SELECT [pay_type] FROM [timesheet] {ID2}),
                @payRate,
                (SELECT [total_hours] FROM [timesheet] {ID2}),
                "Ordinary Pay",
                ((SELECT [total_hours] FROM [timesheet] {ID2})*@payRate), --Add Statutory holiday hours
                getdate(),
                (SELECT [total_hours] FROM [timesheet] {ID2}),
                (IF @ordinaryPay != 0 "Holiday Pay"), --Will probably error
                (@ordinaryPay * 0.5),
                (SUM(SELECT [total_hours] FROM [timesheet] {ID2})*@payRate),(@ordinaryPay * 0.5)),
                @leaveTaken,
                @leaveStartDate,
                @leaveEndDate,
                (IF @leaveTaken = 'true' (SELECT DATEDIFF(day,@leaveStartDate,@leaveEndDate)) ELSE null ),    
            );
            """
    )
    result = cur.fetchone()[0]
    cur.close()

    return result

def login_verify(username,password):
    cur = init()
    cur.execute(f"SELECT role FROM login WHERE username = {username} AND password = {password};")
    role = cur.fetchone()
    if bool(role):
        cur.execute(f"UPDATE login SET last_login = CURRENT_TIMESTAMP WHERE username = {username};")
        cur.commit()
            
        cur.execute(f"SELECT * FROM employee where username = {username}")
        setup = bool(cur.fetchone())
        cur.close()

        return [bool(role),role[0],setup]
    else:
        return [False,'n/a','n/a'] 
    
def register_check(username,password):
    cur = init()
    cur.execute(f"SELECT username FROM login WHERE login.username = {username} AND login.password = {password};")
    login_made = bool(cur.fetchone())
    cur.execute(f"Select * FROM employee where username = {username}")
    config = bool(cur.fetchone())

    cur.close()

    return [login_made,config]

def register_account(userName,firstName,lastName,email,address,suburb,postCode,phone):
    cur = init()
    try:
        cur.execute(f"""INSERT INTO employee(
        [username]
      ,[first_name]
      ,[last_name]
      ,[email]
      ,[address_1]
      ,[address_2]
      ,[post_code]
      ,[phone]) VALUES ({userName},{firstName},{lastName},{email},{address},{suburb},{postCode},{phone})""")
        cur.commit()
    except Exception as e:
        cur.close()
        return 'Failed',e
    cur.close()

    return 'Success','n/a'


def email_payslip_details(username):
    cur = init()
    cur.execute(f"""
        SELECT [employee_email]
      ,[employee_name]
      ,[manager_name]
      ,[manager_contact] FROM email_details WHERE username = {username}""")
    
    result = cur.fetchone()
    cur.close()

    return result

def get_manager_settings(username):
    cur = init()
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
    WHERE [login].[username] = {username}""")
    
    result = cur.fetchone()
    cur.close()

    return result

def update_manager_settings(username_old,username,password,firstname,lastname,email,phone,address,suburb,contact_method,business_name,entity_name):
    cur = init()
    try:
        cur.execute(f"""Update login
            SET username = {username}
                ,password = {password}
            WHERE username = {username_old};""")

        cur.execute(f"""Update manager
            SET first_name={firstname}
                ,last_name = {lastname}
                ,email = {email}
                ,phone = {phone}
                ,contact_method = {contact_method}
                ,business_name = {business_name}
                ,entity_name = {entity_name}
                ,business_address_1 = {address}
                ,business_address_2 = {suburb} WHERE username = {username_old}""")
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def create_manager(username,password,firstname,lastname,email,phone,address,suburb,contact_method,business_name,entity_name):
    cur = init()
    try:
        cur.execute(f"""INSERT INTO login(
                    username,
                    password,
                    created_on,
                    role
        ) VALUES (
                    {username},
                    {password},
                    current_timestamp,
                    'manager'
        )""")

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
                ,business_address_2 
        ) VALUES (
                    {username}
                    ,{firstname}
                    ,{lastname}
                    ,{email}
                    ,{phone}
                    ,{contact_method}
                    ,{business_name}
                    ,{entity_name}
                    ,{address}
                    ,{suburb}
        )""")
        cur.commit()
        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def get_employee_settings(username):
    cur = init()
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
    WHERE [login].[username] = {username}""")
    
    result = cur.fetchone()
    cur.close()

    return result

def update_employee_settings(username_old,username,password,firstname,lastname,email,phone,address,suburb,postcode):
    cur = init()
    try:
        cur.execute(f"""Update login
            SET username = {username}
                ,password = {password}
            WHERE username = {username_old};""")

        cur.execute(f"""Update employee
            SET first_name={firstname}
                ,last_name = {lastname}
                ,email = {email}
                ,phone = {phone}
                ,post_code = {postcode}
                ,address_1 = {address}
                ,address_2 = {suburb} WHERE username = {username_old}""")
        
        cur.commit()

        cur.close()
    except Exception as e:
        cur.close()
        return 'Failed',e
    return 'Success','n/a'

def get_manager_employees(username):
    cur = init()
    cur.execute(f""" SELECT [username]
        ,[first_name]
        ,[last_name]
        ,[phone]
        ,[email]
      ,[pay_rate]
      ,[bank_account]
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
  FROM [manager_employee_list] WHERE manager = {username}""")
    
    result = cur.fetchall()
    cur.close()

    return result

def update_manager_employee_list(bank_account,benefits,child_support,email,final_pay,first_name,kiwisaver,last_name,one_off_deduction,pay_rate,phone,student_loan,tax_credit,tax_rate,username,username_old,weekly_allowance,weekly_allowance_nontax):
    cur = init()
    try:
        cur.execute(f"""Update login
                SET username = {username}
                WHERE username = {username_old}""")
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
                    WHERE username = {username_old}""")
        cur.execute(f"""Update employee
                    SET email = {email}
                    ,first_name = {first_name}
                    ,last_name = {last_name}
                    ,phone = {phone}             
                    WHERE username = {username_old}""")
        cur.commit()
        cur.close()
    except Exception as E:
        cur.close()
        return 'Failed',E

    return 'Success','n/a'

def delete_manager_employee_list(userName): #Erroring
    cur = init()
    try:
        cur.execute(f"""DELETE FROM login
                    WHERE username = {userName};
                DELETE FROM pay_details
                    WHERE username = {userName};
                DELETE FROM timesheet_entry
                    WHERE username = {userName};
                DELETE FROM employee
                    WHERE username = {userName};
                DELETE FROM leave_details
                    WHERE username = {userName};
                DELETE FROM leave_entry
                    WHERE username = {userName};
                DELETE FROM manager
                    WHERE username = {userName};
                DELETE FROM manager_employee
                    WHERE manager = {userName};
                DELETE FROM manager_employee
                    WHERE employee = {userName};""")
        
        cur.commit()
        cur.close()
    except Exception as E:
        cur.close()
        return 'Failed',E
    return 'Success','n/a'

def get_timesheet(username):
    cur = init()
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
  FROM [dbo].[timesheet]
    WHERE username = {username} ORDER BY WeekStartDate ASC """)

    result = cur.fetchone()
    cur.close()

    return result

def get_timesheet_entry(username,start_date,end_date):
    cur = init()
    cur.execute(f"""SELECT [timesheet_entry_id]
      ,[date]
      ,[start_time]
      ,[end_time]
      ,[unpaid_break]
      ,[pay_type]
      ,[comments]
  FROM [dbo].[timesheet_entry]
    WHERE username = {username} AND date >= {start_date} AND date <= {end_date}  AND completed = 'false'""")

    result = cur.fetchall()
    cur.close()

    return result

def update_timesheet_entry(timesheet_entry_id,date,start_time,end_time,unpaid_break,pay_type,comment):
    cur = init()
    try:
        cur.execute(f"""Update timesheet_entry SET 
    date = {date},
    start_time = {start_time},
    end_time = {end_time},
    unpaid_break = {unpaid_break},
    pay_type = {pay_type},
    comments = {comment}
    WHERE timesheet_entry_id = {timesheet_entry_id}""")
        cur.commit()
        cur.close()
    except Exception as E:
        cur.close()
        return 'Failed',E
    return 'Success','n/a'

def delete_timesheet_entrys(entrys):
    cur = init()
    try:
        cur.execute(f"""Delete From timesheet_entry WHERE timesheet_entry_id in {entrys}""")
        cur.commit()
        cur.close()
    except Exception as E:
        cur.close()
        return 'Failed',E
    return 'Success','n/a'

def new_timesheet_entry(username,date,start_time,end_time,unpaid_break,pay_type,comment):
    cur = init()
    try:
        cur.execute(f"""INSERT INTO timesheet_entry(
    username
    ,date
    ,start_time
    ,end_time
    ,unpaid_break
    ,pay_type
    ,comments ) VALUES(
    {username},
    {date},
    {start_time},
    {end_time},
    {unpaid_break},
    {pay_type},
    {comment}
    )""")
        cur.commit()
        cur.close()
    except Exception as E:
        cur.close()
        return 'Failed',E
    return 'Success','n/a'

def get_employee_timesheets(username):
    cur = init()

    class employee_Timesheet() :
        def __init__(self,sheet):
            self.WeekStartDate = sheet[0].strftime('%a, %d %b')
            self.WeekEndDate = sheet[1].strftime('%a, %d %b')
            self.monday_hours_worked = sheet[2]
            self.tuesday_hours_worked = sheet[3]
            self.wednesday_hours_worked = sheet[4]
            self.thursday_hours_worked = sheet[5]
            self.friday_hours_worked = sheet[6]
            self.saturday_hours_worked = sheet[7]
            self.sunday_hours_worked = sheet[8]
            self.total_hours_worked = sheet[9]
            self.total_unpaid_break = sheet[10]
            self.timesheet_entrys = sheet[11]
        def string(self):
            return {'WeekStartDate' : self.WeekStartDate,
                     'WeekEndDate' : self.WeekEndDate,
                     'monday_hours_worked' : self.monday_hours_worked,
                     'tuesday_hours_worked' : self.tuesday_hours_worked,
                     'wednesday_hours_worked' : self.wednesday_hours_worked,
                     'thursday_hours_worked' : self.thursday_hours_worked,
                     'friday_hours_worked' : self.friday_hours_worked,
                      'saturday_hours_worked' : self.saturday_hours_worked,
                      'sunday_hours_worked' : self.sunday_hours_worked,
                      'total_hours_worked' : self.total_hours_worked,
                      'total_unpaid_break' : self.total_unpaid_break,
                      'timesheet_entrys' : self.timesheet_entrys}
    class employee_timesheet_entry():
        def __init__(self,entry):
            self.timesheet_entry_id = entry[0]
            self.date = entry[1]
            self.start_time = entry[2]
            self.end_time = entry[3]
            self.unpaid_break = entry[4]
            self.pay_type = entry[5]
            self.comment = entry[6]
        def string(self):
            return {'timesheet_entry_id': self.timesheet_entry_id,
                     'date' : self.date,
                     'start_time' : self.start_time,
                     'end_time' : self.end_time,
                     'unpaid_break' : self.unpaid_break,
                     'pay_type' : self.pay_type,
                     'comments' : self.comment}
        
    timesheet_response = []

    cur.execute(f"""SELECT [employee] FROM employee_manager where [manager] = {username}""")
    employee_usernames = cur.fetchall()

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
    FROM [dbo].[timesheet]
        WHERE username = {emp} ORDER BY WeekStartDate ASC """)

            timesheet = cur.fetchone()

            cur.execute(f"""SELECT TOP(1) [timesheet_entry_id]
        ,[date]
        ,[start_time]
        ,[end_time]
        ,[unpaid_break]
        ,[pay_type]
        ,[comments]
    FROM [timesheet_entry]
    Where timesheet_entry.[date] >= {timesheet[0].__str__()} and timesheet_entry.date <= {timesheet[1].__str__()} AND username = {emp}
            """)

            timesheet_entrys = cur.fetchall()
            entry_list = []
            

            for entry in timesheet_entrys:
                classed = employee_timesheet_entry(entry)
                entry_list.append(classed.string())

            timesheet.append(entry_list)
            
            timesheet_classed = employee_Timesheet(timesheet)
            timesheet_response.append(timesheet_classed.string())

        except:
            continue

    return timesheet_response
