import "./Card.css"
import { useEffect, useState } from "react"

interface profilcomplet{
    avatar_url: string,
    id: string
    login: string
    html_url: string
}

interface props {
    profile: profilcomplet,
    counter: number,
    setCounter: React.Dispatch<React.SetStateAction<number>>,
    setIdProfileSelected: React.Dispatch<React.SetStateAction<number[] | null>>,
    idProfileSelected: number[] | null,
    idElement: number,
    profiles: object[],
    setAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    editMode: boolean
    alternatriveStyle: boolean
}


let arrayId: number[]
const Card = ({profile, counter, setCounter, setIdProfileSelected,  idProfileSelected, idElement,profiles, setAllChecked,editMode, alternatriveStyle }: props) =>{
    
    let index:number
    const [isChecked, setIsChecked]= useState<boolean>(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        if(!isChecked){
            setIsChecked(true)
            setCounter(counter = counter + 1)
            index = parseInt(e.target.value)
            arrayId.push(index);
            setIdProfileSelected(arrayId)
        }else{
            setAllChecked(false)
            setIsChecked(false)
            index = parseInt(e.target.value)
            let idToDeletee:number = arrayId.indexOf(index)
            arrayId.splice(idToDeletee, 1);
            setCounter(counter = counter - 1)
            setIdProfileSelected(arrayId)
        }
    }

    useEffect(()=>{
        arrayId = []
        setIsChecked(false)
        setCounter(0)
    },[profiles])

    return(
        <div  className={alternatriveStyle ?  "card--alt" : "card" }>
            <label className={editMode ? "card__container" : "card__container--disabled"}>
                <input className="card__container__input" value={idElement} type="checkbox" onChange={handleChange} checked={isChecked}/>
                <span className="checkmark"></span>
            </label>
            <div className={alternatriveStyle ?  "card__avatar--alt" : "card__avatar" }>
                <img alt="user avatar" src={profile.avatar_url}></img>
            </div>
            <div className={alternatriveStyle ?  "card__profil--alt" : "card__profil" }>
                <p>{profile.id}</p>
                <p>{profile.login}</p>
            </div>
            <div className={alternatriveStyle ?  "card__link--alt" : "card__link" }>
                <a rel="noreferrer" target='_blank' href={profile.html_url}>View profile</a>
            </div>
        </div>
    )
}

export default Card