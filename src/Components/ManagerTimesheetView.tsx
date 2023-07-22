import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { useParams } from 'react-router-dom';

function TimesheetView() {
  let params = useParams()
  const [data, setData] = useState({});

  const columns = useMemo(
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
    console.log("fetch")    
    async function fetchData()  {
        const res = await fetch(`https://cpa-flask.azurewebsites.net/manager/timesheets/'${params.userID}'`)
        const data = await res.json()

        console.log(data)

        setData(data.results)
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
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: 'grid',
              margin: 'auto',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
              width: '50%',
              float: 'left'
            }}
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