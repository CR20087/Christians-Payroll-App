def Payslip_Script(username):
    from Email_Sender import email_sender
    from Pdf_Generator.Pdf_Generator_From_Template import pdf_generator_from_template
    from ..cpa_sql import email_payslip_details

    #Payslip Generate

    pdf_generator_from_template()

    #get the data

    results = email_payslip_details(username)

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

    print(recipient.email)
    print(recipient.name)
    print(manager.name)
    print(manager.contact)

    email_sender(username,recipient,manager)
    return 'Success'
    
     

if __name__ == "__main__":
    Payslip_Script('employee')