import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate, useParams } from 'react-router-dom';
import { Button,DialogContent,DialogTitle,Stack,TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import bcrypt from 'bcryptjs';


function EmployeeTable() {
  const navigate = useNavigate()
  let params = useParams()
  const [data, setData] = useState({});
  const [change, setChange] = useState(false);
  const [newEmployeeModalOpen, setNewEmployeeModalOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateCheck = useCallback(

    //Function executed when component is interacted with

    (cell) => {
      const handleBlur = (event) => {

        //Validation logic executed each time the field is 'un-focussed'

        const updatedValidationErrors = { ...validationErrors };

        if (event.target.value === "") {
          updatedValidationErrors[cell.id] = `${cell.column.columnDef.header} is required`; //If empty have a required error

        } else if (!cell.column.columnDef.regex.test(event.target.value)) {
          updatedValidationErrors[cell.id] = cell.column.columnDef.helperText; //When the entered vaalue doesn't match the acceptable regular expressio, error

        } else {
          delete updatedValidationErrors[cell.id];
        }

        setValidationErrors(updatedValidationErrors);
        
      };
      return {
        onBlur: handleBlur,
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
      };
    },
    [validationErrors]
  );

  const columns = //Each column has a header,pattern,Error message predetermined.
    [
      {
        accessorKey: 'first_name',
        header: 'First Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: 'A-Z a-z'
        }),
        helperText: "First Name must be: Letters",
        regex: /^[A-Za-z]*$/
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: 'A-Z a-z'
        }),
        helperText: "Last Name must be: Letters",
        regex: /^[A-Za-z]*$/
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '0-9'
        }),
        helperText: "Phone must be: 1-13 characters, (Optional '#,+')",
        regex: /^[+#]\d{1,13}$/
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Email must be: Alphanumerical (Optional symbols excluding '/')",
        regex: /^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/
      },
      {
        accessorKey: 'username',
        header: 'Username',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: 'A-Z a-z 0-9'
        }),
        helperText: "User name must be: Alphanumerical",
        regex: /^[a-zA-Z0-9]{1,30}$/
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00 (Hourly Rate)'
        }),
        helperText: "Pay rate must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'bank_account',
        header: 'Bank account',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '##-####-#######-###'
        }),
        helperText: "Bank account must be: 8-12 digits",
        regex: /^\d{2}-?\d{4}-?\d{7}-?\d{2,3}$/
      },
      {
        accessorKey: 'ird_number',
        header: 'IRD Number',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '###-###-###'
        }),
        helperText: "IRD number must be: 9 digits (Optional '-')",
        regex: /^\d{3}-?\d{3}-?\d{3}$/
      },
      {
        accessorKey: 'tax_code',
        header: 'Tax Code',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: 'A-Z'
        }),
        helperText: "Tax code must be: <5 charaters, Captial letters",
        regex: /^[A-Z]{1,4}$/
      },
      {
        accessorKey: 'kiwisaver',
        header: 'Kiwisaver',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '0%'
        }),
        helperText: "Kiwisaver must be either; 0,3,4,6,10 %",
        regex: /^(0|3|4|6|10)$/
      },
      {
        accessorKey: 'student_loan',
        header: 'Student loan',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00%'
        }),
        helperText: "Student loan must be: >0 and <100, Number/Float",
        regex: /^(?:\d{1,2}(?:\.\d+)?|99(?:\.\d+)?)$/
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One off deduction',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00'
        }),
        helperText: "One off deduction must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'tax_rate',
        header: 'Tax rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '0.00%'
        }),
        helperText: "Tax rate must be: >=0 and <100, Number/Float",
        regex: /^(?:\d{1,2}(?:\.\d+)?|99(?:\.\d+)?)$/
      },
      {
        accessorKey: 'final_pay',
        header: 'Final pay',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00'
        }),
        helperText: "Final pay must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'weekly_allowance',
        header: 'Weekly Allowance',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00'
        }),
        helperText: "Weekly allowance must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'weekly_allowance_nontax',
        header: 'Weekly allowance Non tax',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00'
        }),
        helperText: "Weekly allowance non-tax must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'year_to_date',
        header: 'Year to date',
        enableEditing: false,
      },
      {
        accessorKey: 'child_support',
        header: 'Child support',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00%'
        }),
        helperText: "'Child support must be: >0 and <100, Number/Float",
        regex: /^(?:\d{1,2}(?:\.\d+)?|99(?:\.\d+)?)$/
      },
      {
        accessorKey: 'tax_credit',
        header: 'Tax credit',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00'
        }),
        helperText: "Tax credit must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'benefits',
        header: 'Benefits',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
          placeholder: '00.00'
        }),
        helperText: "Benefits must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'created_on',
        header: 'Created on',
        enableEditing: false,
        
      }
    ]
  ;

  const columns2 = useMemo( //Columns defenitions used for new Employee Modal
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        helperText: "User name must be: Alphanumerical",
        regex: /^[a-zA-Z0-9]{1,30}$/,
        placeholder: 'A-Z a-z 0-9'
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay rate',
        helperText: "Pay rate must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00 (Hourly Rate)'
      },
      {
        accessorKey: 'bank_account',
        header: 'Bank account',
        helperText: "Bank account must be: 15-16 digits (Optional '-')",
        regex: /^\d{2}-?\d{4}-?\d{7}-?\d{2,3}$/,
        placeholder: '##-####-#######-###'
      },
      {
        accessorKey: 'ird_number',
        header: 'IRD Number',
        helperText: "IRD number must be: 9 digits (Optional '-')",
        regex: /^\d{3}-?\d{3}-?\d{3}$/,
        placeholder: '###-###-###'
      },
      {
        accessorKey: 'tax_code',
        header: 'Tax Code',
        helperText: "Tax code must be: <5 charaters, Captial letters",
        regex: /^[A-Z]{1,4}$/,
        placeholder: 'A-Z'
      },
      {
        accessorKey: 'student_loan',
        header: 'Student loan',
        helperText: "Student loan must be: >=0 and <100, Number/Float",
        regex: /^(?:\d{1,2}(?:\.\d+)?|99(?:\.\d+)?)$/,
        placeholder: '00.00%'
      },
      {
        accessorKey: 'kiwisaver',
        header: 'Kiwisaver',
        helperText: "Kiwisaver must be either; 0,3,4,6,10 %",
        regex: /^(0|3|4|6|10)$/,
        placeholder: '0%'
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One off deduction',
        helperText: "One off deduction must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00'
      },
      {
        accessorKey: 'tax_rate',
        header: 'Tax rate',
        helperText: "Tax rate must be: >=0 and <100, Number/Float",
        regex: /^(?:\d{1,2}(?:\.\d+)?|99(?:\.\d+)?)$/,
        placeholder: '0.00%'
      },
      {
        accessorKey: 'final_pay',
        header: 'Final pay',
        helperText: "Final pay must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00'
      },
      {
        accessorKey: 'weekly_allowance',
        header: 'Weekly Allowance',
        helperText: "Weekly allowance must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00'
      },
      {
        accessorKey: 'weekly_allowance_nontax',
        header: 'Weekly allowance Non tax',
        helperText: "Weekly allowance non-tax must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00'
      },
      {
        accessorKey: 'child_support',
        header: 'Child support',
        helperText: "'Child support must be: >=0 and <100, Number/Float",
        regex: /^(?:\d{1,2}(?:\.\d+)?|99(?:\.\d+)?)$/,
        placeholder: '00.00%'
      },
      {
        accessorKey: 'tax_credit',
        header: 'Tax credit',
        helperText: "Tax credit must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00'
      },
      {
        accessorKey: 'benefits',
        header: 'Benefits',
        helperText: "Benefits must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/,
        placeholder: '00.00'
      }
    ],
    [],
  );

  useEffect(() => {
    
    //Fetching page data

    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'username' : `'${params.userID}'`})
        })
        const data = await res.json()

        if (data.auth === false) {
          if (window.location.pathname !== '/login') {
          alert("Invalid Authentication Token.\nPlease login again.")
          navigate('/login')}
        }

        setData(data.results) //Setting page data
    } 
        
    fetchData()

},[change]) // Executed every time variable 'change' is changed

