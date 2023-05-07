import { FC, useContext, useEffect, useState } from "react";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  Typography,
  Chip,
  Pagination,
  TableFooter,
  TableRow,
  Box
} from "@mui/material";
import { ChartWrapper, SkeletonWrapper, StyledTableCell, StyledTableRow, TokenImage } from "./";
import { IPoolData } from "../interfaces";
import { AppContext, initialState } from "../state";
import { useNavigate } from "react-router-dom";
import { logo, xLogo } from "../constants";
import styled from "styled-components";
import { formatCompactNumber } from "../functions";

interface IProps {
  pooList: IPoolData[] | undefined;
  chain: string | undefined;
  usdPrice?: number;
}

const PoolDataTable: FC<IProps> = (props) => {
  const { state } = useContext(AppContext);
  const { pooList, usdPrice } = props;
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const { chain } = state;


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const StyledPagination = styled(Pagination)`
    margin: auto;
  `

  return (
    <ChartWrapper>
      {state.poolData !== initialState.poolData ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  <TableCell>
                    <Typography variant="h5">Pool</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">TVL</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Volume 24H</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Volume 7D</Typography>
                  </TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {pooList
                  ?.slice((page - 1) * 10, page * 10)
                  .map((row: IPoolData) => (
                    <StyledTableRow
                      onClick={(_) => navigate(`/${chain}/Pools/${row.pool}`)}
                      key={`${row.symbol0}-${row.symbol1}`}>
                      <StyledTableCell>
                        <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '4px' }}>
                          <TokenImage src={logo[row.token0] ?? xLogo} style={{ marginRight: '-10px', zIndex: 1 }} />
                          <TokenImage src={logo[row.token1] ?? xLogo} />
                          <Typography variant="h5">{row.symbol0}/{row.symbol1}{" "}<Chip label={(row.fee / 10000) + '%'} /></Typography>
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h5">${formatCompactNumber(Number(row.tvl * Number(usdPrice)))}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h5">${formatCompactNumber(Number(row.volume24H * Number(usdPrice)) * (usdPrice ?? 0))}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h5">${formatCompactNumber(Number(row.volume7D * Number(usdPrice)))}</Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box width="100%" display="flex" justifyContent="center">
                      <StyledPagination
                        count={Math.ceil(pooList ? pooList?.length / 10 : 0)}
                        page={page}
                        onChange={handlePageChange}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        size="large"
                        color='primary'
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      ) : (
        <SkeletonWrapper>
          <Skeleton variant="rectangular" width={1030} height={300} />
        </SkeletonWrapper>
      )}
    </ChartWrapper>
  )
}

export default PoolDataTable