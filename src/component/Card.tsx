import "./Card.css"
import { useEffect, useState } from "react"

interface ProfileComplete {
    avatar_url: string,
    id: string
    login: string
    html_url: string
}

interface Props {
    profile: ProfileComplete,
    counterSelected: number,
    setCounterSelected: React.Dispatch<React.SetStateAction<number>>,
    setIdProfileSelected: React.Dispatch<React.SetStateAction<number[] | null>>,
    idProfileSelected: number[] | null,
    idElement: number,
    profiles: object[],
    setAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    editMode: boolean
    alternativeStyle: boolean
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
    alternativeStyle }: Props): JSX.Element => {

    let indexSelected: number
    const [isChecked, setIsChecked] = useState<boolean>(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!isChecked) {
            setIsChecked(true)
            setCounterSelected(counterSelected + 1)
            indexSelected = parseInt(e.target.value)
            arrayIdSelected.push(indexSelected);
            setIdProfileSelected(arrayIdSelected)
        } else {
            setAllChecked(false)
            setIsChecked(false)
            indexSelected = parseInt(e.target.value)
            let idToDelete: number = arrayIdSelected.indexOf(indexSelected)
            arrayIdSelected.splice(idToDelete, 1);
            setCounterSelected(counterSelected - 1)
            setIdProfileSelected(arrayIdSelected)
        }
    }

    useEffect(() => {
        arrayIdSelected = []
        setIsChecked(false)
        setCounterSelected(0)
    }, [profiles])

    return (
        <div className={alternativeStyle ? "card--alt" : "card"}>
            <label className={editMode ? alternativeStyle ? "card__container--alt" : "card__container" : "card__container--disabled"} >
                <input className="card__container__input" value={idElement} type="checkbox" onChange={handleChange} checked={isChecked} />
                <span className="checkmark"></span>
            </label>
            <div className={alternativeStyle ? "card__avatar--alt" : "card__avatar"}>
                <img alt="user avatar" src={profile.avatar_url}></img>
            </div>
            <div className={alternativeStyle ? "card__profile--alt" : "card__profile"}>
                <p>{profile.id}</p>
                <p>{profile.login}</p>
            </div>
            <div className={alternativeStyle ? "card__link--alt" : "card__link"}>
                <a rel="noreferrer" target='_blank' href={profile.html_url}>View profile</a>
            </div>
        </div>
    )
}

export default Card