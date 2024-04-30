import yup from "yup";

export const registerUserValidationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required.")
    .trim()
    .max(30, "First name must be at max 30 characters."),
  lastName: yup
    .string()
    .required("Last name is required.")
    .trim()
    .max(30, "Last name must be at max 30 characters."),
  email: yup
    .string()
    .email("Email must be valid.")
    .required("Email is required.")
    .trim()
    .max(65, "Email must be at max 60 characters.")
    .lowercase(),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters.")
    .max(20, "Password must be at max 20 characters.")
    .required("Password is required"),
  role: yup
    .string()
    .required("Role is required.")
    .trim()
    .oneOf(["buyer", "seller"], "Role must be either buyer or seller."),
  gender: yup
    .string()
    .trim()
    .oneOf(
      ["male", "female", "preferNotToSay"],
      "Gender must be either male or female or preferNotToSay."
    ),
});

export const loginUserValidationSchema = yup.object({
  email: yup
    .string()
    .email("Email is required.")
    .required("Email is required.")
    .trim()
    .lowercase(),
  password: yup.string().required("Password is required."),
});
