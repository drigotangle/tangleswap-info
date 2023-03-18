import { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { AppContext } from '../state'
import ChainMenu from './ChainMenu'

const HeadWrapper = styled.div`
display: flex;
flex-direction: row;
width: 100%;
gap: 2vw;
height: max-content;
`

const LinksWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 98%;
    height: min-content;
    margin: auto auto;
    gap: 4vw;
`

const StyledImg = styled.img`
    margin: auto auto;
`

const Header = () => {
    const { state } = useContext(AppContext)
    const { chain } = state
    return(
        <HeadWrapper>
            <StyledImg width={30} src='https://d3m3d54t409w7t.cloudfront.net/logos/Logo_White_Alpha.gif' />                
            <LinksWrapper>
                {
                    ['Overview', 'Pools', 'Tokens'].map((data: string, index: number) => {
                        if(index === 0){
                            return (
                                <>
                                    <Link to={`/`}>{data}</Link>
                                </>
                            )
                        }
                        
                        return (
                            <>
                                <Link to={`/${chain}/${data}`}>{data}</Link>
                            </>
                        )
                    })
                }
            </LinksWrapper>
            <ChainMenu />
        </HeadWrapper>
    )
}

export default Header