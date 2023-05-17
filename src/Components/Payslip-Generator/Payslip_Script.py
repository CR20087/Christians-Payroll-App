from Email_Sender import email_sender
from collections import namedtuple
from Pdf_Generator.Pdf_Generator_From_Template import pdf_generator_from_template
#Payslip Generate
pdf_generator_from_template()
# Email Send
Recipient = namedtuple('Recipient',['name','email'])
Manager = namedtuple('Manager',['name','email'])
recipient =Recipient('Bowen','christian.reid007@gmail.com')
manager = Manager('Dr Splwhetz','splwhetz@gmail.com')
email_sender(recipient,manager)