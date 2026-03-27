import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  position: relative;
  width: fit-content;
  margin-bottom: 50px;
`;

function Main() {
  return (
    <Wrapper>
      <Container>
        <TitleWrapper>안녕</TitleWrapper>
      </Container>
    </Wrapper>
  );
}

export default Main;
