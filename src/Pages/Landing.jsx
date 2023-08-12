import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiLock } from "react-icons/ci";

function Landing() {

    return (
        <body>
            <Nav>
                <Logo to={"/"}>
                    <img src="./Christian-Payroll-App-Logo.svg" alt="logo" />
                    <p>Christian's Payroll App</p>
                </Logo>
                <Hyperlinks> 
                    <Support to={"/Support"}>Support & Doccumentation</Support>
                    <LoginButton to={"/Login"}>Login</LoginButton>
                </Hyperlinks>
            </Nav>
            <Info>
                <h1>Evolution of Christian's Payroll App</h1>
                <Payslips>
                    <h4>Payslips</h4>
                    <iframe src="Website_Payslip_example.pdf" title="Payslip Example PDF"></iframe>
                    <TextBox>
                        <p>Payslips are emailed to employees when a pay run is executed. The data that feeds into the payslip will be shown to Manager's prior to executing the pay run, to ensure all values are correct.
                            Delivery details of the payslip are able to be edited by Manager and Employee accounts within settings. Leave, if taken during the pay period, is inserted with a new header of the payslip.
                            If no leave occurs during the period no leave section is included.
                            <br></br><br></br>
                            The payslip design was originally designed within Google Docs, then exported as a Web Page file (html). This design did not have addequite width allocation. Because of this when this version
                            was used near every element was skewed from original position (Last payslip example is version 0). By seperating the css from the html file and deleting all the tab spaces ('&nbsp') the files
                            were now aable to be edited tidily. From here the CSS was adjusted to design the columns per each section. After the files were in working condition, font styles, weights, sizes were adjusted
                            to create an ideal payslip.
                            <br></br>
                            (
                            <a href="https://docs.google.com/document/d/1j2ebk1iyum8F68IOyYyG6s0WPCZr--0u3Tu4GJi6Glk/edit?usp=sharing">Link to original document</a>
                            ) 
                        </p>
                    </TextBox>
                </Payslips>
                <DualDetail>
                    <LogoDesign>
                    <div>
                        <h2>Original Design</h2>
                        <TextBox>
                            <p>Christian's Payroll App's original logo required improving... There was no pre-determined concepts related to colour scheme, nor image selection.</p>
                        </TextBox>
                        <img src="./Christian-Payroll-App-Logo-2.png" alt=""/>
                        </div>
                        
                        <div>
                        <h2>Current Design</h2>
                        <TextBox>
                            <p>Our current logo  has been designed with the correct concepts. The orange text and border are matching and are the warm (opposite) colour to the blue background. Our image represents CPA (Christian's Payroll App), making they design more complex. </p>
                        </TextBox>
                        <img src="./Christian-Payroll-App-Logo-3.png" alt=""/>
                        </div>
                    </LogoDesign>
                    <MaterialReactTable>
                        <img src="https://www.material-react-table.com/mrt_logo.svg" alt=""/>
                        <h2>Material React Table</h2>
                        <TextBox className="large-textbox">
                            Throughout Christian's Payroll app, I used Material React Table to display the data to users, and allow it to be editable.
                            Material React Table has many customizable components available. From Styling to whole new functionalities!
                            <br></br><br></br>
                            Material React Table is easy to use and a singular component Christian's Payroll App could embrace. Thus is it used for majourity
                            of menus and view.
                            <br></br><br></br>
                            An example of the usefullness of this component is the abilty to add custom action. Christian's Payroll App has used this feature in
                            multiple pages, such as the Manager leave request page. Where actions to approve or decline the request are available.
                        </TextBox>
                    </MaterialReactTable>
                </DualDetail>
            </Info>
        </body>
    )
}


const Nav = styled.div`
padding: 1.5rem;
background: linear-gradient(90deg, rgba(255,255,255,1) 6%, #0b3048 80%);
height: 100pt;
`

const DualDetail = styled.div`
display: flex;
justify-items:center;
width:100%;
`
const LogoDesign = styled.div`
div { margin-left: 18%; }
padding-top:2rem;
display: flex;
flex-direction: column;
gap: 5rem;
background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #0b3048 3%, #0b3048 98.5%, rgba(255,255,255,0) 100%);
width: 50%;
min-height: fit-content;
height: inherit;


img {
    width: 15%;
    min-width: 8rem;
}
`
const MaterialReactTable = styled.div`
padding-top:2rem;
width: 50%;
background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #0a3756 3%, #0a3756 98.5%, rgba(255,255,255,0) 100%);
min-height: fit-content;
height: inherit;

img {
    width: 10%;
    min-width: 6rem;
}

.large-textbox {
    width: 80%;
}
`
const Logo = styled(Link)`
display: flex;
text-decoration: none;
font-size: 2rem;
font-weight: 500;
font-family: 'Rockwell';
color: #06151f;
width: 30%;
float: left;
font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
p {
padding-top: 1rem;
}
`

const Hyperlinks = styled.div`
padding-top: 2.5rem;
display: flex;
justify-content: space-between;
font-size: 1rem;
width: 30%;
float: right;
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

const Support = styled(Link)`
    padding-top: 1rem;
    text-decoration: none;
    color: white;
    font-family: 'Comic-Sans';
    font-weight: 400;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`

const Payslips = styled.div`
    iframe {
        margin-left: 18%;
        width: 30%;
        height: 35rem;
        float: left;
    }
`

const TextBox = styled.div`
    float: left;
    padding-left: 5%;
    align-self: center;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    width: 30%;
    text-align: left;
`

const Info = styled.div`
    display: grid;
    gap: 8rem;
    width: 100%;
    justify-content: center;
    text-align: center;
    //background: linear-gradient(90deg, rgba(2,190,71,1) 6%, rgba(9,108,159,1) 96%);
`
export default Landing