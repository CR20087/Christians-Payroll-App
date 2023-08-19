import { Link } from "react-router-dom"
import styled from "styled-components"
import Footer from "../Components/Footer"

function Support() {
    return (
        <SupportDiv>
        <Nav>
            <Logo to={"/"}>
                <img src="./Christian-Payroll-App-Logo.svg" alt="logo" />
                <p>Christian's Payroll App</p>
            </Logo>
            <Hyperlinks> 
            <Register>
                    Register
                    <div className="hover-content">
                    <li><a href="/Register/manager/1">Manager</a></li>
                    <li><a href="/Register/1">Employee</a></li>
                    </div>
                </Register>
                <Docs to={"/Support"}>Support & Doccumentation</Docs>
                <LoginButton to={"/Login"}>Login</LoginButton>
            </Hyperlinks>
        </Nav>
        <Page className={`transition ${sessionStorage.getItem('role')}`}>
            <h1>Registering</h1>
            <Text>
                <h4 className="manager-header">Manager</h4>
                Managers get set-up by first registering. Completing the registration form
                creates a login based on the username and password entered. Details such as
                business name, suburb and entity name will be viewed on employee payslips. Personal details
                such as first, last name and contact details will be available to employees in the payslip email.
                Contact method may be selected as either email or phone number.
                <br></br><br></br>
                To make an employee account manager roles are required to make the account (In the employee view page), and require all relevant pay information.
                <br></br><br></br>
                <h4 className="employee-header">Employees</h4>
                Employees get registered by first receiving login details from their manager. If employees try to login
                without first registerging their account, they will receive a notifcation explaining to register and 
                activate their account by completing the registration form.<br></br>
                The register form will ask for only personal details, no pay related details. To change your pay details,
                for example; Student loan, benefits etc, contact your manager. Details requested such as phone number are for
                managers to use only. All other details; Name, address aand email address are used for payslips.<br></br>
                Once registered, your given login will now work and you can acces your employee portal. (Note: To change your
                default password, edit in settings).
                <br></br><br></br>
                <h4>Input Validation</h4>
                <li>Username</li>
                <li>a-z | A-Z | 0-9 | 1-30chars | no spaces</li>
                <li>Password</li>
                <li>a-z | A-Z | 0-9 | 1-30chars</li>
                <li>First name</li>
                <li>a-z | A-Z | no spaces</li>
                <li>Last Name</li>
                <li>a-z | A-Z | no spaces</li>
                <li>Email</li>
                <li>a-z | A-Z | 0-9 | 'string'@string' | no spaces</li>
                <li>Phone</li>
                <li> 0-9 | optional '#,+' |1-13chars | no spaces</li>
                <li>Address</li>
                <li>a-z | A-Z | 0-9 </li>
                <li>Postcode</li>
                <li> 0-9 | 1-4chars | no spaces</li>
                <li>Suburb</li>
                <li>a-z | A-Z | no spaces</li>
                <h5>Manager Only</h5>
                <li>Entity Name</li>
                <li>a-z | A-Z | 0-9 </li>
                <li>Business name</li>
                <li>a-z | A-Z | 0-9 </li>
            </Text>

            <h1>Login</h1>
            <Text>
                <h4 className="manager-header">Manager</h4>
                Once a manager have created their account, their login will become functional immediately.
                When entered manager's will be transported  to the Manager portal.
                <br></br><br></br>
                <h4 className="employee-header">Employee</h4>
                If you have recentley received a login from your manager you will be required to register the account
                before you can gain acces to your portal. To register, go to the <a href="/Register/1">Employee Register</a> page.
                <br></br>
                Once registered enter your login details and you will be granted access to your portal now. If issues persist, observe
                the error returned when attempting to login, otherwise contatct your manager.
            </Text>

            <h1>Timesheets</h1>
            <Text>
                <h4 className="manager-header">Manager</h4>
                Managers can view their employee's timesheets within their portal. This view represent what the employee sees aswell.
                Maanagers cannot edit an employees timesheet, they will have to contctc the employee to sort the issue. This allows a good model
                for mangers to manage an employee's work.
                <br></br><br></br>
                <h4 className="employee-header">Employee</h4>
                Employees can create a new timesheet by creaating a new entry, this will autiomatically create a timesheet.
                <br></br>
                A timesheet entry requires the date of work, the start / end time, and total time of any unpaid break during the start to end time period.
            </Text>

            <h1>Leave</h1>
            <Text>
                <h4 className="manager-header">Manager</h4>
                Managers can view employee leave requests and manage them by either clicking the 'check-mark' action button to aapprove, or the cross to decline the request. 
                <br></br><br></br>
                Please not that employees are not eligible for paid leave whislt they have worked for less than 1 year (Calculated by account creation date). However special leave such as 'Statutory Holidays' are
                paid as there is no eligibilty criteria.
                Employees are paid per leave day, and are paid an average of their hours worked per day.
                <br></br><br></br>
                <h4 className="employee-header">Employee</h4>
                Employees can submit leave requests to their manager. The required information for a request is the starting date (starting 12:00AM), ending date (ending 11:59PM) and leave type. You can check the status of your
                leve request within the leave menu. If accepted, it will be shown on your payslip with calculated wages for the period.

            </Text>

            <h1>Pay Run</h1>
            <Text>
                <h4 className="manager-header">Manager</h4>
                Managers can view the pay-run page, where concise details of the payslip for each employee can be seen. The option to either pay all or selected employees is available and will generate a payslip and send it to the employee
                during the execution.
                <br></br><br></br>
                The pyrun process is once a payrun is executed, the information will become stored in a past payrun table making it immutable. Then a payslip is generated from this information, and emiled to the employees email they have defined.
                Now the py-run is complete and no further actions are required. 
            </Text>

            <h1>Payslips</h1>
            <Text>
                <h4 className="employee-header">Employee</h4>
                Payslips will include the totl balances of various incomes and dedecutions of which affect your total pay. Ordinary Pay is your total hours paid by your hourly rate. Leave (if taken) can be seen within your payslip with information regarding the dates and pay for your leave. 
            </Text>
            <Footer/>
        </Page>
        
        </SupportDiv>
    )
}

