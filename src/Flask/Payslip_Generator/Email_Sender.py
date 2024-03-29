def email_sender(username,date,recipient,manager):
    """Sends an email using SMTP library.
    
    Uses user details to format the email body.

    Grabs a payslip from a stored location.
    """
    from email.mime.application import MIMEApplication
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    import smtplib
    import os
    from dotenv import load_dotenv

     # Get enviroment variables
    load_dotenv()
    gmail_app_key=os.getenv('EMAIL_ACCOUNT_APP_KEY')
    # Establish connection
    server=smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    payslip_email_acc='payslip.christianspayrollapp@gmail.com'
    server.login(payslip_email_acc,gmail_app_key)
    msg=MIMEMultipart()
    # Generate Messsge
    message=f"""Dear {recipient.name},

Please find attached your payslip for the period ending {date}.

If you have any queries please contact {manager.name} ({manager.contact}).

PLEASE DO NOT REPLY DIRECTLY TO THIS EMAIL MESSAGE AS IT HAS BEEN SENT FROM AN AUTOMATED ACCOUNT AND IS NOT MONITORED.

WARNING: This e-mail contains information which is CONFIDENTIAL, and may be subject to Legal Privilege. If you are not the intended recipient, you must not peruse, use, disseminate, distribute or copy the e-mail or attachments. If you have received this message in error, please notify the contact person above and delete this e-mail."""
    msg['Subject']='Employee Payslip '+str(date.strftime('%a, %d %b'))
    msg['From']=payslip_email_acc
    msg['To']=recipient.email
    # Attach Payslip
    msg.attach(MIMEText(message, "plain"))
    with open(os.getcwd()+'/src/Flask/Payslip_Generator/Pdf_Generator/Generated_PDF.pdf',"rb") as f:
        attach=MIMEApplication(f.read(),_subtype="pdf")
        attach.add_header('Content-Disposition','attachment',filename=str(f'PAYSLIP {username} {date}'))
        msg.attach(attach)
        # Send Message
        server.send_message(msg)