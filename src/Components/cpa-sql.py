import pyodbc 

database = 'CPA'
server = 'cpa-server.database.windows.net'
username = 'CReid' 
password = 'iKErTyTZupa789@' 
driver='{ODBC Driver 18 for SQL Server}'
    
conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';DATABASE='+database+';ENCRYPT=yes;UID='+username+';PWD='+ password)
cur = conn.cursor()