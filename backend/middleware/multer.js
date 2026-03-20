import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});

// Helper to generate multer fields for product images (default and color variants)
function getProductImageUploadMiddleware() {
    // Accept default image fields (image1, image2, image3, image4)
    const defaultFields = [1, 2, 3, 4].map(i => ({ name: `image${i}` }));

    // Accept up to 10 color variants, each with up to 4 images (adjust as needed)
    const colorFields = [];
    for (let colorIdx = 1; colorIdx <= 10; colorIdx++) {
        for (let imgIdx = 1; imgIdx <= 4; imgIdx++) {
            colorFields.push({ name: `color${colorIdx}_image${imgIdx}` });
        }
    }
    const allFields = [...defaultFields, ...colorFields];
    return multer({ storage }).fields(allFields);
}

export default multer({ storage }); // default export for legacy usage
export { getProductImageUploadMiddleware }; // named export for product image uploads