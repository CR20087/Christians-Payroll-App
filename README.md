# Christian's Payroll App

Edit: This application's servers have been discontinued.

This application can be viewed in production [here](https://christians-payroll-app.vercel.app). Powered by [Vercel](https://vercel.com).

This application was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The application is integrated with Azure services such as:\
-App Services\
-SQL Server

## Available Functions of the application

After creating a 'Manager' permissions account and configuring employees.\
These functions are available with the select permission role.

## Employee 

Employee accounts are created and managed by a selected pay manager of a business. All active timesheets are able to be viewed by the designated pay manager.\
Employees have access to two key functions, leave and timesheets. Employees may request leave, which can either be approved or declined by management, if approved the leave takes effect in the corresponding payslip period. And timesheets, a self-operated system where employees record their worked hours.\
Employees receive a login from their pay manager and a required to register their account on first use.
### `Timesheets`

View, Manage interact with timesheets. Create new entries with information such as the start/end time, any unpaid breaks, type of pay, and an optional comment visible to your pay manager. After an entry has been created, a timesheet/weekly entry view will be created (if there is not already). Within the timesheet page, all active timesheets will be visible and able to be edited by editing the related entries.

### `Leave`

View, edit, and publish leave entries. Employees may request a period of leave requiring the period and type of leave. Upon request, pay managers can view these requests can are able to either approve or decline the entry. If approved the leave takes effect in the corresponding payslip period.

## Manager

### `Pay Run`

Pay managers can execute pay runs with either all available payslips or selected ones. The summarised information of each payslip is viewable before execution. When a payslip is executed the employee will receive a payslip via email containing relevant information of factors within the pay period.

### `Timesheet View`

Pay managers can view all employee's active timesheets, these timesheets displayed are the same as the employee sees. By expanding the timesheet all entries are visible.

### `Leave`

Any upcoming or active leave requests are visible to pay managers. The requests can be either approved or declined. If approved the leave will take effect in the corresponding payslip. When the approval status is updated, the change is made visible to the employee.

### `Employee View`

Managers can view, change and create new employees using the employee view. Existing employees will have pay and personal information displayed which is able to be edited.\
New employees can be created and require this pay information for the account to be finalised and created. Upon creating this account the pay manager will receive a temporary password for the employee to use. Once the employee has registered their account they are able to change this.

**Note: Functions of the application may updated or new functions may be added in future updates.**
