def Payslip_Script(username):
    from Payslip_Generator.Email_Sender import email_sender
    from Payslip_Generator.Pdf_Generator.Pdf_Generator_From_Template import pdf_generator_from_template
    from Flask.cpa_sql import email_payslip_details

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
   
    email_sender(username,recipient=recipient(),manager=manager())
    return 'Success'
    
     

if __name__ == "__main__":
    Payslip_Script()