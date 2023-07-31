import styled from "styled-components";
import { Link } from "react-router-dom";
import { CiLock } from "react-icons/ci";

function Landing() {

    return (
        <body>
            <Nav>
                <Logo to={"/"}>
                    <img src="./Christian-Payroll-App-Logo.svg" alt="logo" width={150} />
                    <p>Christian's Payroll App</p>
                </Logo>
                <Hyperlinks> 
                    <Support to={"/Support"}>Support & Doccumentation</Support>
                    <LoginButton to={"/Login"}>Login</LoginButton>
                </Hyperlinks>
            </Nav>
            <Info>
                <h1>Welcome!</h1>
                <br></br>
                <Payslips>
                <h4>Payslips</h4>
                <iframe src="Website_Payslip_example.pdf" title="Payslip Example PDF"></iframe>
                <p>Payslips Text </p>
                </Payslips>
            </Info>
        </body>
    )
}


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

    p {
        float: left;
        padding-left: 5rem;
        align-self: center;
    }
    
    iframe {
        margin-left: 18%;
        width: 30%;
        height: 35rem;
        float: left;
    }
`

const Info = styled.div`
    justify-content: center;
    text-align: center;
    //background: linear-gradient(90deg, rgba(2,190,71,1) 6%, rgba(9,108,159,1) 96%);
`
export default Landing