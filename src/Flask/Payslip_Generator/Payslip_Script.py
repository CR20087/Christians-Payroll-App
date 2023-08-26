def Payslip_Script(id):
    from . import Email_Sender  
    from .Pdf_Generator import Pdf_Generator_From_Template
    from .. import cpa_sql

    #get the data
    payslip_data = cpa_sql.get_payslip_data(id)
    email_details = cpa_sql.email_payslip_details(payslip_data[0])

    # Payslip Generater

    Pdf_Generator_From_Template.pdf_generator_from_template(payslip_data)

    # map the data

    class recipient():
        def __init__(self):
            self.email = email_details[0]
            self.name = email_details[1]
    class manager():
        def __init__(self):
            self.name = email_details[2]
            self.contact = email_details[3]

    #send the email

    recipient=recipient()
    manager=manager()

    Email_Sender.email_sender(payslip_data[0],payslip_data[18],recipient,manager)   

    #Make final updates

    cpa_sql.exit_payrun_update(id,payslip_data[23],payslip_data[0])