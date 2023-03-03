import { useContext } from "react";
import { Paper, Skeleton, Table, TableBody, TableContainer, TableHead, TableCell } from "@mui/material";
import { StyledTableCell, StyledTableRow } from './'
import { IPoolData } from "../interfaces";
import { AppContext } from "../state";
import { SkeletonWrapper } from ".";
import { useNavigate } from "react-router-dom";



const PoolDataTable = () => {
  const { state } = useContext(AppContext)

  const navigate = useNavigate()

  return (

    state.poolData.length > 0 

    ?

    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <TableCell>Pool</TableCell>
            <TableCell>TVL</TableCell>
            <TableCell>Volume 24H</TableCell>
            <TableCell>Volume 7D</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {state.poolData.map((row: IPoolData) => (
            <StyledTableRow onClick={_ => navigate(`pools/${row.pool}`)} key={`${row.symbol0}-${row.symbol1}`}>
              <StyledTableCell>{row.symbol0}/{row.symbol1}{" "}{row.fee / 10000}%</StyledTableCell>
              <StyledTableCell>{row.tvl}</StyledTableCell>
              <StyledTableCell>{row.volume24H}</StyledTableCell>
              <StyledTableCell>{row.volume7D}</StyledTableCell> 
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    :

    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>
    
  );
};

export default PoolDataTable;