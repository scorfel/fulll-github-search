import { indexDescAndCloneProfiles } from '../functions/indexDescAndCloneProfiles.tsx';

let idProfileSelected = [10, 5, 23, 4, 12]
let profiles = [{ "1": 1 }, { "2": 2 }]
let idResult = [23, 12, 10, 5, 4]
let cloneProfiles = [{ "1": 1 }, { "2": 2 }]

describe('indexDescAndCloneProfiles module', () => {
    test('retour de la fonction', () => {
        expect(indexDescAndCloneProfiles({ idProfileSelected, profiles })).toEqual({ "cloneAllProfiles": cloneProfiles, "idSortDesc": idResult });
    });
});


