// // Define an array of objects to represent categories
// const categoryList = [
//    { id: 1, name: "electronics", parent_id: null },
//    { id: 2, name: "laptops", parent_id: 1 },
//    { id: 3, name: "mobile", parent_id: 1 },
//    { id: 4, name: "home-garden", parent_id: null },
//    { id: 5, name: "furniture", parent_id: 4 },
//    { id: 6, name: "kitchen-appliances", parent_id: 4 },
//    { id: 7, name: "office-furniture", parent_id: 5 },
//    { id: 8, name: "living-room-furniture", parent_id: 5 },
//    { id: 9, name: "mobile-accessories", parent_id: 1 },
//    { id: 10, name: "headphones", parent_id: 9 },
//    { id: 11, name: "smartphones", parent_id: 3 }
// ];

// // Function to create a nested category structure
// function createCategoryTree(categories) {
//    const categoryMap = new Map();

//    // Create a map of category IDs to their corresponding objects
//    categories.forEach(category => {
//       if (!categoryMap.has(category.id)) {
//          categoryMap.set(category.id, { ...category, children: [] });
//       }
//    });

//    const categoryTree = [];

//    // Populate the parent-child relationships
//    categories.forEach(category => {
//       const currentCategory = categoryMap.get(category.id);
//       if (category.parent_id === null) {
//          categoryTree.push(currentCategory);
//       } else {
//          const parentCategory = categoryMap.get(category.parent_id);
//          if (parentCategory) {
//             parentCategory.children.push(currentCategory);
//          }
//       }
//    });

//    return categoryTree;
// }

// // Create the nested category structure
// const nestedCategories = createCategoryTree(categoryList);

// // Print the result
// export const categories = nestedCategories;




const color = [
   "Multicolor",
   "black",
   "white",
   "red",
   "green",
   "blue",
   "yellow",
   "purple",
   "orange",
   "pink",
   "gray"
]
const clothingSizes = ['S', 'M', 'L', 'XXL', 'XS'];

export const categories = [
   {
      id: 1001,
      title: "Electronics",
      value: "electronics",
      img: "",
      children: [
         {
            id: 2001,
            title: "Mobile Phones",
            value: "mobile",
            children: [
               {
                  id: 3001,
                  title: "Smartphone",
                  value: 'smartphones'
               }

            ],
         },
         {
            id: 2002,
            title: "Mobile Accessories",
            value: "mobile-accessories",
            children: [
               {
                  id: 3002,
                  title: "Headphone",
                  value: 'headphone',
               },
               {
                  id: 3003,
                  title: "Case And Covers",
                  value: "cases-covers"
               }

            ],
         }
      ],
   },

   {
      id: 1002,
      title: "Men Clothing",
      value: "men-clothing",
      img: "",
      children: [
         {
            id: 2003,
            title: "Top Wear",
            value: "top-wear",
            children: [
               {
                  id: 3004,
                  title: "T Shirts",
                  value: 't-shirt',
               }

            ],
         },
         {
            id: 2004,
            title: "Bottom Wear",
            value: "bottom-wear",
            children: [
               {
                  id: 3005,
                  title: "Pants",
                  value: 'pants'
               }
            ],

         }
      ],
   },
]