const SupportDiv = styled.div`
    .transition {
        animation: fade 0.5s linear;
    @keyframes fade {
      0% {
      opacity:0%
      }
      100% {
      opacity: 100%;
      }
    }
    }
    .manager {
        .manager-header {
            background-color: yellow;
            width: fit-content;
        }
    }
    .employee {
        .employee-header {
            background-color: yellow;
            width: fit-content;
        }
    }
`

const Nav = styled.div`
padding: 1.5rem;
background: linear-gradient(90deg, rgba(255,255,255,1) 6%, #0b3048 80%);
height: 100pt;
`
const Logo = styled(Link)`
display: flex;
text-decoration: none;
font-size: 2rem;
font-weight: 500;
font-family: 'Rockwell';
color: #06151f;
width: 30%;
height: 8rem;
float: left;
font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
p {
padding-top: 1rem;
}
`
const Hyperlinks = styled.div`
padding-top: 2.5rem;
gap: 1rem;
display: flex;
justify-content: space-between;
font-size: 1rem;
width: 40%;
float: right;
height: fit-content;
p {
    text-align: center;
}
`
const LoginButton = styled(Link)`
padding: 1rem 1.5rem;
height: 20%;
text-decoration: none;
font-family: 'Comic-Sans';
color: #313131;
background: white;
box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.9);
border: 2px solid black;
margin-right: 2rem;
font-weight: 600;
float: right;
border-radius: 10px;
font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
cursor: pointer;
:hover {
    background: #404040;
    color: #ffffff;
}
`

const Register = styled.div`
     padding-top: 1rem;
    text-decoration: none;
    color: white;
    font-family: 'Comic-Sans';
    font-weight: 400;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    height: fit-content;

    .hover-content {
        padding-top: 1rem;
        display: none;
        position: absolute;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        height: fit-content;
        
        a {
            color: white;
            text-decoration: none;
            
        }
    }
    :hover {
        .hover-content {
            display: flex;
            
        }
    }
`

const Docs = styled(Link)`
    padding-top: 1rem;
    text-decoration: none;
    color: white;
    font-family: 'Comic-Sans';
    font-weight: 400;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    height: fit-content;
`
const Page = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;

    h1 {
        padding-top: 2rem;
    }
`

const Text = styled.div`
    text-align: justify;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    width: 40%;
    height: fit-content;

    li {
        display: inline-flex;
        width: 50%;
        padding-top:5px;
    }
`
export default Support