const NO_CAPITAL = 'no_capital';
const NO_LOWERCASE = 'no_lowercase';
const NO_NUMBER = 'no_number';
const CONTAINS_NAME = 'contains_name';

const EXPLANATIONS = {
    [NO_CAPITAL]: 'Atleast 1 capital letter',
    [NO_LOWERCASE]: 'Atleast 1 lowercase letter',
    [NO_NUMBER]: 'Atleast 1 number',
    [CONTAINS_NAME]: "Shouldn't contain user name",
};

function validatePassword(password, displayName=""){
    const errors = [];
    if(password.search(/[A-Z]/) == -1){
        errors.push(NO_CAPITAL);
    }

    if(password.search(/[a-z]/) == -1){
        errors.push(NO_LOWERCASE);
    }

    if(password.search(/[1-9]/) == -1){
        errors.push(NO_NUMBER);
    }

    if(displayName){
        for(const namePart of displayName.split(" ").filter(x => x.length >= 3)){
            if(password.toLowerCase().includes(namePart.toLowerCase())){
                errors.push(CONTAINS_NAME);
            }
        }
    }

    return errors;
};

module.exports = {
    NO_CAPITAL,
    NO_LOWERCASE,
    NO_NUMBER,
    CONTAINS_NAME,
    EXPLANATIONS,
    validatePassword
}