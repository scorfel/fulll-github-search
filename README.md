# Bienvenue son mon projet 'Github search'

Ce projet a été créé avec [Create React App](https://github.com/facebook/create-react-app) et TypeScript

## Style additionel
Les valeurs en pixel présentes sur la maquette ont été appliquées sur le header et sur les profils à afficher. Cependant, le rendu des vignettes de profil est assez différent de celui présenté sur le design fourni.
C’est pourquoi vous trouverez dans le header, un bouton ‘switch’ permettant de basculer sur un style alternatif, se rapprochant du visuel fourni dans le repo Github (mesures réalisées sur le design lui-même).

## Organisation du projet
Le dossier `./src/component/` contient l'ensemble des fichiers composant, ainsi que les fichiers css.
Aucune dépendance n'a été instalée, hormis [Cypress](https://www.cypress.io/) pour les tests.

## Fonctionnement du projet
### Requète sur l'api de Github
Le composant `SearchAndResults.tsx` contient un input controlé, relié à un hook de state, qui lance un call api à partir de trois caractères :
```javascript
<input
    placeholder="Enter your search - min. 3 characters"
    id='search__container__input'
    type="text"
    value={userSearch}
    onChange={handleSubmit}                          
/>
```
Pour limiter l'envoi de requetes en trop grand nombre, nomtament lors de la frappe rapide de charactères sur le clavier, le call api s'effectue avec un timer d'une seconde, réinitialié à chaque event clavier.
```javascript
./src/functions/callApi.tsx

async function callApi({ setRateLimitReach, setIsoLoading, setProfiles, setNoResult, userSearch }: propsCallApi) {
    try {
        const response = await fetch(`https://api.github.com/search/users?q=${userSearch}`);
        if (response.status === 403) {
            setRateLimitReach(true)
            setIsoLoading(false)
            return
        }
        const allProfiles: responseCallApi = await response.json()
        const profilesInArray: object[] = allProfiles.items
        if (allProfiles.total_count === 0) {
            setProfiles(null);
            setNoResult(true)
            setIsoLoading(false)
            return
        }
        if (allProfiles.total_count > 0) {
            setProfiles(profilesInArray);
            setIsoLoading(false)
            return
        }
    }
    catch (e) {
        console.log(e)
        setIsoLoading(false)
        return
    }
}
```
```javascript
./src/component/SearchAndResult.tsx

function getAllProfiles() {
  timer = setTimeout(() => { callApi({ setRateLimitReach, setIsoLoading, setProfiles, setNoResult, userSearch }) }, 1000) as unknown as number
}
```
```javascript
./src/component/SearchAndResult.tsx
//useEffect
return () => clearTimeout(timer);
```
Le retour du call api prend trois cas de réponses :
* statuts 403, lorsque le nombre limite de requète par minute à été atteint ( 10 )
* Lorsque la recher n'a pas retourné de résultats.
* Lorsque des résultats ont été trouvés
```javascript

if (response.status === 403) {
   setRateLimitReach(true)
   setIsoLoading(false)
   return
}
        
if (allProfiles.total_count === 0) {
   setProfiles(null);
   setNoResult(true)
   setIsoLoading(false)
   return
}     
if (allProfiles.total_count > 0) {
   setProfiles(profilesInArray);
   setIsoLoading(false)
   return
}                   
```
### Affichage des résultats
Les résultats obtenus sont transmis au composant `DisplayProfiles`, qui effectue une methode `map` sur le tableau des résultats:
```javascript
./src/component/DisplayProfiles.tsx

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
```
Chaque passage de la methode `map` affiche le composant `Card`, qui récupère l'ensembles des informations du profile à afficher, ainsi que du state et des setters afin d'intégarir sur certains élément du profil ( lien, checkbox )




## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
#� �f�u�l�l�l�-�g�i�t�h�u�b�-�s�e�a�r�c�h�
�
�
