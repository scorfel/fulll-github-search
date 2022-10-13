import "./Card.css"
import { useEffect, useState } from "react"

interface profilcomplet {
    avatar_url: string,
    id: string
    login: string
    html_url: string
}

interface props {
    profile: profilcomplet,
    counterSelected: number,
    setCounterSelected: React.Dispatch<React.SetStateAction<number>>,
    setIdProfileSelected: React.Dispatch<React.SetStateAction<number[] | null>>,
    idProfileSelected: number[] | null,
    idElement: number,
    profiles: object[],
    setAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    editMode: boolean
    alternatriveStyle: boolean
}

let arrayIdSelected: number[]
const Card = ({
    profile,
    counterSelected,
    setCounterSelected,
    setIdProfileSelected,
    idElement,
    profiles,
    setAllChecked,
    editMode,
    alternatriveStyle }: props): JSX.Element => {

    let indexSelected: number
    const [isChecked, setIsChecked] = useState<boolean>(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!isChecked) {
            setIsChecked(true)
            setCounterSelected(counterSelected = counterSelected + 1)
            indexSelected = parseInt(e.target.value)
            arrayIdSelected.push(indexSelected);
            setIdProfileSelected(arrayIdSelected)
        } else {
            setAllChecked(false)
            setIsChecked(false)
            indexSelected = parseInt(e.target.value)
            let idToDeletee: number = arrayIdSelected.indexOf(indexSelected)
            arrayIdSelected.splice(idToDeletee, 1);
            setCounterSelected(counterSelected = counterSelected - 1)
            setIdProfileSelected(arrayIdSelected)
        }
    }

    useEffect(() => {
        arrayIdSelected = []
        setIsChecked(false)
        setCounterSelected(0)
    }, [profiles])

    return (
        <div className={alternatriveStyle ? "card--alt" : "card"}>
            <label className={editMode ? alternatriveStyle ? "card__container--alt" : "card__container" : "card__container--disabled"} >
                <input className="card__container__input" value={idElement} type="checkbox" onChange={handleChange} checked={isChecked} />
                <span className="checkmark"></span>
            </label>
            <div className={alternatriveStyle ? "card__avatar--alt" : "card__avatar"}>
                <img alt="user avatar" src={profile.avatar_url}></img>
            </div>
            <div className={alternatriveStyle ? "card__profil--alt" : "card__profil"}>
                <p>{profile.id}</p>
                <p>{profile.login}</p>
            </div>
            <div className={alternatriveStyle ? "card__link--alt" : "card__link"}>
                <a rel="noreferrer" target='_blank' href={profile.html_url}>View profile</a>
            </div>
        </div>
    )
}

export default Card