import "./Card.css"
import { useState } from "react"

interface profilcomplet{
    avatar_url: string,
    id: string
    login: string
    html_url: string
}

interface props {
    profile: profilcomplet,
    counter: number,
    setCounter: React.Dispatch<React.SetStateAction<number>>
}

const Card = ({profile, counter, setCounter }: props) =>{

const [isChecked, setIsChecked]= useState<boolean>(false)

function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    if(isChecked){
        setIsChecked(false)
        setCounter(counter - 1)
        console.log(e)
    }else{
        setIsChecked(true)
        setCounter(counter + 1)
        console.log(e.target.value)
    }
    console.log('yes')
}
    return(
        <div  className="card">
            <label className="card__container">
                <input value={profile.id} type="checkbox" onChange={handleChange} checked={isChecked}/>
                <span className="checkmark"></span>
            </label>
            <div className="card__avatar">
                <img alt="user avatar" src={profile.avatar_url}></img>
            </div>
            <div className="card__profil">
                <p>{profile.id}</p>
                <p>{profile.login}</p>
            </div>
            <div className="card__link">
                <a rel="noreferrer" target='_blank' href={profile.html_url}>View profile</a>
            </div>
        </div>
    )
}

export default Card