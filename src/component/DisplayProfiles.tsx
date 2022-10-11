import './DisplayProfiles.css'
import Card from "./Card"

interface objetProfile {
    array: object[]
}

const DisplayProfiles  = ({array}: objetProfile)=> {
    return(
        <div id="DisplayProfiles">
            {array.map((profile: any)=>
                    <Card key={profile.id} profile={profile} />
            )}
        </div>
    )
}

export default DisplayProfiles