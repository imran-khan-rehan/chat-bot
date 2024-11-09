import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

export const updateUserSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().required("Email is required"),
  profileImage: yup
    .mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "File size is too large",
      (value: File | null | undefined) => {
        return !value || value.size <= 1 * 1024 * 1024;
      }
    ),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Old password is required"),

  newPassword: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("New password is required"),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("New password is required"),
});
