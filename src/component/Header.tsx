import React from "react"
import "./Header.css"

const titre: string = "Github Search"

interface props {
    setAlternatriveStyle: React.Dispatch<React.SetStateAction<boolean>>,
    alternatriveStyle: boolean
}

const Header = ({ alternatriveStyle, setAlternatriveStyle }: props): JSX.Element => {

    function toogleStyle(): void {
        alternatriveStyle ?
            setAlternatriveStyle(false)
            :
            setAlternatriveStyle(true)
    }

    return (
        <div id="header">
            <div id="header__container__switch">
                <label className="switch">
                    <input type="checkbox" onChange={() => { toogleStyle() }} />
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