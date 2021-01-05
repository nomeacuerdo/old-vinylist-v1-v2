import styled from 'styled-components';

const Container = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: center;
  height: 100vh;
  margin: 25px auto;

  @media (max-width: 460px) {
    flex-direction: column;
    justify-content: flex-start;
  }

  @media (min-width: 1020px) {
    max-width: 80vw;
  }
`;

const Sidebar = styled.div`
  flex-grow: 1;
  width: 100px;

  @media (max-width: 460px) {
    text-align: center;
    width: 100vw;
  }
`;

const RecordList = styled.div`
  flex-grow: 2;
  max-width: 715px;

  @media (min-width: 1020px) {
    max-width: auto;
  }
`;

const Logo = styled.img`
  max-height: 100px;
  position: fixed;
  z-index: 10;

  @media (max-width: 460px) {
    margin: auto;
    position: relative;
  }
`;

const Cover = styled.img`
  max-height: 100px;
`;

export {
  Container,
  Sidebar,
  RecordList,
  Logo,
  Cover,
};
