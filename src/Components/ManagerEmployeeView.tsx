import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Edit as EditIcon, Delete as DeleteIcon, Email as EmailIcon, Save as SaveIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,MenuItem,Stack,TextField,Tooltip } from '@mui/material';


function EmployeeTable() {
  let params = useParams()
  const [data, setData] = useState({});
  const [change, setChange] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const validateRequired = (value) => !!value.length;
  const validateEmail = (email) =>
    !!email.length &&
    email
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
  const validatePercentage = (value) => value >= 0 && value <= 100

  const validateCheck = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'child_support' || cell.column.id === 'tax_rate' || cell.column.id === 'kiwisaver' || cell.column.id === 'student_loan'
              ? validatePercentage(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
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
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        })
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'email'
      },
      {
        accessorKey: 'username',
        header: 'Username',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        })
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'bank_account',
        header: 'Bank account',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'ird_number',
        header: 'IRD Number',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'tax_code',
        header: 'Tax Code',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'kiwisaver',
        header: 'Kiwisaver',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'student_loan',
        header: 'Student loan',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One off deduction',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'tax_rate',
        header: 'Tax rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'final_pay',
        header: 'Final pay',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'weekly_allowance',
        header: 'Weekly Allowance',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'weekly_allowance_nontax',
        header: 'Weekly allowance Non tax',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
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
        type: 'number'
      },
      {
        accessorKey: 'tax_credit',
        header: 'Tax credit',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'benefits',
        header: 'Benefits',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
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
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        })
      },
      {
        accessorKey: 'pay_rate',
        header: 'Pay rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'bank_account',
        header: 'Bank account',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'ird_number',
        header: 'IRD Number',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'tax_code',
        header: 'Tax Code',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'student_loan',
        header: 'Student loan',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'one_off_deduction',
        header: 'One off deduction',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'tax_rate',
        header: 'Tax rate',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'final_pay',
        header: 'Final pay',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'weekly_allowance',
        header: 'Weekly Allowance',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'weekly_allowance_nontax',
        header: 'Weekly allowance Non tax',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'child_support',
        header: 'Child support',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'tax_credit',
        header: 'Tax credit',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
      },
      {
        accessorKey: 'benefits',
        header: 'Benefits',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...validateCheck(cell),
        }),
        type: 'number'
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
const handleCreateNewRow = (values) => {
  if (!Object.keys(validationErrors).length) {
  console.log(values)
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
const [values, setValues] = useState(() =>
columns.reduce((acc, column) => {
acc[column.accessorKey ?? ''] = '';
return acc;
}, {}),
);

const handleSubmit = () => {
//put your validation logic here
onSubmit(values);
onClose();
};

return (
  <div className={String(open)}>
<div className={'mui-box-container-form'} >
<DialogTitle textAlign="center">Create New Account</DialogTitle>
<DialogContent>
<form onSubmit={(e) => e.preventDefault()}>
  <Stack
    sx={{
      minWidth: { xs: '300px', sm: '360px', md: '400px' },
      gap: '1.5rem',
    }}
  >
    {columns.map((column) => (
      <TextField
        key={column.accessorKey}
        label={column.header}
        name={column.accessorKey}
        onChange={(e) =>
          setValues({ ...values, [e.target.name]: e.target.value })
        }
      />
    ))}
  </Stack>
</form>
<div className='buttons-for-form'>
<Button onClick={onClose}>Cancel</Button>
<Button color="secondary" onClick={handleSubmit} variant="contained">
  Create New Account
</Button>
</div>
</DialogContent>

</div></div>
);
};