const handleCancelRowEdits = () => {
  
  //Remove errors if editing is cancelled

  setValidationErrors({});
};

const handleSaveRow = async ({ exitEditingMode, row, values }) => {

  //Function to save edited row / employee

  const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/update`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'bank_account' : `'${values.bank_account}'`,
    'benefits' : `'${values.benefits}'`,
    'child_support' : `'${values.child_support}'`,
    'email' : `'${values.email}'`,
    'final_pay' : `'${values.final_pay}'`,
    'first_name' : `'${values.first_name}'`,
    'kiwisaver' : `'${values.kiwisaver}'`,
    'last_name' : `'${values.last_name}'`,
    'one_off_deduction' : `'${values.one_off_deduction}'`,
    'pay_rate' : `'${values.pay_rate}'`,
    'phone' : `'${values.phone}'`,
    'student_loan' : `'${values.student_loan}'`,
    'tax_credit' : `'${values.tax_credit}'`,
    'tax_rate' : `'${values.tax_rate}'`,
    'username' : `'${values.username}'`,
    'username_old' : `'${row.original.username}'`,
    'weekly_allowance' : `'${values.weekly_allowance}'`,
    'weekly_allowance_nontax' : `'${values.weekly_allowance_nontax}'`,
    'ird_number' : `'${values.ird_number}'`,
    'tax_code' : `'${values.tax_code}'`
  })
  })
  const data = await res.json()

  if (data.auth === false) {
    if (window.location.pathname !== '/login') {
    alert("Invalid Authentication Token.\nPlease login again.")
    navigate('/login')}
  }

  if (data.success === 'Success') {

    //If the update was successful

    alert(`${values.first_name} ${values.last_name} (${values.username}) was updated successfully`)
    setChange(true)}
    else {

      //If the update waas unsuccessful

      alert(`An error occured.\n\n\n\n${data.error}`) }

  exitEditingMode(); 
};
const handleCreateNewRow = async (values) => {

  //Function to crete new row / employee

  function randomString(length, chars) {

    //Function to generate a random password

    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  const tempPassword = randomString(9, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  const hashedPassword = await bcrypt.hash(tempPassword, 10)

  const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/new`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'password' : `'${hashedPassword}'`,
    'bank_account' : `'${values.bank_account}'`,
    'benefits' : `'${values.benefits}'`,
    'child_support' : `'${values.child_support}'`,
    'final_pay' : `'${values.final_pay}'`,
    'kiwisaver' : `'${values.kiwisaver}'`,
    'one_off_deduction' : `'${values.one_off_deduction}'`,
    'pay_rate' : `'${values.pay_rate}'`,
    'student_loan' : `'${values.student_loan}'`,
    'tax_credit' : `'${values.tax_credit}'`,
    'tax_rate' : `'${values.tax_rate}'`,
    'username' : `'${values.username}'`,
    'weekly_allowance' : `'${values.weekly_allowance}'`,
    'weekly_allowance_nontax' : `'${values.weekly_allowance_nontax}'`,
    'ird_number' : `'${values.ird_number}'`,
    'tax_code' : `'${values.tax_code}'`,
    'manager' : `'${params.userID}'`})
  })
  const data = await res.json()

  if (data.auth === false) {
    if (window.location.pathname !== '/login') {
    alert("Invalid Authentication Token.\nPlease login again.")
    navigate('/login')}
  }

  if (data.success === 'Success') {

    //If the new employee account is successfully created

    alert(`Employee was created successfully\n\tUsername: '${values.username}'\n\tPassword: '${data.password}'`) //Generated password is returned
    setChange(true)
    setNewEmployeeModalOpen(false)
} else {

  //If the new employee account was unsuccessful

      alert(`An error occured.\n\n\n\n${data.error}`)
    }
};

  return (
    <>
    <MaterialReactTable
      columns={columns}
      data={data}
      onEditingRowCancel={handleCancelRowEdits}
      enableEditing
      editingMode='row'
      enableFullScreenToggle={false}
      enablePinning
      initialState={{ columnPinning: { left: ['first_name']} }}
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={() => (
  <Button
    onClick={() => setNewEmployeeModalOpen(true)}
    variant="contained"
  >
    Create New Account
  </Button>
)}/>
      <NewEmployeeModal
      columns={columns2}
      open={newEmployeeModalOpen}
      onClose={() => setNewEmployeeModalOpen(false)}
      onSubmit={handleCreateNewRow}
      />
  </>
  );
};

