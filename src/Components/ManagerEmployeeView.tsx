import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon, Save as SaveIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,MenuItem,Stack,TextField,Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';


function EmployeeTable() {
  let params = useParams()
  const [data, setData] = useState({});
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateCheck = useCallback(
    (cell) => {
      
      console.log(`${cell.id}\t${cell.column.columnDef.regex.test(cell.getValue())}`)
      return {
        error: true,
        helperText: cell.column.columnDef.helperText,
      };
    },
    [validationErrors],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'first_name',
        header: 'First Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "First Name must be: Letters",
        regex: /^[A-Za-z]*$/
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Last Name must be: Letters",
        regex: /^[A-Za-z]*$/
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
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
        }),
        helperText: "User name must be: Alphanumerical",
        regex: /^[a-zA-Z0-9]{1,30}$/
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Pay rate must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'bank_account',
        header: 'Bank account',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Bank account must be: 8-12 digits",
        regex: /^\d{8,12}$/
      },
      {
        accessorKey: 'ird_number',
        header: 'IRD Number',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "IRD number must be: 9 digits (Optional '-')",
        regex: /^\d{3}-?\d{3}-?\d{3}$/
      },
      {
        accessorKey: 'tax_code',
        header: 'Tax Code',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Tax code must be: <5 charaters, Captial letters",
        regex: /^[A-Z]{1,4}$/
      },
      {
        accessorKey: 'kiwisaver',
        header: 'Kiwisaver',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Kiwisaver must be: >0 and <100, Number/Float",
        regex: /^(0*(?:[1-9][0-9]?|99)(?:\.\d+)?|0?\.\d+)$/
      },
      {
        accessorKey: 'student_loan',
        header: 'Student loan',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Student loan must be: >0 and <100, Number/Float",
        regex: /^(0*(?:[1-9][0-9]?|99)(?:\.\d+)?|0?\.\d+)$/
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One off deduction',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "One off deduction must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'tax_rate',
        header: 'Tax rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Tax rate must be: >0 and <100, Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'final_pay',
        header: 'Final pay',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Final pay must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'weekly_allowance',
        header: 'Weekly Allowance',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Weekly allowance must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'weekly_allowance_nontax',
        header: 'Weekly allowance Non tax',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
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
        }),
        helperText: "'Child support must be: >0 and <100, Number/Float",
        regex: /^(0*(?:[1-9][0-9]?|99)(?:\.\d+)?|0?\.\d+)$/
      },
      {
        accessorKey: 'tax_credit',
        header: 'Tax credit',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Tax credit must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'benefits',
        header: 'Benefits',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        helperText: "Benefits must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'created_on',
        header: 'Created on',
        enableEditing: false,
        
      }
    ],
    [],
  );

  const columns2 = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        helperText: "User name must be: Alphanumerical",
        regex: /^[a-zA-Z0-9]{1,30}$/
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay rate',
        helperText: "Pay rate must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'bank_account',
        header: 'Bank account',
        helperText: "Bank account must be: 8-12 digits",
        regex: /^\d{8,12}$/
      },
      {
        accessorKey: 'ird_number',
        header: 'IRD Number',
        helperText: "IRD number must be: 9 digits (optional '-')",
        regex: /^\d{3}-?\d{3}-?\d{3}$/
      },
      {
        accessorKey: 'tax_code',
        header: 'Tax Code',
        helperText: "Tax code must be: <5 charaters, Captial letters",
        regex: /^[A-Z]{1,4}$/
      },
      {
        accessorKey: 'student_loan',
        header: 'Student loan',
        helperText: "Student loan must be: >0 and <100, Number/Float",
        regex: /^(0*(?:[1-9][0-9]?|99)(?:\.\d+)?|0?\.\d+)$/
      },
      {
        accessorKey: 'kiwisaver',
        header: 'Kiwisaver',
        helperText: "Kiwisaver must be: >0 and <100, Number/Float",
        regex: /^(0*(?:[1-9][0-9]?|99)(?:\.\d+)?|0?\.\d+)$/
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One off deduction',
        helperText: "One off deduction must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'tax_rate',
        header: 'Tax rate',
        helperText: "Tax rate must be: >0 and <100, Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'final_pay',
        header: 'Final pay',
        helperText: "Final pay must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'weekly_allowance',
        header: 'Weekly Allowance',
        helperText: "Weekly allowance must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'weekly_allowance_nontax',
        header: 'Weekly allowance Non tax',
        helperText: "Weekly allowance non-tax must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'child_support',
        header: 'Child support',
        helperText: "'Child support must be: >0 and <100, Number/Float",
        regex: /^(0*(?:[1-9][0-9]?|99)(?:\.\d+)?|0?\.\d+)$/
      },
      {
        accessorKey: 'tax_credit',
        header: 'Tax credit',
        helperText: "Tax credit must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      },
      {
        accessorKey: 'benefits',
        header: 'Benefits',
        helperText: "Benefits must be: Positve Number/Float",
        regex: /^\d+(\.\d+)?$/
      }
    ],
    [],
  );

  useEffect(() => {
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/'${params.userID}'`)
        const data = await res.json()

        console.log(data)

        setData(data.results)
    } 
        
    fetchData()

},[params.userID,change])

const handleCancelRowEdits = () => {
  setValidationErrors({});
};

const handleSaveRow = async ({ exitEditingMode, row, values }) => {
  //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
  console.log(values)
  if (!Object.keys(validationErrors).length) {
  const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/update/'${values.bank_account}'/'${values.benefits}'/'${values.child_support}'/'${values.email}'/'${values.final_pay}'/'${values.first_name}'/'${values.kiwisaver}'/'${values.last_name}'/'${values.one_off_deduction}'/'${values.pay_rate}'/'${values.phone}'/'${values.student_loan}'/'${values.tax_credit}'/'${values.tax_rate}'/'${values.username}'/'${row.original.username}'/'${values.weekly_allowance}'/'${values.weekly_allowance_nontax}'/'${values.ird_number}'/'${values.tax_code}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`${values.first_name} ${values.last_name} (${values.username}) was updated successfully`)
    setChange(true)}
    else {
      alert(`An error occured.\n\n\n\n${data.error}`) }

  exitEditingMode(); 
  }
};
const handleCreateNewRow = async (values) => {
  console.log(values)

  const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/new/'${values.bank_account}'/'${values.benefits}'/'${values.child_support}'/'${values.final_pay}'/'${values.kiwisaver}'/'${values.one_off_deduction}'/'${values.pay_rate}'/'${values.student_loan}'/'${values.tax_credit}'/'${values.tax_rate}'/'${values.username}'/'${values.weekly_allowance}'/'${values.weekly_allowance_nontax}'/'${values.ird_number}'/'${values.tax_code}'/'${params.userID}'`)
  const data = await res.json()

  if (data.success === 'Success') {
    alert(`Employee was created successfully\n\tUsername: '${values.username}'\n\tPassword: '${data.password}'`)
    setChange(true)
    setCreateModalOpen(false)
} else {
      alert(`An error occured.\n\n\n\n${data.error}`)
    }
};
const DeleteAccount = async (row) => {
  console.log(row)
  if (window.confirm(`Are you sure you want to permanently delete\n\t ${row.original.first_name} ${row.original.last_name} (${row.original.username}) `)) {
    
      const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/employee-list/delete/'${row.origninal.username}'`)
      const data = await res.json()

      console.log(data)
      if (data.success === 'true') {
        alert(`${row.original.first_name} ${row.original.last_name} (${row.original.username}) was deleted successfully`)
        setChange(true)}
        else {
          alert(`An error occured.\n\n\n\n${data.error}`)
        }
  }
}

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
      /*renderRowActions={({ row }) => (
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
          <IconButton
            color= 'secondary'
            onClick={() =>
              window.open(
                `mailto:${row.original.email}`,
              )
            }
          >
            <EmailIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              DeleteAccount(row)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )} */ //Fix in future
      renderTopToolbarCustomActions={() => (
  <Button
    color="secondary"
    onClick={() => setCreateModalOpen(true)}
    variant="contained"
  >
    Create New Account
  </Button>
)}/>
      <CreateNewAccountModal
      columns={columns2}
      open={createModalOpen}
      onClose={() => setCreateModalOpen(false)}
      onSubmit={handleCreateNewRow}
      />
  </>
  );
};

export default EmployeeTable;



//example of creating a mui dialog modal for creating new rows
const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
const { register, handleSubmit, formState: { errors } } = useForm();
const [values, setValues] = useState(() =>
columns.reduce((acc, column) => {
acc[column.accessorKey ?? ''] = '';
return acc;
}, {}),
);

const validateSubmit = (information) => {
  
  if ([information.child_support,information.kiwisaver,information.student_loan].reduce((acc, curr) => acc + parseFloat(curr), 0) > 0) {
    alert('Kiwisaver, child support, Student loan must be a sum less than 100 ')
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
      h6: {color: 'red',padding: '0rem'}
      
    }}
  >
    {columns.map((column) => (
      <>
      <TextField
        key={column.accessorKey}
        label={column.header}
        {...register(column.accessorKey, { required: true,pattern: column.pattern })}
      />
      {errors[column.accessorKey] && <h6>{column.helperText}</h6>}
      </>
    ))}
  </Stack>
  <div className='buttons-for-form'>
<Button onClick={onClose}>Cancel</Button>
<Button color="secondary" type="submit" variant="contained">
  Create New Account
</Button>
</div>
</form>

</DialogContent>

</div></div>
);
};