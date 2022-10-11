import './DisplayProfiles.css'
import Card from "./Card"

interface props {
    array: object[],
    counter: number,
    setCounter: React.Dispatch<React.SetStateAction<number>>
}

const DisplayProfiles  = ({array, counter, setCounter }: props)=> {
    return(
        <div id="DisplayProfiles">
            {array.map((profile: any)=>
                    <Card key={profile.id} profile={profile} counter={counter} setCounter={setCounter}  />
            )}
        </div>
    )
}

export default DisplayProfiles