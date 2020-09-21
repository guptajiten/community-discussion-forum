import en from './i18n-en'
const i18nObj = {},
	languages = {
	    en: en
	}
function setLocale(loc){
	const i18nStrings = languages[loc]

	if(i18nStrings){
		for (var n in i18nStrings){
			if(i18nStrings.hasOwnProperty(n)){
				i18nObj[n] = i18nStrings[n]
			}
		}
	}
}
setLocale('en')
i18nObj.setLocale = setLocale

module.exports = i18nObj
