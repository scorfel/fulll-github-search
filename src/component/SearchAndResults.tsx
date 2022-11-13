import './SearchAndResults.css'
import bin from '../asset/bin-svgrepo-com.svg'
import copy from '../asset/copy-svgrepo-com.svg'
import { useState, useEffect } from "react"
import DisplayProfiles from "./DisplayProfiles"
import Spinner from './Spinner'
import { callApi } from '../functions/callApi'
import { indexDescAndCloneProfiles } from '../functions/indexDescAndCloneProfiles'


interface Props {
    alternativeStyle: boolean,
}

interface ObjectProfileAndId {
    cloneAllProfiles: object[],
    idSortDesc: number[]
}

const SearchAndResult = ({ alternativeStyle }: Props): JSX.Element => {


    const [userSearch, setUserSearch] = useState<string>('')
    const [profiles, setProfiles] = useState<object[] | null>(null)
    const [noResult, setNoResult] = useState(false)
    const [isLoading, setIsoLoading] = useState(false)
    const [rateLimitReach, setRateLimitReach] = useState(false)
    const [counterSelected, setCounterSelected] = useState<number>(0)
    const [idProfileSelected, setIdProfileSelected] = useState<number[] | null>(null)
    const [allChecked, setAllChecked] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)

    let timer: number

    function handleSubmit(e: React.ChangeEvent<HTMLInputElement>) {
        setUserSearch(e.target.value)
    }

    function copyProfilesSelected(): void {
        if (profiles != null && idProfileSelected != null) {
            let idDescAndProfiles: ObjectProfileAndId | undefined = indexDescAndCloneProfiles({ idProfileSelected, profiles })
            if (idDescAndProfiles !== undefined) {
                for (const element of idDescAndProfiles.idSortDesc) {
                    let profileToDuplicate = profiles[element]
                    idDescAndProfiles.cloneAllProfiles.splice(element, 0, profileToDuplicate)
                }
                setProfiles(idDescAndProfiles.cloneAllProfiles)
                setCounterSelected(0)
                setIdProfileSelected(null)
            }
        }
    }

    function deleteProfilesSelected(): void {
        if (profiles != null && idProfileSelected != null) {
            if (allChecked) {
                setProfiles(null)
                setAllChecked(false)
                setCounterSelected(0)
                setUserSearch('')
                return
            }
            let idDescAndProfiles: ObjectProfileAndId | undefined = indexDescAndCloneProfiles({ idProfileSelected, profiles })
            if (idDescAndProfiles !== undefined) {
                for (const element of idDescAndProfiles.idSortDesc) {
                    idDescAndProfiles.cloneAllProfiles.splice(element, 1)
                }
                setIdProfileSelected(null)
                setProfiles(idDescAndProfiles.cloneAllProfiles)
            }
        }
    }

    function selectAllProfiles(): void {
        if (profiles) {
            var inputsSelectProfile = document.getElementsByClassName('card__container__input') as HTMLCollectionOf<HTMLInputElement>
            if (!allChecked) {
                setAllChecked(true)
                for (let i = 0; i < inputsSelectProfile.length; i++) {
                    if (inputsSelectProfile[i].checked === false) {
                        inputsSelectProfile[i].click();
                    }
                }
                setCounterSelected(inputsSelectProfile.length)
            }
            else {
                for (let i = 0; i < inputsSelectProfile.length; i++) {
                    if (inputsSelectProfile[i].checked === true) {
                        inputsSelectProfile[i].click();
                    }
                }
                setAllChecked(false)
                setCounterSelected(0)
            }
        }
    }

    function changeEditMode(): void {
        editMode ?
            setEditMode(false)
            :
            setEditMode(true)
    }

    function getAllProfiles() {
        timer = setTimeout(() => { callApi({ setRateLimitReach, setIsoLoading, setProfiles, setNoResult, userSearch }) }, 1000) as unknown as number
    }

    useEffect(() => {
        if (counterSelected === 0) {
            setAllChecked(false)
        }
    }, [counterSelected])

    useEffect(() => {
        if (userSearch.length > 2) {
            setIsoLoading(true)
            setNoResult(false)
            setRateLimitReach(false)
            getAllProfiles()
        } else {
            setProfiles(null);
            setNoResult(false)
            setIsoLoading(false)
        }
        return () => clearTimeout(timer);
    }, [userSearch])

    return (
        <div id='search'>
            <div id='search__container'>
                <div id='search__container__switch__input__spinner'>
                    <div id='search__container__switch'>
                        <label className="switch">
                            <input type="checkbox" onChange={changeEditMode} />
                            <span className="slider round"></span>
                        </label>
                        <p>Edit mode</p>
                    </div>
                    <div id='search__container__input__spinner'>
                        <input
                            placeholder="Enter your search - min. 3 characters"
                            id='search__container__input'
                            type="text"
                            value={userSearch}
                            onChange={handleSubmit}
                        />
                        <div id='search__spinner' >
                            {isLoading &&
                                <Spinner />
                            }
                        </div>
                    </div>
                </div>
                <div id={editMode ? 'search__container__option' : 'search__container__option--disabled'}>
                    <div id='search__container__checkbox'>
                        <input type="checkbox" checked={allChecked} onChange={() => selectAllProfiles()} />
                        <div>{counterSelected}  elements selected</div>
                    </div>
                    <div id='search__container__bin__copy'>
                        <img id='img__bin' alt='bin' src={bin} onClick={() => deleteProfilesSelected()} />
                        <img id='img__copy' alt='copy' src={copy} onClick={() => copyProfilesSelected()} />
                    </div>
                </div>
            </div>
            <div id='search__display'>
                {profiles &&
                    <DisplayProfiles
                        counterSelected={counterSelected}
                        setCounterSelected={setCounterSelected}
                        setIdProfileSelected={setIdProfileSelected}
                        setAllChecked={setAllChecked}
                        profiles={profiles}
                        idProfileSelected={idProfileSelected}
                        editMode={editMode}
                        alternativeStyle={alternativeStyle}
                    />
                }
                {noResult &&
                    <p>No result</p>
                }
                {rateLimitReach &&
                    <p>rate limit reached please try again later</p>
                }
            </div>
        </div>
    )
}

export default SearchAndResult