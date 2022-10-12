import './DisplayProfiles.css'
import Card from "./Card"

interface props {
    array: object[],
    counter: number,
    setCounter: React.Dispatch<React.SetStateAction<number>>,
    setIdProfileSelected: React.Dispatch<React.SetStateAction<number[] | null>>,
    idProfileSelected: number[] | null,
    setAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    editMode: boolean
}

const DisplayProfiles  = ({array, counter, setCounter, setIdProfileSelected, idProfileSelected, setAllChecked, editMode }: props)=> {
    let i:number = 0
    return(
        <div id="DisplayProfiles">
            {array.map((profile: any)=>
                <Card   
                    key={i}
                    profiles={array}
                    idElement={i++}
                    profile={profile} 
                    counter={counter} 
                    setCounter={setCounter} 
                    setIdProfileSelected={setIdProfileSelected}
                    idProfileSelected={idProfileSelected}
                    setAllChecked={setAllChecked}
                    editMode={editMode}
                />
            )}
        </div>
    )
}

export default DisplayProfiles