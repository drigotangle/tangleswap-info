import { FC, useContext, useEffect } from "react";
import { Paper, Skeleton, Table, TableBody, TableContainer, TableHead, TableCell, Typography, Chip } from "@mui/material";
import { ChartWrapper, SkeletonWrapper, StyledTableCell, StyledTableRow, TokenImage } from './'
import { IPoolData } from "../interfaces";
import { AppContext, initialState } from "../state";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { logo, xLogo } from "../constants";

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
  useEffect(() => { pooList?.sort((a: IPoolData, b: IPoolData) => { return b.tvl - a.tvl }) }, [])


  return (<ChartWrapper>

    {state.poolData !== initialState.poolData

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
                  <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '4px' }}>
                    <TokenImage src={logo[row.token0] ?? xLogo} style={{ marginRight: '-10px', zIndex: 1 }} />
                    <TokenImage src={logo[row.token1] ?? xLogo} />
                    <Typography variant="h5">{row.symbol0}/{row.symbol1}{" "}<Chip label={(row.fee / 10000) + '%'} /></Typography>
                  </span>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">${Number(row.tvl * (usdPrice ?? 0)).toFixed(2)}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">${Number(row.volume24H * (usdPrice ?? 0)).toFixed(2)}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h5">${Number(row.volume7D * (usdPrice ?? 0)).toFixed(2)}</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      :

      <SkeletonWrapper><Skeleton variant="rectangular" width={1030} height={300} /></SkeletonWrapper>


    }</ChartWrapper>);
};

export default PoolDataTable;