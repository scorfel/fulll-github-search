# Bienvenue son mon projet 'Github search'

Ce projet a été créé avec [Create React App](https://github.com/facebook/create-react-app) et TypeScript  
* [Fonctionnement du projet](#fonctionnement-du-projet)  
* [Style additionnel](#style-additionnel)  
* [Organisation du projet](#organisation-du-projet)  
* [Requête sur l’API Github](#requète-sur-lapi-de-github)  
* [Affichage des résultats](#affichage-des-résultats)  
* [Mode édition](#mode-édition) 
* [Sélection des profils](#sélection-des-profils) 
* [Sélection de tous les profils](#sélection-de-tous-les-profils) 
* [Copie / suppression](#copie-ou-suppression-des-éléments-sélectionnés) 
* [Tests avec Cypress](#test-avec-cypress) 
* [Available scripts](#available-scripts)  

## Fonctionnement du projet

### Style additionnel
Les valeurs en pixel présentes sur la maquette ont été appliquées sur le header et sur les profils à afficher. Cependant, le rendu des vignettes de profil est assez différent de celui présenté sur le design fourni.
C’est pourquoi vous trouverez dans le header, un bouton ‘switch’ permettant de basculer sur un style alternatif, se rapprochant du visuel fourni dans le repo Github ( les valeurs en pixel ont été récupérées directement sur le design ).

### Organisation du projet
Le dossier `./src/component/` contient l'ensemble des fichiers composant, ainsi que les fichiers css.
Aucune dépendance n'a été installée, hormis [Cypress](https://www.cypress.io/) pour les tests.


### Requète sur l'api de Github
Le composant `SearchAndResults.tsx` contient un input contrôlé, relié à un hook de state, qui lance un call api à partir de trois caractères :
```javascript
<input
    placeholder="Enter your search - min. 3 characters"
    id='search__container__input'
    type="text"
    value={userSearch}
    onChange={handleSubmit}                          
/>
```
Pour limiter l'envoi de requêtes en trop grand nombre, notamment lors de la frappe rapide de caractères sur le clavier, le call api s'effectue avec un timer d'une seconde, réinitialisé à chaque event clavier.
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
* statuts 403, lorsque le nombre limite de requête par minute à été atteint ( 10 )
* Lorsque la recherche n'a pas retourné de résultats.
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
Des affichages conditionnels sont alors générés selon le type de réponse


```javascript
./src/component/SearchAndResult.tsx
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
                        alternatriveStyle={alternatriveStyle}
                    />
                }
                {noResult &&
                    <p>No result</p>
                }
                {rateLimitReach &&
                    <p>rate limit reached please try again later</p>
                }
            </div>

```

### Affichage des résultats
Les résultats obtenus sont transmis au composant `DisplayProfiles`, qui effectue une méthode `map` sur le tableau des résultats:
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
Chaque passage de la méthode `map` affiche le composant `Card`, qui récupère l'ensembles des informations du profil à afficher, ainsi que du state et des setters permettant d'intégarir sur certains élément du profil ( lien, checkbox )


### Mode édition

L’application bénéficie d’un mode édition, qui s’active via le switch présent en haut à gauche des résultats.  
Ce mode édition permet de sélectionner un ou plusieurs profils, et de copier ou supprimer les éléments sélectionnés ( modification faite uniquement sur le DOM )  

#### Sélection des profils
Sur le click d’un checkbox présente sur un profil, le state `isChecked` est passé à `true`, et le compteur de profils sélectionnés est incrémenté :
```javascript
./src/component/Card.tsx

function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!isChecked) {
            setIsChecked(true)
            setCounterSelected(counterSelected + 1)
//suite de la fonction…

```  
L’opération inverse s’effectue sur une sélection.

#### Sélection de tous les profils
Une checkbox est présente à côté du compteur de profils sélectionnés. Sur l'activation de celle-ci, l’ensemble des profils affiché est sélectionné.
Une condition vérifie sur chaque profil si celui-ci était déjà sélectionné ou non  :

```javascript
./src/component/SearchAndResult.tsx

function selecAllProfiles(): void {
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
 

```  

#### Copie ou suppression des éléments sélectionnés

Le concept global pour le fonctionnement des ces fonctionnalité est le suivant :
Lors d’une sélection (unique ou multiple ) d’un profil, la valeur de sa clef d’index, qui représente sa position dans l’array contenant les profils, est sélectionnée, et ajoutée à un tableau vide.  
Une copie de l’array contenant les profils récupérés via l’API est créée
La modification demandée ( copy / delete ) est effectuée grâce au index récupérés, sur la copie du tableau des profils.  
Le state des profils à afficher est mis à jour avec le tableau cloné modifié.  


Récupération des clés d’index, lors d’une sélection : 
```javascript
./src/component/Card.tsx

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
            let idToDeletee: number = arrayIdSelected.indexOf(indexSelected)
            arrayIdSelected.splice(idToDeletee, 1);
            setCounterSelected(counterSelected - 1)
            setIdProfileSelected(arrayIdSelected)
        }
    }
 
```

Lors de la modification demandée ( copy / delete ), la première étape consiste à traiter les index des profils récupérés. L’ordre de ceux-ci peut être aléatoire, selon comment la sélection a été effectuée.  
Une fonction trie les index dans un ordre décroissant ( la modification copy / delete va ajouter / supprimer des éléments dans le tableau cloné. Si la première itération à lieu sur, par exemple, le premier élément du tableau, toutes les clés des éléments suivants vont être décalées, ce qui entraînera des erreurs dans les modifications, qui elles se basent sur les index récupérés, qui eux ne changent pas. )  
Cet ordre décroissant permet l’itération de tous les éléments, sans changer la clé des éléments qui serviront ensuite à être copiés / supprimés.  


```javascript
./src/function/indexDescAndCloneProfiles.tsx

function indexDescAndCloneProfiles({ idProfileSelected, profiles }: props): Object | undefined {
    let idSortAsc: number[]
    const byValue = (a: number, b: number) => a - b;
    if (idProfileSelected && profiles != null) {
        idSortAsc = [...idProfileSelected].sort(byValue);
        let idSortDesc = idSortAsc.reverse();
        let cloneAllProfiles = profiles.slice(0);
        return { idSortDesc, cloneAllProfiles }
    }
}
 
 
```

La copie ou la suppression peuvent ensuite être effectués :


```javascript
./src/component/SearchAndResult.tsx

    function copyProfilesSelected(): void {
        if (profiles != null && idProfileSelected != null) {
            let idDescAndProfiles: objectProfileAndId | undefined = indexDescAndCloneProfiles({ idProfileSelected, profiles })
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
 
 
 
```

```javascript
./src/component/SearchAndResult.tsx

    function deleteProfilesSelected(): void {
        if (profiles != null && idProfileSelected != null) {
            if (allChecked) {
                setProfiles(null)
                setAllChecked(false)
                setCounterSelected(0)
                setUserSearch('')
                return
            }
            let idDescAndProfiles: objectProfileAndId | undefined = indexDescAndCloneProfiles({ idProfileSelected, profiles })
            if (idDescAndProfiles !== undefined) {
                for (const element of idDescAndProfiles.idSortDesc) {
                    idDescAndProfiles.cloneAllProfiles.splice(element, 1)
                }
                setIdProfileSelected(null)
                setProfiles(idDescAndProfiles.cloneAllProfiles)
            }
        }
    }
 
 
 
 ```



### Test avec Cypress


 [Cypress.io](https://www.cypress.io/) a été utilisé afin d'effectuer des tests end to end.  
 [comment installer Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)  
 [comment lancer Cypress](https://docs.cypress.io/guides/getting-started/opening-the-app)  

La série de tests Cypress  effectue l’ensemble des interactions possibles, afin de vérifier le bon fonctionnement de l’application.
  
  



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

