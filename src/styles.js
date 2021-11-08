import styled from 'styled-components';

const mobileWidth = '690px';
const tabletWidth = '1020px';

const Container = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: center;
  margin: 25px auto;

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    justify-content: flex-start;
  }

  @media (min-width: ${tabletWidth}) {
    max-width: 80vw;
  }
`;

const Sidebar = styled.div`
  flex-grow: 0;
  width: 150px;

  @media (max-width: ${mobileWidth}) {
    text-align: center;
    width: 100vw;
  }
`;

const RecordList = styled.div`
  flex-grow: 2;
  // max-width: 715px;

  @media (min-width: ${tabletWidth}) {
    max-width: auto;
  }
`;

const Logo = styled.img`
  justify-self: flex-start;
  flex-grow: 0;
  max-height: 100px;
  z-index: 10;

  @media (max-width: ${mobileWidth}) {
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
