export const isGoodPassword = (password) => {
    // Entre 6 y 20 caracteres, al menos un dígito, una minúscula y una mayúscula
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return regex.test(password)
}
