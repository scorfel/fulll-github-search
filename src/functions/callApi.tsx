
interface responseCallApi {
    items: object[],
    total_count: number,
}
interface propsCallApi {
    setRateLimitReach: React.Dispatch<React.SetStateAction<boolean>>,
    setIsoLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setProfiles: React.Dispatch<React.SetStateAction<object[] | null>>,
    setNoResult: React.Dispatch<React.SetStateAction<boolean>>,
    userSearch: string
}
export async function callApi({ setRateLimitReach, setIsoLoading, setProfiles, setNoResult, userSearch }: propsCallApi) {
    try {
        const response = await fetch(`https://api.github.com/search/users?q=${userSearch}`);
        if (response.status === 403) {
            setRateLimitReach(true)
            setIsoLoading(false)
            return { "error": "limit call reach" }
        }
        const allProfiles: responseCallApi = await response.json()
        const profilesInArray: object[] = allProfiles.items
        if (allProfiles.total_count === 0) {
            setProfiles(null);
            setNoResult(true)
            setIsoLoading(false)
            return { "result": "no profiles found" }
        }
        if (allProfiles.total_count > 0) {
            setProfiles(profilesInArray);
            setIsoLoading(false)
            return { "result": "succes" }
        }
    }
    catch (e) {
        console.log(e)
        setIsoLoading(false)
        return { "error": `error + ${e}` }
    }
}