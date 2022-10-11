import './SearchAndResults.css'
import bin from '../asset/bin-svgrepo-com.svg'
import copy from '../asset/copy-svgrepo-com.svg'
import { useState, useEffect } from "react"
import DisplayProfiles from "./DisplayProfiles"
import Spinner from './Spinner'

const Search = () => {

    interface responseCallApi{
        items: object[],
        total_count: number,
    }
    interface Object{
        cloneArrayProfiles:object[],
        idSortReversed:number[]

    }

    const [userSearch, setUserSearch] = useState('')
    const [profiles, setProfiles] = useState<object[] | null>(null)
    const [noResult, setNoResult] = useState(false)
    const [isLoading, setIsoLoading] = useState(false)
    const [rateLimitReach, setRateLimitReach] = useState(false)
    const [counter, setCounter] = useState<number>(0)
    const [idProfileSelected, setIdProfileSelected] = useState<number[] | null>(null)
    const [allChecked, setAllChecked] = useState<boolean>(false)

    let timer: number
    
    function handleSubmit(e: React.ChangeEvent<HTMLInputElement>){
        setUserSearch(e.target.value)
    }

    function inverseOrderIndex(){
        let idSort:number[]
        const byValue = (a:number,b:number) => a - b;
        if(idProfileSelected && profiles != null){
            idSort = [...idProfileSelected].sort(byValue);
            let idSortReversed = idSort.reverse();
            let cloneArrayProfiles = profiles.slice(0);
            return {idSortReversed, cloneArrayProfiles}
        }   
    }

    function copyProfilesSelected(): void{
        if(profiles != null && idProfileSelected != null){
            let allArray: Object | undefined = inverseOrderIndex()
            console.log(typeof allArray)
            if(allArray !== undefined){
                for (const element of allArray.idSortReversed) {
                    let profileToDuplicate = profiles[element]
                    allArray.cloneArrayProfiles.splice(element, 0 , profileToDuplicate )
                }
                setProfiles(allArray.cloneArrayProfiles)  
                setCounter(0)
                setIdProfileSelected(null)
            }
        }
    }

    function deleteProfilesSelected(){
        if(profiles != null && idProfileSelected != null){
            if(allChecked){
                setProfiles(null)
                setAllChecked(false)
                setCounter(0)
                setUserSearch('')
                return
            }
            let allArray: Object | undefined = inverseOrderIndex()
            if(allArray !== undefined){
                for (const element of allArray.idSortReversed) {
                    allArray.cloneArrayProfiles.splice(element, 1 )
                }
                setIdProfileSelected(null)
                setProfiles(allArray.cloneArrayProfiles)  
            }
        }
    }

    function selecAllProfiles(){
        if(profiles){
            var elements = document.getElementsByClassName('card__container__input') as HTMLCollectionOf<HTMLInputElement>
            if(!allChecked){
                setAllChecked(true)
                for (let i = 0; i < elements.length; i++) {
                    console.log(elements[i].checked === true)
                    if(elements[i].checked === false){
                        elements[i].click();
                    }
                }
                setCounter(elements.length)
            }
            else{
                for (let i = 0; i < elements.length; i++) {
                    console.log(elements[i].checked === true)
                    if(elements[i].checked === true){
                        elements[i].click();
                    }
                }
                setAllChecked(false)
                setCounter(0)
            }
        }
    }

    async function callApi() {
        try{
            const response = await fetch(`https://api.github.com/search/users?q=${userSearch}`);
            if(response.status === 403){
                setRateLimitReach(true)
                setIsoLoading(false)
                return
            }
            const allProfiles: responseCallApi = await response.json()
            const profilesInArray: object[] = allProfiles.items

            if(allProfiles.total_count === 0){
                setProfiles(null);
                setNoResult(true)
            }
            if(allProfiles.total_count > 0){
                setProfiles(profilesInArray);
            }
            setIsoLoading(false)
        }
        catch(e){
            console.log(e)
            setIsoLoading(false)
        }
    }
    
    useEffect(()=>{
        if(counter === 0){
            setAllChecked(false)
        }
    },[counter])

    useEffect(()=>{
        if(userSearch.length > 2){
            setIsoLoading(true)
            setNoResult(false)
            setRateLimitReach(false)
            timer = setTimeout(()=>{callApi()},1000) as unknown as number
        }else{
            setProfiles(null);
            setNoResult(false)
        }
        return () => clearTimeout(timer);
    },[userSearch])  

    return(
        <div id='search'>

            <div id='search__container'>
                <input type="checkbox" checked={allChecked} onChange={()=>selecAllProfiles()} />
                <div>{counter}  elements selected</div>
                <input 
                    placeholder="Enter your search - min. 3 characters" 
                    id='search__container__input' 
                    type="text" 
                    value={userSearch} 
                    onChange={handleSubmit} />
                {isLoading &&
                    <Spinner/>
                }
                <div>
                    <img id='img__bin' alt='bin' src={bin} onClick={()=>deleteProfilesSelected()}/>
                </div>

                <div>
                    <img id='img__copy' alt='copy' src={copy} onClick={()=>copyProfilesSelected()}/>
                </div>
            </div>

            <div id='search__display'>
                {profiles &&
                    <DisplayProfiles    
                        counter={counter}
                        setCounter={setCounter} 
                        setIdProfileSelected={setIdProfileSelected}  
                        setAllChecked={setAllChecked}
                        array={profiles}
                        idProfileSelected={idProfileSelected}
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

export default Search