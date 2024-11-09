// import * as yup from "yup";

// export const createPostSchema = yup.object().shape({
//   title: yup.string().required("Title is required"),

//   body: yup
//     .string()
//     .required("Content is required")
//     .test("is-valid-content", "Content is required", (value) => {
//       return value !== "<p><br></p>" && value.trim() !== "";
//     }),

//   categoryId: yup.string().required("Category is required"),

//   durationId: yup.string().required("Duration is required"),

//   coverImage: yup
//     .mixed<File>()
//     .required("Cover image is required")
//     .test("fileSize", "File size is too large", (value: File) => {
//       return !value || value.size <= 1 * 1024 * 1024;
//     }),
// });

// export const updatePostSchema = yup.object().shape({
//   title: yup.string().required("Title is required"),

//   body: yup
//     .string()
//     .required("Content is required")
//     .test("is-valid-content", "Content is required", (value) => {
//       return value !== "<p><br></p>" && value.trim() !== "";
//     }),

//   categoryId: yup.string().required("Category is required"),

//   durationId: yup.string().required("Duration is required"),

//   coverImage: yup
//     .mixed<File>()
//     .nullable()
//     .test(
//       "fileSize",
//       "File size is too large",
//       (value: File | null | undefined) => {
//         return !value || value.size <= 1 * 1024 * 1024;
//       }
//     ),
// });