export const filterOptions2 = [
   {
      categories: ["electronics", "mobile", "smartphones"],
      attributes: {
         color,
         ram: ["1GB", '2GB', '3GB', '4GB', '6GB', '8GB', '12GB'],
         rom: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '32GB', '64GB', "128GB"]
      }
   },
   {
      categories: ["electronics", "accessories", "case-and-cover"],
      attributes: {
         color,
         suite_for: ['men', "women"],
         material: ['Iron', 'Steel', 'Rubber', 'Leather', 'Metal', "Plastic", "Silicon", "Wood"],
         theme: ['3D/Hologram', "Animal/Bird/Nature", "Automobiles", "Comics/Cartoon/Superheros", "Famous Personalities", "No Theme", "Marble", "Patterns"]
      }
   },
   {
      categories: ["men-clothing", "top-wear", "t-shirts"],
      attributes: {
         size: clothingSizes,
         color,
         fabric: ['lace', 'net', 'denim', 'nylon', 'pure-cotton', 'muslin', 'latex'],
         pattern: ['solid', 'thin', 'stripped', 'printed'],
         ideal_for: ['men', 'women', 'couple'],
         sleeve: ['sleeveless', 'layered-sleeve', 'short-sleeve', 'half-sleeve', 'full-sleeve', '3/4-sleeve', 'roll-up-sleeve'],
         fabric_care: ['regular-machine-wash', 'reverse-and-dry', 'dry-and-shade', 'do-not-tumble-dry', 'do-not-dry-clean', 'dry-clean-only'],
         fit: ['regular', 'slim', 'loose', 'boxy', 'compression'],
         suite_for: ['maternity-wear', 'western-wear'],
         sport_type: ['football', 'cricket', 'N/A']
      }
   },
   {
      categories: ["men-clothing", "bottom-wear", "pants"],
      attributes: {
         size: clothingSizes,
         color,
         fabric: ['lace', 'net', 'denim', 'nylon', 'pure-cotton', 'muslin', 'latex'],
         ideal_for: ['men', 'women', 'couple'],
         fabric_care: ['regular-machine-wash', 'reverse-and-dry', 'dry-and-shade', 'do-not-tumble-dry', 'do-not-dry-clean', 'dry-clean-only'],
         fit: ['regular', 'slim', 'loose', 'boxy', 'compression'],
         suite_for: ['maternity-wear', 'western-wear']
      }
   }
]


// Define arrays for each attribute type
const colors = [
   { value: "Red", codec: 1 },
   { value: "Blue", codec: 2 },
   { value: "Black", codec: 3 },
];

const ram = [
   { value: "1GB", codec: 4 },
   { value: "2GB", codec: 5 },
   { value: "3GB", codec: 6 },
   // ...
];

const rom = [
   { value: "1GB", codec: 7 },
   { value: "2GB", codec: 8 },
   { value: "3GB", codec: 9 },
   // ...
];

const suiteFor = [
   { value: "men", codec: 10 },
   { value: "women", codec: 11 },
];

const material = [
   { value: "Iron", codec: 12 },
   { value: "Steel", codec: 13 },
   { value: "Rubber", codec: 14 },
   { value: "Leather", codec: 15 },
   { value: "Metal", codec: 16 },
   { value: "Plastic", codec: 17 },
   { value: "Silicon", codec: 18 },
   { value: "Wood", codec: 19 },
];

const theme = [
   { value: "3D/Hologram", codec: 20 },
   { value: "Animal/Bird/Nature", codec: 21 },
   { value: "Automobiles", codec: 22 },
   { value: "Comics/Cartoon/Superheros", codec: 23 },
   { value: "Famous Personalities", codec: 24 },
   { value: "No Theme", codec: 25 },
   { value: "Marble", codec: 26 },
   { value: "Patterns", codec: 27 },
];

const clothSize = [
   { value: "S", codec: 28 },
   { value: "M", codec: 29 },
   { value: "L", codec: 30 },
   { value: "XL", codec: 31 },
];

const fabric = [
   { value: "lace", codec: 32 },
   { value: "net", codec: 33 },
   { value: "denim", codec: 34 },
   { value: "nylon", codec: 35 },
   { value: "pure-cotton", codec: 36 },
   { value: "muslin", codec: 37 },
   { value: "latex", codec: 38 },
];

const fit = [
   { value: "regular", codec: 39 },
   { value: "slim", codec: 40 },
   { value: "loose", codec: 41 },
   { value: "boxy", codec: 42 },
   { value: "compression", codec: 43 },
   // Add more fit options here
];

export const filterOptions = [
   {
      categories: ["electronics", "mobile", "smartphones"],
      attributes: {
         color: colors,
         ram: ram,
         rom: rom,
      }
   },
   {
      categories: ["electronics", "accessories", "case-and-cover"],
      attributes: {
         color: colors,
         suiteFor,
         material,
         theme,
      }
   },
   {
      categories: ["men-clothing", "top-wear", "t-shirts"],
      attributes: {
         size: clothSize,
         color: colors,
         fabric: fabric,
         fit, // Reuse the fit array
         material, 
         suiteFor, // Reuse the suite_for array
      }
   },
   // Add more filter options...

   {
      categories: ["men-clothing", "bottom-wear", "pants"],
      attributes: {
         size: clothSize,
         color: colors,
         fabric,
         fit
      }
   }
];
