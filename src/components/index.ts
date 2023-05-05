import { Grid, TableCell, TableRow } from "@mui/material";
import styled from "styled-components";

export const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2vw;
`

export const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10vh;
`

export const SkeletonWrapper = styled.div`
    width: max-content;
    height: max-content;
    margin: auto auto;
`

export const PaperWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4vw;
    width: 100vw;
    height: max-content;
    padding: 4vh;
`

export const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: auto auto;
    margin-top: 10vh;
`

export const StyledTableRow = styled(TableRow)`
    padding: 4vh;
    text-align: center;
`

export const StyledTableCell = styled(TableCell)`
    cursor: pointer;
`

export const ChartWrapper = styled.div`
    margin-bottom: 5vh;
`

export const PriceChangeSpan = styled.span`
  color: ${(props: { priceChange: any }) => props.priceChange < 0 ? 'red' : 'green'};
`;

export const GlassPanelWrapper = styled(Grid)`
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  position: relative;
  width: 100%;
  padding: 5vh;
`;

export const SpanWrapper = styled.div`
    width: max-content;
`

export const TokenImage = styled.img`
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 8px;
`;