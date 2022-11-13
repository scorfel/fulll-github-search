import React from "react"
import "./Header.css"

const titre: string = "Github Search"

interface Props {
    setAlternativeStyle: React.Dispatch<React.SetStateAction<boolean>>,
    alternativeStyle: boolean
}

const Header = ({ alternativeStyle, setAlternativeStyle }: Props): JSX.Element => {

    function toggleStyle(): void {
        alternativeStyle ?
            setAlternativeStyle(false)
            :
            setAlternativeStyle(true)
    }

    return (
        <div id="header">
            <div id="header__container__switch">
                <label className="switch">
                    <input type="checkbox" onChange={() => { toggleStyle() }} />
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