import { useContext } from 'react'
import { Card } from "@mui/material"
import styled from "styled-components"
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { AppContext } from "../state";
import { IToken } from '../interfaces';

const CardWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

const TopMoversCard = () => {
    const { state } = useContext(AppContext)
    const { tokenData } = state
    return(<>
        {tokenData.map((data: IToken | any) => {
            return(<>
                <Card>
                    <CardWrapper>
                        <QuestionMarkIcon />
                        {data.tokenSymbol}
                    </CardWrapper>           
                </Card>            
            </>)

        })}
    </>)
}

export default TopMoversCard