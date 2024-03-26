import yup from "yup";

export const addItemToCartValidationSchema = yup.object({
  productId: yup.string().required("Product id is required.").trim(),
  orderedQuantity: yup
    .number()
    .required("Ordered Quantity is required.")
    .min(1, "Minimum ordered quantity must be 1."),
});
