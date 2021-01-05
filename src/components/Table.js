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
      const artist = item.basic_information.artists.reduce((sum, itm) => `${sum}, ${itm.name}`, '');

      return ({
        id: item.id,
        cover: item.basic_information.thumb,
        name: item.basic_information.title,
        artist: artist.slice(2, artist.length),
        date: item.notes ? item.notes[0].value : '',
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
          {stableSort(rows, getComparator(order, orderBy))
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
                  <TableCell align="right">
                    <Cover src={row.cover} alt={row.name} />
                  </TableCell>
                  <TableCell component="th" id={labelId} scope="row" padding="none">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.artist}</TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                </TableRow>
              );
            })}
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
