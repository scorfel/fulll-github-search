import "./Header.css"

const titre: string = "Github Search"

const Header = () =>{

    return(
        <div id="header">
            <h1 id="header__h1">
                {titre}
            </h1>
        </div>
    )
}

export default Header