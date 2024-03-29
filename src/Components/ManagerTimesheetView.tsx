import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

function TimesheetView() {
  const navigate = useNavigate()
  let params = useParams()
  const [data, setData] = useState({});

  const columns = useMemo( //Column Defenitions
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'WeekStartDate',
        header: 'Period Start',
      },
      {
        accessorKey: 'WeekEndDate',
        header: 'Period End',
      },
      {
        accessorKey: 'monday_hours_worked',
        header: 'Monday',
      },
      {
        accessorKey: 'tuesday_hours_worked',
        header: 'Tuesday',
      },
      {
        accessorKey: 'wednesday_hours_worked',
        header: 'Wednesday',
      },
      {
        accessorKey: 'thursday_hours_worked',
        header: 'Thursday',
      },
      {
        accessorKey: 'friday_hours_worked',
        header: 'Friday',
      },
      {
        accessorKey: 'saturday_hours_worked',
        header: 'Saturday',
        size:50
      },
      {
        accessorKey: 'sunday_hours_worked',
        header: 'Sunday',
        size:50
      },
      {
        accessorKey: 'total_hours_worked',
        header: 'Total Hours',
      },
      {
        accessorKey: 'total_unpaid_break',
        header: 'Total Unpaid Break',
      }
    ],
    [],
  );


  useEffect(() => {

    async function fetchData()  {

      //Fetching page data
      const auth_key = Cookies.get('auth_key');
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/timesheets`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username : params.userID,auth_key : auth_key})
        })
        const data = await res.json()

        if (data.auth === false) {
          if (window.location.pathname !== '/login') {
          alert("Invalid Authentication Token.\nPlease login again.")
          navigate('/login')}
        }

        setData(data.results) //Setting data
    } 
        
    fetchData()

},[params.userID])




  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableFullScreenToggle={false}
        enablePinning
        initialState={{ columnPinning: { left: ['username']} }}
        renderDetailPanel={({ row }) => ( //Shows the Entrys within each timesheet in a dropdown menu
          <Box
            sx={{
              display: 'grid',
              margin: 'auto',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              width: '50%',
              float: 'left'
            }} //deail paanel styling
          >
            <Typography className='title-details'>Entry ID</Typography>
            <Typography className='title-details'>Date</Typography>
            <Typography className='title-details'>Start Time</Typography>
            <Typography className='title-details'>End Time</Typography>
            <Typography className='title-details'>Pay Type</Typography>
            <Typography className='title-details'>Unpaid break</Typography>
            <Typography className='title-details'>Comments</Typography>
            {row.original.timesheet_entrys.map((entry) => (
              <>
            <Typography>{entry.timesheet_entry_id}</Typography>
            <Typography>{entry.date}</Typography>            
            <Typography>{entry.start_time}</Typography>            
            <Typography>{entry.end_time}</Typography>            
            <Typography>{entry.pay_type}</Typography>            
            <Typography>{entry.unpaid_break}</Typography>            
            <Typography>{entry.comments}</Typography>            
            </>            
            )
           )}
          </Box>
        )}
        />
     </>
    )
}
export default TimesheetView;