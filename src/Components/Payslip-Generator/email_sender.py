def email_sender(recipient,manager):
    import datetime
    from email.mime.application import MIMEApplication
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    import smtplib
    from Gmail_App_Key_func import Gmail_App_Key


    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()


    payslip_email_acc = 'payslip.christianspayrollapp@gmail.com'


    server.login(payslip_email_acc,Gmail_App_Key())
    msg = MIMEMultipart()

    message = f"""Dear {recipient.name},

    Please find attached your payslip for the period ending {datetime.datetime.strftime(datetime.datetime.today(),"%d/%m/%Y")}.

    If you have any queries please contact {manager.name} ({manager.email}).

    PLEASE DO NOT REPLY DIRECTLY TO THIS EMAIL MESSAGE AS IT HAS BEEN SENT FROM AN AUTOMATED ACCOUNT AND IS NOT MONITORED.

    WARNING: This e-mail contains information which is CONFIDENTIAL, and may be subject to Legal Privilege. If you are not the intended recipient, you must not peruse, use, disseminate, distribute or copy the e-mail or attachments. If you have received this message in error, please notify the contact person above and delete this e-mail."""
    msg['Subject'] = f'Payslip {datetime.datetime.strftime(datetime.datetime.today(),"%d/%m/%Y")}'
    msg['From'] = payslip_email_acc
    msg['To'] = recipient.email

    msg.attach(MIMEText(message, "plain"))

    with open('src\Components\Payslip-Generator\Pdf_Generator\Generated_PDF.pdf', "rb") as f:
        attach = MIMEApplication(f.read(),_subtype="pdf")
        attach.add_header('Content-Disposition','attachment',filename=str(f'PAYSLIP {datetime.datetime.strftime(datetime.datetime.today(),"%d%b%Y")}.pdf'))
        msg.attach(attach)
        
        server.send_message(msg)