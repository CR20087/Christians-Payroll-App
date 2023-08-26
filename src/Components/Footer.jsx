import styled from "styled-components"

function Footer() {

  //Footer Element

  return (
      <FooterDiv>
        
            <img src="/Christian-Payroll-App-Logo.svg" alt="logo"  />
            <p>Christian's Payroll App</p>
        
      </FooterDiv>
  )
}

//Styling

const FooterDiv = styled.div`
  display: flex;
  justify-self: center;
  flex-direction: row;
  height: fit-content;
  align-items: flex-end;
  padding-top: 2rem;

  p {
    align-self: center;
    font-weight: 670;
    font-size: large;
  }

`

export default Footer
