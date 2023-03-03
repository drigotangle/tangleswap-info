import { TableCell, TableRow } from "@mui/material";
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

export const StyledTableRow = styled(TableRow)`
    padding: 4vh;
`

export const StyledTableCell = styled(TableCell)`
    cursor: pointer;
`