def Payslip_Script(username):
    from . import Email_Sender  
    from .Pdf_Generator import Pdf_Generator_From_Template
    from .. import cpa_sql

    #Payslip Generate

    Pdf_Generator_From_Template.pdf_generator_from_template()

    #get the data

    results = cpa_sql.email_payslip_details(username)

    # map the data

    class recipient():
        def __init__(self):
            self.email = results[0]
            self.name = results[1]
    class manager():
        def __init__(self):
            self.name = results[2]
            self.contact = results[3]

    #send the email
    recipient=recipient()
    manager=manager()

    Email_Sender.email_sender(username,recipient,manager)
    return 'Success'
    
     

if __name__ == "__main__":
    Payslip_Script('employee')