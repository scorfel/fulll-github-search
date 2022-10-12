import './DisplayProfiles.css'
import Card from "./Card"

interface props {
    profiles: object[],
    counterSelected: number,
    setCounterSelected: React.Dispatch<React.SetStateAction<number>>,
    setIdProfileSelected: React.Dispatch<React.SetStateAction<number[] | null>>,
    idProfileSelected: number[] | null,
    setAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
    editMode: boolean,
    alternatriveStyle: boolean
}

const DisplayProfiles = ({
    profiles,
    counterSelected,
    setCounterSelected,
    setIdProfileSelected,
    idProfileSelected,
    setAllChecked,
    editMode,
    alternatriveStyle }: props): JSX.Element => {

    let i: number = 0
    return (
        <div id="DisplayProfiles">
            {profiles.map((profile: any) =>
                <Card
                    key={i}
                    profiles={profiles}
                    idElement={i++}
                    profile={profile}
                    counterSelected={counterSelected}
                    setCounterSelected={setCounterSelected}
                    setIdProfileSelected={setIdProfileSelected}
                    idProfileSelected={idProfileSelected}
                    setAllChecked={setAllChecked}
                    editMode={editMode}
                    alternatriveStyle={alternatriveStyle}
                />
            )}
        </div>
    )
}

export default DisplayProfiles