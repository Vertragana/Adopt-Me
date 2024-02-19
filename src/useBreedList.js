import {useState, useEffect} from "react";

const localCache = {};

export default function useBreedList(animal){
    const [breedList, setBreedList] = useState([]);
    const [status, setStatus] = useState("unloaded");

    useEffect(() => {
        if (!animal){
            setBreedList([]);                   //если не выбрано животное то пустой массив
        } else if (localCache[animal]){
            setBreedList(localCache[animal])    // если породы животных были в локалкэш то берем их из него
        } else {
            requestBreedList();                 // если первый раз выбираем тип животного то загружаем список пород
        }

        async function requestBreedList() {
            setBreedList([]);
            setStatus("loading");

            const res = await fetch( `http://pets-v2.dev-apis.com/breeds?animal=${animal}`)
            const json = await res.json();
            localCache[animal]= json.breeds || [];
            setBreedList(localCache[animal]);
            setStatus("loaded");
        }
    }, [animal]);   // каждый раз когда меняется животное мы запрашиваем новый breedList 

    return [breedList, status];
}