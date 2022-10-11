import './SearchAndResults.css'
import { useState, useEffect } from "react"
import DisplayProfiles from "./DisplayProfiles"
import Spinner from './Spinner'

const Search = () => {

    interface responseCallApi{
        items: object[],
        total_count: number,
    }

    const [userSearch, setUserSearch] = useState('')
    const [profiles, setProfiles] = useState<object[] | null>(null)
    const [noResult, setNoResult] = useState(false)
    const [isLoading, setIsoLoading] = useState(false)
    const [rateLimitReach, setRateLimitReach] = useState(false)
    const [counter, setCounter] = useState<number>(0)

    let timer: number
    
    function handleSubmit(e: React.ChangeEvent<HTMLInputElement>){
        setUserSearch(e.target.value)
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
                <div>{counter}</div>
                <input placeholder="Enter your search - min. 3 characters" id='search__container__input' type="text" value={userSearch} onChange={handleSubmit} />
                {isLoading &&
                    <Spinner/>
                }
            </div>
            <div id='search__display'>
                {profiles &&
                    <DisplayProfiles counter={counter} setCounter={setCounter}   array={profiles} />
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