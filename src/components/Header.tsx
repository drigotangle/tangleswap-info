import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
    return(
        <HeadWrapper>
            <StyledImg width={30} src='https://d3m3d54t409w7t.cloudfront.net/logos/Logo_White_Alpha.gif' />                
            <LinksWrapper>
                {
                    ['Overview', 'Pools', 'Tokens'].map((data: string) => {
                        return (
                            <>
                                <Link to={`/${data}`}>{data}</Link>
                            </>
                        )
                    })
                }
            </LinksWrapper>
        </HeadWrapper>
    )
}

export default Header