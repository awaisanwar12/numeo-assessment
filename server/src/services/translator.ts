import axios from 'axios';
interface TranslationResponse{
    responseData:{
        translatedText: string;
        match: number;
    };
    responseStatus:number;

}
export const translatedText = async (text:string, targetLang:string): Promise<string>=>{

    try{

        const sourceLang = 'en';
        const langPair =`${sourceLang} | ${targetLang}`;
        const url = `https://api.mymemory.translated.net/get`;
        const response = await axios.get<TranslationResponse>(url,{
            params:{
                q:text,
                langpair : langPair
            }
        });
        if(response.data && response.data.responseData){
            return response.data.responseData.translatedText;
        }
        return text;
    } catch (error) {
        console.error("translation error", error)
return text;
    }
}; 