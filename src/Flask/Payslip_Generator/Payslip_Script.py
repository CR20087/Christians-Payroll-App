def Payslip_Script(email):
    from Payslip_Generator.Email_Sender import email_sender
    from collections import namedtuple
    from Payslip_Generator.Pdf_Generator.Pdf_Generator_From_Template import pdf_generator_from_template
    #Payslip Generate
    pdf_generator_from_template()
    # Email Send
    Recipient = namedtuple('Recipient',['name','email'])
    Manager = namedtuple('Manager',['name','email'])
    recipient =Recipient('Bowen',email)
    manager = Manager('Dr Splwhetz','splwhetz@gmail.com')
    email_sender(recipient,manager)
    return 'Success'
    
     

if __name__ == "__main__":
    Payslip_Script()