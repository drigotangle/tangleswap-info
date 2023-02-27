import { Paper } from '@mui/material'
import { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../state'

const GeneralWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 2vh;
`

const HomeGeneral = () => {
    const { state } = useContext(AppContext)
    return(
        <GeneralWrapper>
            <Paper>
                
            </Paper>
        </GeneralWrapper>
    )
}