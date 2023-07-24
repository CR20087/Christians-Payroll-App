def pdf_generator_from_template():
    from datetime import datetime
    import os
    import pdfkit
    from jinja2 import Environment, FileSystemLoader

    # Business details
    class Entity():
        def __init__(self):
            self.entity_name = 'test'
            self.business_name = 'test'
            self.address_line_1 = 'test'
            self.address_line_2 = 'test'

    # Reciever details
    class Receiver():
        def __init__(self):
            self.last_name = 'test' 
            self.first_name = 'test'
            self.initials = 'test'
            self.address_line_1 = 'test'
            self.address_line_2 = 'test'
            self.post_code = 'test'
            self.bank_account_num = 'test'
            self.tax_code = 'test'
            self.ird_num = 'test'

    # Payment(s)
    class Payment():
        def __init__(self):
            self.payments = 'test' 
            self.pay_type = 'test'
            self.pay_rate = 'test'
            self.pay_time_length = 'test'
            self.pay_amt = 'test'
            self.pay_period_end = 'test'
            self.pay_date = datetime.today().strftime("%d %b, %Y")
            self.total_time_length = 'test'
            self.total_py = 'test'
    
    #Leave
    class Leave():
        def __init__(self):
            self.leave_weekly_ammount = 'test'
            self.leave_taken_hours = 'test'
            self.leave_take_days = 'test'
            self.leave_start_date = 'test'
            self.leave_end_date = 'test'
            self.leave_type = 'test'
            self.leave_ammount_paid = 'test'

        def html(self,f):
            if f: 
                return f"""<p class="c4 c14">
                <span class="c6 c66 c2 column4 alignright">Amount</span>
                <span class="c6 c2 column4">Days</span>
                <span class="c6 c2 column4">Duration</span>
                <span class="c6 c2 column4">To Date</span>
                <span class="c6 c2 column4">From Date</span>
                <span class="c6 c2 column2">Leave</span>
            </p>
            <p class="c4">
                <span class="c66 column4 alignright">{self.leave_ammount_paid}</span>
                <span class="c1 column4">{self.leave_take_days}</span>
                <span class="c1 column4">{self.leave_taken_hours}</span>
                <span class="c1 column4">{self.leave_start_date}</span>
                <span class="c1 column4">{self.leave_end_date}</span>
                <span class="c1 column2 alignleft">{self.leave_type}</span>
            </p>
            <hr>
            <p class="c4">
                <span class="c2 c66 alignright">{self.leave_ammount_paid}</span>
                <span class="alignleft c2">Total Leave</span>
            </p>
            <p><span>&nbsp;</span></p>
            <p><span>&nbsp;</span></p>
            </p>
"""
            else:
                return ''

    # Summary
    class Summary():
        def __init__(self):
            self.total_pay = 'test'
            self.summary_tax_allowance = 'test'
            self.summ_non_tax_allowance = 'test'
            self.summary_one_off_pay = 'test'
            self.summary_final_pay = 'test'
            self.summary_gross_pay = 'test'
            self.summary_year_to_date = 'test'
            self.summary_deductions = 'test'
            self.summary_paye = 'test'
            self.summary_student_loan = 'test'
            self.summary_child_support = 'test'
            self.summary_tax_credit = 'test'
            self.pay_net = 'test'
            self.summary_benefits = 'test'

    entity = Entity()
    receiver = Receiver()
    payment = Payment()
    summary = Summary()
    leave = Leave()

    context = {'entity_name':entity.entity_name,'business_name':entity.business_name,'entity_address_line_1':entity.address_line_1,'entity_address_line_2':entity.address_line_2,
            'last_name':receiver.last_name,'first_name':receiver.first_name,'initials':receiver.initials,'receiver_address_line_1':receiver.address_line_1,'receiver_address_line_2':receiver.address_line_2,'post_code':receiver.post_code,'bank_account_num':receiver.bank_account_num,'tax_code':receiver.tax_code,'ird_num':receiver.ird_num,'leave_weekly_ammount':leave.leave_weekly_ammount,
                'payments':payment.payments,'pay_type':payment.pay_type,'pay_rate':payment.pay_rate,'pay_time_length':payment.pay_time_length,'pay_amt':payment.pay_amt,'pay_period_end':payment.pay_period_end,'pay_date':payment.pay_date,'total_time_length':payment.total_time_length,'total_payments':payment.total_py,
                'total_pay':summary.total_pay,'summary_tax_allowance':summary.summary_tax_allowance,'summ_non_tax_allowance':summary.summ_non_tax_allowance,'summary_one_off_pay':summary.summary_one_off_pay,'summary_final_pay':summary.summary_final_pay,'summary_gross_pay':summary.summary_gross_pay,'summary_year_to_date':summary.summary_year_to_date,'summary_deductions':summary.summary_deductions,'summary_paye':summary.summary_paye,'summary_student_loan':summary.summary_student_loan,'summary_child_support':summary.summary_child_support,'summary_tax_credit':summary.summary_tax_credit,'pay_net':summary.pay_net,'summary_benefits':summary.summary_benefits,
                 'leave_insert':leave.html(True) }
    
#    Render the template with the context variables

    def generate_pdf(context_data):
        # Load the HTML template using Jinja2
        template_dir = os.path.join(os.getcwd(), 'src','Flask','templates')
        print(template_dir)
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template('PaySliptemplate.html')

        # Render the HTML template with context data
        html_content = template.render(context=context_data)

        # Save the rendered HTML to a temporary file
        temp_html_file = 'temp.html'
        with open(temp_html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        # Generate the PDF using pdfkit
        pdf_file = 'output.pdf'
        pdfkit.from_file(temp_html_file, pdf_file)

        # Clean up temporary HTML file
        os.remove(temp_html_file)
    
    generate_pdf(context)
   

if __name__=='__main__':
    pdf_generator_from_template()