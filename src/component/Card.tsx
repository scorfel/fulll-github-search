import "./Card.css"

interface profilcomplet{
    avatar_url: string,
    id: string
    login: string
    html_url: string
}

interface profileInObject {
    profile: profilcomplet
}

const Card = ({profile}: profileInObject) =>{
    return(
        <div className="card">
            <div className="card__avatar">
                <img alt="user avatar" src={profile.avatar_url}></img>
            </div>
            <div className="card__profil">
                <p>{profile.id}</p>
                <p>{profile.login}</p>
            </div>
            <div className="card__link">
                <a rel="noreferrer" target='_blank' href={profile.html_url}>View profile</a>
            </div>
        </div>
    )
}

export default Card