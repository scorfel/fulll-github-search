

interface props {
    idProfileSelected: number[],
    profiles: object[]
}
interface Object {
    cloneAllProfiles: object[],
    idSortDesc: number[]
}

export function indexDescAndCloneProfiles({ idProfileSelected, profiles }: props): Object | undefined {
    let idSortAsc: number[]
    const byValue = (a: number, b: number) => a - b;
    if (idProfileSelected && profiles != null) {
        idSortAsc = [...idProfileSelected].sort(byValue);
        let idSortDesc = idSortAsc.reverse();
        let cloneAllProfiles = profiles.slice(0);
        return { idSortDesc, cloneAllProfiles }
    }

}

