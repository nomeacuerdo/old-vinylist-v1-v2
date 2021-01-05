import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Yo from './assets/nomeacuerdo.png';
import Table from './components/Table';

import {
  Container,
  Sidebar,
  RecordList,
  Logo,
} from './styles';

const App = () => {
  const [collection, setCollection] = useState([]);
  const [pagination, setPagination] = useState({});

  const fetchData = async (url) => axios.get(url, {
    headers: {
      Authorization: 'Discogs key=PjNgHzSjSNIULkrCsSmT, secret=zwvQZAPKYBJmNfJxzxtlUfWIbTblEkAf, token=uuIWTZNgdYAOOFhQJRokeWBrTcDsrQYMHwaPJRov',
      'user-agent': 'Spart/0.1 +https://github.com/nomeacuerdo/spart',
    },
  }).catch((e) => console.log(e));

  const loadMore = async () => {
    const { data } = await fetchData(pagination.urls.next);

    setCollection([...collection, ...data.releases]);
    setPagination(data.pagination);
  };

  useEffect(async () => {
    const { data } = await fetchData('https://api.discogs.com/users/no-me-acuerdo/collection/folders/0/releases');
    setCollection(data.releases);
    setPagination(data.pagination);
  }, []);

  return (
    <Container>
      <Sidebar>
        <Logo src={Yo} alt="nomeacuerdo" />
      </Sidebar>
      <RecordList>
        <Table
          loadMore={loadMore}
          collection={collection}
          pagination={pagination}
        />
      </RecordList>
    </Container>
  );
};

export default App;
