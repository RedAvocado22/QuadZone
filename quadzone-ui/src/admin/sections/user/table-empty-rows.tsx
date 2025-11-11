import type { TableRowProps } from '@mui/material/TableRow';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type TableEmptyRowsProps = TableRowProps & {
  emptyRows: number;
  height?: number;
  colSpan?: number;
};

export function TableEmptyRows({ emptyRows, height, colSpan = 7, sx, ...other }: TableEmptyRowsProps) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={[height && { height: height * emptyRows }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <TableCell colSpan={colSpan} />
    </TableRow>
  );
}
