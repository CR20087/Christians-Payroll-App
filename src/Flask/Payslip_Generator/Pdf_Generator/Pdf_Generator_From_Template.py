def pdf_generator_from_template(payslip_data):
    import os
    import pdfkit
    from jinja2 import Environment, FileSystemLoader
    from ... import cpa_sql
    
    #Get leave entries
    leave_entrys=cpa_sql.get_payslip_leave_entrys(payslip_data[18].isoformat(),payslip_data[0])

    # Business details
    class Entity():
        """Assigns payslip data to self variables.
        
        Entity payslip data.
        """
        def __init__(self):
            self.entity_name=payslip_data[1]
            self.business_name=payslip_data[2]
            self.address_line_1=payslip_data[3]
            self.address_line_2=payslip_data[4]

    # Reciever details
    class Receiver():
        """Assigns payslip data to self variables.
        
        Receiver payslip data.
        """
        def __init__(self):
            self.last_name=payslip_data[5] 
            self.first_name=payslip_data[6]
            self.initials=payslip_data[7]
            self.address_line_1=payslip_data[8]
            self.address_line_2=payslip_data[9]
            self.post_code=payslip_data[10]
            self.bank_account_num=payslip_data[11]
            self.tax_code=payslip_data[12]
            self.ird_num=payslip_data[13]

    # Payment(s)
    class Payment():
        """Assigns payslip data to self variables.
        
        Payments element payslip data.
        """
        def __init__(self):
            self.pay_type=payslip_data[14]
            self.pay_rate=payslip_data[15]
            self.pay_time_length=payslip_data[16]
            self.pay_amt=payslip_data[17]
            self.pay_period_end=payslip_data[18]
            self.pay_date=payslip_data[19]
            self.total_time_length=payslip_data[20]
            self.total_py=payslip_data[21]
    
    #Leave
    class Leave():
        """Assigns payslip data to self variables.
        
        Leave element payslip data.
        """
        def __init__(self):
            self.leave_taken=payslip_data[22]!='False'
            self.leave_weekly_ammount=payslip_data[23]  
            self.total_leave_paid=payslip_data[24] 
        
        #Create html leave Insert
        def html_start(self,f):
            """Start of leave element.
            
            Returns html header of leave element.
            """
            if f: 
                return f"""
                        <p class="c4 c14">
                            <span class="c6 c66 c2 column4 alignright">Amount</span>
                            <span class="c6 c2 column4">Days</span>
                            <span class="c6 c2 column4">Duration</span>
                            <span class="c6 c2 column4">To Date</span>
                            <span class="c6 c2 column4">From Date</span>
                            <span class="c6 c2 column2">Leave</span>
                        </p>
                        """
            else:
                return ''
        def html_mid(self,f,entry):
            """Body of leave element.
            
            Completed for any number of included leave entries.
            
            Returns html body of leave element.
            """
            if f: 
                return f"""
                        <p class="c4">
                            <span class="c66 column4 alignright">{entry[0]}</span>
                            <span class="c1 column4">{entry[1]}</span>
                            <span class="c1 column4">{entry[2]}</span>
                            <span class="c1 column4">{entry[3]}</span>
                            <span class="c1 column4">{entry[4]}</span>
                            <span class="c1 column2 alignleft">{entry[5]}</span>
                        </p>
                        """
            else:
                return ''
        def html_end(self,f):
            """End of leave element.
            
            Returns html Footer of leave element.
            """
            if f: 
                return f"""
                        <hr>
                        <p class="c4">
                            <span class="c2 c66 alignright">{self.total_leave_paid}</span>
                            <span class="alignleft c2">Total Leave</span>
                        </p>
                        <p><span>&nbsp;</span></p>
                        <p><span>&nbsp;</span></p>
                        """
            else:
                return ''
    # Summary
    class Summary():
        """Assigns payslip data to self variables
        
        Summary element payslip data.
        """
        def __init__(self):
            self.total_pay=payslip_data[25]  
            self.summary_tax_allowance=payslip_data[26]  
            self.summ_non_tax_allowance=payslip_data[27]  
            self.summary_one_off_deduction=payslip_data[28]  
            self.summary_final_pay=payslip_data[29]  
            self.summary_gross_pay=payslip_data[30]  
            self.kiwisaver=payslip_data[31]   
            self.summary_year_to_date=payslip_data[32]   
            self.summary_deductions=payslip_data[33]   
            self.summary_paye=payslip_data[34]   
            self.summary_student_loan=payslip_data[35]   
            self.summary_child_support=payslip_data[36]             
            self.summary_tax_credit=payslip_data[37]  
            self.pay_net=payslip_data[38]  
            self.summary_benefits=payslip_data[39]  

    entity=Entity()
    receiver=Receiver()
    payment=Payment()
    summary=Summary()
    leave=Leave()

    def leave_html_insert_var(f):
        """Creates a leave element for payslip"""
        string=leave.html_start(f)
        for i in leave_entrys:
            string+=leave.html_mid(f,i)
        string+=leave.html_end(f)
        return string

    context={'entity_name':entity.entity_name,'business_name':entity.business_name,'entity_address_line_1':entity.address_line_1,'entity_address_line_2':entity.address_line_2,
            'last_name':receiver.last_name,'first_name':receiver.first_name,'initials':receiver.initials,'receiver_address_line_1':receiver.address_line_1,'receiver_address_line_2':receiver.address_line_2,'post_code':receiver.post_code,'bank_account_num':receiver.bank_account_num,'tax_code':receiver.tax_code,'ird_num':receiver.ird_num,'leave_weekly_ammount':leave.leave_weekly_ammount,
                'pay_type':payment.pay_type,'pay_rate':payment.pay_rate,'pay_time_length':payment.pay_time_length,'pay_amt':payment.pay_amt,'pay_period_end':payment.pay_period_end,'pay_date':payment.pay_date,'total_time_length':payment.total_time_length,'total_payments':payment.total_py,
                'summary_kiwisaver':summary.kiwisaver,'total_pay':summary.total_pay,'summary_tax_allowance':summary.summary_tax_allowance,'summ_non_tax_allowance':summary.summ_non_tax_allowance,'summary_one_off_deduction':summary.summary_one_off_deduction,'summary_final_pay':summary.summary_final_pay,'summary_gross_pay':summary.summary_gross_pay,'summary_year_to_date':summary.summary_year_to_date,'summary_deductions':summary.summary_deductions,'summary_paye':summary.summary_paye,'summary_student_loan':summary.summary_student_loan,'summary_child_support':summary.summary_child_support,'summary_tax_credit':summary.summary_tax_credit,'pay_net':summary.pay_net,'summary_benefits':summary.summary_benefits,
                 'leave_insert':leave_html_insert_var(leave.leave_taken) }

    # For Development Purposes: config=pdfkit.configuration(wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe")

    # Load the HTML template using Jinja2
    template_dir=os.path.join(os.getcwd(),'src','Flask','templates')
    env=Environment(loader=FileSystemLoader(template_dir))
    template=env.get_template('PaySliptemplate.html')

    # Render the HTML template with context data
    html_content=template.render(context)

    # Save the rendered HTML to a temporary file
    temp_html_file='temp.html'
    with open(temp_html_file,'w',encoding='utf-8') as f:
        f.write(html_content)

    # Generate the PDF using pdfkit
    pdf_file='./src/Flask/Payslip_Generator/Pdf_Generator/Generated_PDF.pdf'
    pdfkit.from_file(temp_html_file,pdf_file,options={"enable-local-file-access":""},css='./src/Flask/static/PaySliptemplate.css') # For Development Purposes: configuration=config

    # Remove temporary HTML file
    os.remove(temp_html_file)