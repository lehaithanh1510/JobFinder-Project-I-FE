import validator from 'validator'

export const verifySignUp = ({email, password, confirmPassword}) => {

    if(validator.isEmail(email) && validator.isStrongPassword(password, {
        minLength:6,
        minNumbers:1,
        minLowercase:0,
        minUppercase:0,
        minSymbols:0,
        returnScore:false
    }) && password === confirmPassword) return true 

    return false 
}

export const verifyUploadCV = (fileName) => {

    const fileExtension = fileName.split('.').pop()

    const acceptedExtensions = ['pdf','doc','docx']

    if(acceptedExtensions.indexOf(fileExtension) !== -1) return true

    return false

}

export const validateImageFile = (fileType) => {

    const fileStart = fileType.split('/')[0]

    if(fileStart === 'image') return true

    return false
}