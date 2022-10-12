import "./Header.css"

const titre: string = "Github Search"

const Header = () =>{

    return(
        <div id="header">

            <div id="header__container__switch">
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
                <p>Alternative style</p>
            </div>

            <h1 id="header__h1">
                {titre}
            </h1>
        </div>
    )
}

export default Header