export default EmployeeTable;



//example of creating a mui dialog modal for creating new rows
const NewEmployeeModal = ({ open, columns, onClose, onSubmit }) => {
const { register, handleSubmit, formState: { errors } } = useForm();

const validateSubmit = (information) => {
  
  if ([information.child_support,information.kiwisaver,information.student_loan].reduce((acc, curr) => acc + parseFloat(curr), 0) >= 100) {

    //Checking to see if the sum of percentages is less than 100%

    alert('Kiwisaver, child support, Student loan must be a sum less than 100')
  } else {
    onSubmit(information)
  }
};

return (
  <div className={String(open)}>
<div className={'mui-box-container-form'} >
<DialogTitle textAlign="center">Create New Account</DialogTitle>
<DialogContent>
<form onSubmit={handleSubmit(validateSubmit)}>
  <Stack
    sx={{
      minWidth: { xs: '300px', sm: '360px', md: '400px' },
      gap: '1.5rem',
      h6: {color: 'red',padding: '0rem'},
      padding: '20px 2px 2px 2px' 
    }}
  >
    {columns.map((column) => (
      <>
      <TextField
        key={column.accessorKey}
        label={column.header}
        placeholder={column.placeholder}
        {...register(column.accessorKey, { required: true,pattern: column.regex })}
      />
      {errors[column.accessorKey] && <h6>{column.helperText}</h6>}
      </>
    ))}
  </Stack>
  <div className='buttons-for-form'>
<Button onClick={onClose}>Cancel</Button>
<Button type="submit" variant="contained">
  Create New Account
</Button>
</div>
</form>
</DialogContent>
</div></div>
);
};