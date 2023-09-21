def Payslip_Script(id):
    """Completes a process of actions using a payslip ID number.
    
    Grabs data by filtering using the ID. 
    Grabs email using username linked to the payslip ID.
    Generates payslip using a template.
    Sends completed payslip and cutom email body to recipient.
    
    Exits process by updating stored values and assigning a
    'completed' status where required.
    """
    from . import Email_Sender  
    from .Pdf_Generator import Pdf_Generator_From_Template
    from .. import cpa_sql

    # Get the data
    payslip_data=cpa_sql.get_payslip_data(id)
    email_details=cpa_sql.email_payslip_details(payslip_data[0])

    # Payslip Generater
    Pdf_Generator_From_Template.pdf_generator_from_template(payslip_data)

    # Map the data
    class Recipient():
        def __init__(self):
            self.email=email_details[0]
            self.name=email_details[1]
    class Manager():
        def __init__(self):
            self.name=email_details[2]
            self.contac =email_details[3]

    # Send the email
    recipient=Recipient()
    manager=Manager()
    Email_Sender.email_sender(payslip_data[0],payslip_data[18],recipient,manager)   

    #Make final updates
    cpa_sql.exit_payrun_update(id,payslip_data[23],payslip_data[0])