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
    if bool(cur.fetchone()):
        cur.execute(f"UPDATE login SET last_login = CURRENT_TIMESTAMP WHERE username = {username};")
        cur.commit()
        cur.close()

    return [bool(role),role[0][0]]

def email_payslip_details(username):
    cur = init()
    cur.execute(f"""
        SELECT employee.email AS employee_email,
        CONCAT(employee.first_name,' ',employee.last_name) AS employee_name,
        CONCAT(manager.first_name,' ',manager.last_name) AS manager_name,
        (case when manager.contact_method = 'phone' then manager.phone ELSE manager.email end) AS manager_contact
        FROM employee_manager 
        INNER JOIN employee 
        ON employee_manager.employee = employee.username 
        INNER JOIN manager
        ON employee_manager.manager = manager.username
        WHERE employee.username = {username}""")
    
    result = cur.fetchone()[0]
    cur.close()

    return result


