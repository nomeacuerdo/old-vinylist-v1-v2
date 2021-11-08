import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import { grey, blue } from '@material-ui/core/colors';

import { Cover } from '../styles';

import EnhancedTableHead from './TableHead';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  smol: {
    backgroundColor: grey[200],
    '&:nth-of-type(odd)': {
      backgroundColor: grey[400],
    },
  },
  swol: {
    backgroundColor: blue[50],
    '&:nth-of-type(odd)': {
      backgroundColor: blue[100],
    },
  },
}));

const CompleteTable = (props) => {
  const { collection } = props;

  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('artist');

  const namingMatrix = [
    // Style Changes
    ['Молчат Дома = Молчат Дома', 'Molchat Doma (Молчат Дома)'],
    ['Filter (2)', 'Filter'],
    ['Tool (2)', 'Tool'],
    ['Poison Idea / Pantera', 'Pantera / Poison Idea'],
    ['Prodigy [The] Featuring Sleaford Mods', 'Prodigy [The]'],
    // Who tf is Mock Gordon
    ['Mick Gordon', 'Doom'],
    ['Geinoh Yamashirogumi', 'Akira (Geinoh Yamashirogumi)'],
    ['Yoko Takahashi , Megumi Hayashibara', 'Evangelion (Yoko Takahashi)'],
    ['Seatbelts [The]', 'Cowboy Bebop (Seatbelts)'],
    ['AIR Sung By Gordon Tracks', 'Air'],
    // The artist formerly known as
    ['JARV IS...', 'Jarvis Cocker (JARV IS...)'],
    ['Trent Reznor And Atticus Ross', 'Watchmen'],
    // Various Artists means nothing
    ['Saturday Morning - Cartoons\' Greatest Hits', 'Saturday Morning (Various)'],
    ['Jojo Rabbit Original Motion Picture Soundtrack', 'Jojo Rabbit (Various)'],
    ['Trainspotting (Music From The Motion Picture)', 'Trainspotting (Various)'],
    ['Rodrigo D. No Futuro', 'Rodrigo D. No Futuro (Various)'],
    ['Dust Brothers [The]', 'Fight Club (The Dust Brothers)'],
  ];

  const stupidSpecificArtistNamingCriteria = (diskInfo, multi) => {
    let artist = multi
      ? diskInfo.artists.reduce((sum, itm) => {
        const normalizedName = itm.name.startsWith('The ') ? `${itm.name.substring(3)} [The]` : itm.name;
        return `${sum} ${normalizedName} ${itm.join}`;
      }, '').trim()
      : diskInfo.artists[0].name;

    artist = artist.startsWith('The ') ? `${artist.substring(3)} [The]`.trim() : artist;

    namingMatrix.forEach((dupla) => {
      let returnValue = artist;

      if (returnValue.startsWith('Various')) {
        returnValue = diskInfo.title;
      }

      returnValue = (returnValue === dupla[0]) ? dupla[1] : returnValue;

      artist = returnValue;
    });

    return artist;
  };

  const rows = collection.length > 0
    ? collection.map((item) => {
      const artist = item.basic_information.artists.length > 1
        ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
        : stupidSpecificArtistNamingCriteria(item.basic_information, false);

      return ({
        id: item.id,
        cover: item.basic_information.thumb,
        name: item.basic_information.title,
        artist,
        year: item.notes ? item.notes[1]?.value : '',
        date: item.notes ? item.notes[0].value : '',
        formats: item.basic_information.formats,
      });
    })
    : [];

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    if (property !== 'cover') {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }
  };

  const isSevenInch = (info) => info.formats[0]?.descriptions.includes('7"');

  const sizeCriteriaThenYearSort = (array) => {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const first = a[0];
      const second = b[0];

      if (isSevenInch(first) > isSevenInch(second)) return 1;
      if (isSevenInch(first) < isSevenInch(second)) return -1;

      if (order === 'asc') {
        if (first[orderBy] > second[orderBy]) return 1;
        if (first[orderBy] < second[orderBy]) return -1;
      } else {
        if (first[orderBy] < second[orderBy]) return 1;
        if (first[orderBy] > second[orderBy]) return -1;
      }

      if (first.year > second.year) return 1;
      if (first.year < second.year) return -1;

      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  };

  // eslint-disable-next-line
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const orderS = comparator(a[0], b[0]);
      if (orderS !== 0) return orderS;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function descendingComparator(a, b, orderByX) {
    if (b[orderBy] < a[orderByX]) {
      return -1;
    }
    if (b[orderBy] > a[orderByX]) {
      return 1;
    }
    return 0;
  }

  // eslint-disable-next-line
  function getComparator(orderS, orderByX) {
    return orderS === 'desc'
      ? (a, b) => descendingComparator(a, b, orderByX)
      : (a, b) => -descendingComparator(a, b, orderByX);
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  return (
    <TableContainer>
      <Table
        className={classes.table}
        aria-labelledby="tableTitle"
        size="medium"
        aria-label="enhanced table"
        stickyHeader
      >
        <EnhancedTableHead
          classes={classes}
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={rows.length}
        />
        <TableBody>
          { /* stableSort(rows, getComparator(order, orderBy)) */ }
          {
            rows.length === 0
              ? (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )
              : null
          }
          {
            sizeCriteriaThenYearSort(rows)
              .map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    className={isSevenInch(row) ? classes.smol : classes.swol}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Cover src={row.cover} alt={row.name} />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {
                        isSevenInch(row)
                          ? `[7"] ${row.name}`
                          : row.name
                      }
                    </TableCell>
                    <TableCell>{row.artist}</TableCell>
                    <TableCell align="center">{row.year}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                  </TableRow>
                );
              })
          }
          {rows === 0 && (
            <TableRow>
              <TableCell colSpan={6} />
            </TableRow>
          )}
          <TableRow>
            {
              /*
              (pagination.pages > 1 && pagination.pages > pagination.page)
                ? (
                  <TableCell colSpan={6}>
                    <Button variant="contained" color="primary" onClick={() => loadMore()}>
                      Load More...
                    </Button>
                  </TableCell>
                )
                : (
                  <TableCell colSpan={6}>
                    <Typography variant="caption" display="block" gutterBottom>
                      This is the end.
                    </Typography>
                  </TableCell>
                )
                */
            }
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

CompleteTable.propTypes = {
  collection: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default CompleteTable;
