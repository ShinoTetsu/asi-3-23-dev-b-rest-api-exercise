import * as yup from "yup"

export const idValidator = yup.number().integer().min(1)

export const emailValidator = yup.string().email()

export const stringValidator = yup.string()

export const intValidator = yup.number().integer()

export const passwordValidator = yup
    .string()
    .matches(
        /^(?=.*[^\p{L}0-9])(?=.*[0-9])(?=.*\p{Lu})(?=.*\p{Ll}).{8,}$/u,
        "Password must be at least 8 chars & contain at least one of each: lower case, upper case, digit, special char."
    )
