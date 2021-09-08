import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from '@material-ui/core';

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
}));

const CompleteTable = (props) => {
  const { loadMore, collection, pagination } = props;

  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('artist');

  const rows = collection.length > 0
    ? collection.map((item) => {
      const artist = item.basic_information.artists.length > 1
        ? item.basic_information.artists.reduce((sum, itm) => {
          const normalizedName = itm.name.startsWith('The ') ? `${itm.name.substring(3)} [The]` : itm.name;
          return `${sum} ${normalizedName} ${itm.join}`;
        }, '').trim()
        : item.basic_information.artists[0].name;

      return ({
        id: item.id,
        cover: item.basic_information.thumb,
        name: item.basic_information.title,
        artist: artist.startsWith('The ') ? `${artist.substring(3)} [The]`.trim() : artist,
        year: item.basic_information.year,
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

  const stupidDoubleSort = (array) => {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const first = a[0];
      const second = b[0];

      if (isSevenInch(first) > isSevenInch(second)) return 1;
      if (isSevenInch(first) < isSevenInch(second)) return -1;

      if (first[orderBy] > second[orderBy]) return 1;
      if (first[orderBy] < second[orderBy]) return -1;

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
          stupidDoubleSort(rows)
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
            }
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

CompleteTable.propTypes = {
  loadMore: PropTypes.func.isRequired,
  collection: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pagination: PropTypes.shape().isRequired,
};

export default CompleteTable;
