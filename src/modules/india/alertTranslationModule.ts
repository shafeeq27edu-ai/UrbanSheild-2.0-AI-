export type AlertLanguage = 'en' | 'hi' | 'bn' | 'ta' | 'or';

export interface AlertMessage {
    langCode: AlertLanguage;
    languageName: string;
    message: string;
}

const ALERT_DICTIONARY: Record<AlertLanguage, { name: string, templates: { flood: string, heat: string, compound: string } }> = {
    'en': {
        name: 'English',
        templates: {
            flood: "CRITICAL FLOOD WARNING: Evacuate immediately to higher ground. Follow marked escape routes.",
            heat: "EXTREME HEAT ALERT: Stay indoors, hydrate constantly. Suspend all outdoor labor.",
            compound: "COMPOUND DISASTER EMERGENCY: Severe flooding and heatwave. Proceed to designated relief centers immediately."
        }
    },
    'hi': {
        name: 'Hindi (हिन्दी)',
        templates: {
            flood: "गंभीर बाढ़ की चेतावनी: तुरंत ऊंचे स्थानों पर जाएं। चिह्नित भागने के रास्तों का पालन करें।",
            heat: "अत्यधिक गर्मी की चेतावनी: घर के अंदर रहें, लगातार पानी पीते रहें। सभी बाहरी काम रोक दें।",
            compound: "मिश्रित आपदा आपातकाल: गंभीर बाढ़ और लू। तुरंत निर्दिष्ट राहत केंद्रों पर जाएं।"
        }
    },
    'bn': {
        name: 'Bengali (বাংলা)',
        templates: {
            flood: "গুরুতর বন্যা সতর্কতা: অবিলম্বে উঁচু স্থানে সরে যান। চিহ্নিত পালানোর পথ অনুসরণ করুন।",
            heat: "প্রচণ্ড গরমের সর্তকতা: ঘরে থাকুন, ক্রমাগত জল পান করুন। সমস্ত বাইরের কাজ স্থগিত করুন।",
            compound: "যৌগিক বিপর্যয় জরুরি অবস্থা: তীব্র বন্যা এবং তাপপ্রবাহ। অবিলম্বে নির্ধারিত ত্রাণ কেন্দ্রে যান।"
        }
    },
    'ta': {
        name: 'Tamil (தமிழ்)',
        templates: {
            flood: "கடும் வெள்ள எச்சரிக்கை: உடனடியாக மேடான பகுதிகளுக்கு செல்லவும். குறியிடப்பட்ட தப்பிக்கும் பாதைகளை பின்பற்றவும்.",
            heat: "கடும் வெப்ப எச்சரிக்கை: வீட்டிற்குள்ளேயே இருங்கள், தொடர்ந்து தண்ணீர் குடிக்கவும். அனைத்து வெளி வேலைகளையும் நிறுத்தவும்.",
            compound: "கூட்டுப் பேரிடர் அவசரநிலை: கடும் வெள்ளம் மற்றும் வெப்ப அலை. உடனடியாக ஒதுக்கப்பட்ட நிவாரண மையங்களுக்குச் செல்லவும்."
        }
    },
    'or': {
        name: 'Odia (ଓଡ଼ିଆ)',
        templates: {
            flood: "ଗୁରୁତର ବନ୍ୟା ସତର୍କତା: ତୁରନ୍ତ ଉଚ୍ଚ ସ୍ଥାନକୁ ସ୍ଥାନାନ୍ତର ହୁଅନ୍ତୁ। ଚିହ୍ନିତ ଖସିଯିବା ରାସ୍ତା ଅନୁସରଣ କରନ୍ତୁ।",
            heat: "ଅତ୍ୟଧିକ ଗରମ ସତର୍କତା: ଘରେ ରୁହନ୍ତୁ, କ୍ରମାଗତ ଭାବରେ ପାଣି ପିଅନ୍ତୁ। ସମସ୍ତ ବାହାର କାମ ବନ୍ଦ କରନ୍ତୁ।",
            compound: "ଯୌଗିକ ବିପର୍ଯ୍ୟୟ ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତି: ଗୁରୁତର ବନ୍ୟା ଏବଂ ଗ୍ରୀଷ୍ମ ପ୍ରବାହ। ତୁରନ୍ତ ନିର୍ଦ୍ଧାରିତ ରିଲିଫ୍ କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ।"
        }
    }
};

export function generateLocalizedAlerts(riskType: 'flood' | 'heat' | 'compound'): AlertMessage[] {
    const languages: AlertLanguage[] = ['hi', 'bn', 'or', 'ta']; // Focus on Indian regional languages

    return languages.map(lang => ({
        langCode: lang,
        languageName: ALERT_DICTIONARY[lang].name,
        message: ALERT_DICTIONARY[lang].templates[riskType] || ALERT_DICTIONARY['en'].templates[riskType]
    }));
}
