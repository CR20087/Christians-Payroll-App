import styled from "styled-components"

function Footer() {


  return (
      <FooterDiv>
        
            <img src="/Christian-Payroll-App-Logo.png" alt="logo"  />
            <p>Christian's Payroll App</p>
        
      </FooterDiv>
  )
}



const FooterDiv = styled.div`
  display: flex;
  justify-self: center;
  flex-direction: row;
  height: fit-content;
  align-items: flex-end;

  p {
    align-self: center;
    font-weight: 670;
    font-size: large;
  }

`

export default Footer
