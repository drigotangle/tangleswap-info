import { FC, useContext, useEffect } from "react";
import { Paper, Skeleton, Table, TableBody, TableContainer, TableHead, TableCell, Typography } from "@mui/material";
import { ChartWrapper, StyledTableCell, StyledTableRow } from './'
import { IPoolData } from "../interfaces";
import { AppContext } from "../state";
import { SkeletonWrapper } from ".";
import { useNavigate } from "react-router-dom";

interface IProps {
  pooList: IPoolData[] | undefined
  chain: string | undefined
  usdPrice?: number
}

const PoolDataTable: FC<IProps> = (props) => {
  const { state } = useContext(AppContext)
  const { pooList, usdPrice } = props
  const navigate = useNavigate()
  
  const { chain } = state
  /**
   * @dev use it to change the orders by the pools are displayed. Currently only TVL.
   */
  useEffect(() => {pooList?.sort((a: IPoolData, b: IPoolData) => { return b.tvl - a.tvl})}, [])
  

  return (<ChartWrapper>

    {pooList !== undefined && pooList.length > 0

    ?

<TableContainer component={Paper}>
  <Table aria-label="simple table">
    <TableHead>
      <StyledTableRow>
        <TableCell><Typography variant="h5">Pool</Typography></TableCell>
        <TableCell><Typography variant="h5">TVL</Typography></TableCell>
        <TableCell><Typography variant="h5">Volume 24H</Typography></TableCell>
        <TableCell><Typography variant="h5">Volume 7D</Typography></TableCell>
      </StyledTableRow>
    </TableHead>
    <TableBody>
      {pooList?.map((row: IPoolData) => (
        <StyledTableRow onClick={_ => navigate(`/${chain}/Pools/${row.pool}`)} key={`${row.symbol0}-${row.symbol1}`}>
          <StyledTableCell>
            <Typography variant="h5">{row.symbol0}/{row.symbol1}{" "}{row.fee / 10000}%</Typography>
          </StyledTableCell>
          <StyledTableCell>
            <Typography variant="h5">${row.tvl * (usdPrice ?? 0)}</Typography>
          </StyledTableCell>
          <StyledTableCell>
            <Typography variant="h5">${row.volume24H * (usdPrice ?? 0)}</Typography>
          </StyledTableCell>
          <StyledTableCell>
            <Typography variant="h5">${row.volume7D * (usdPrice ?? 0)}</Typography>
          </StyledTableCell> 
        </StyledTableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

    :

    <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300}  /></SkeletonWrapper>
    
    }</ChartWrapper>);
};

export default PoolDataTable;