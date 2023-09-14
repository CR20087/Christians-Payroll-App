def Reset(username,email,code):
    from email.mime.application import MIMEApplication
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    import smtplib

    #Establish connection

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()

    payslip_email_acc = 'payslip.christianspayrollapp@gmail.com'

    server.login(payslip_email_acc,'ezpkrdjwrbvjtzhl')
    msg = MIMEMultipart()

    #Generate Messgae

    message = f"""<p>PASSWORD RESET</p><br></br>
    
<p><b>If this was not you please contact Christian's Payroll App immeadiatley</b></p><br></br>

<p>The one time code to reset your password is: <b>{code}</b></p><br></br>

<p>Username is: <b>{username}</b></p><br></br>

<p>Please do not share your account details.</p>"""    
    
    
    
    msg['Subject'] = 'Password Reset '
    msg['From'] = 'noreply@christianspayrollapp.com'
    msg['To'] = email

    msg.attach(MIMEText(message, "html"))

    #Send Message
        
    server.send_message(msg)