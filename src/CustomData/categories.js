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
      id: 1,
      name: "electronics",
      img: "",
      children: [
         {
            id: 1,
            name: "mobile",
            children: [
               {
                  name: 'smartphones'
               }

            ],
         },
         {
            id: 2,
            name: "mobile-accessories",
            children: [
               {
                  name: 'headphone',
               },
               {
                  name: "cases-and-covers"
               }

            ],
         }
      ],
   },

   {
      id: 2,
      name: "men-clothing",
      img: "",
      children: [
         {
            id: 1,
            name: "top-wear",
            children: [
               {
                  name: 't-shirt',
               }

            ],
         },
         {
            id: 2,
            name: "bottom-wear",
            children: [
               {
                  name: 'pants'
               }
            ],

         }
      ],
   },
]

export const filterOptions = [
   {
      name: 'electronics/mobile/smartphones',
      attributes: {
         color,
         ram: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB'],
         rom: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '32GB', '64GB', "128GB"]
      }
   },
   {
      name: "electronics/accessories/case-and-cover",
      attributes: {
         color,
         suite_for: ['men', "women"],
         material: ['Iron', 'Steel', 'Rubber', 'Leather', 'Metal', "Plastic", "Silicon", "Wood"],
         theme: ['3D/Hologram', "Animal/Bird/Nature", "Automobiles", "Comics/Cartoon/Superheros", "Famous Personalities", "No Theme", "Marble", "Patterns"]
      }
   },
   {
      name: 'men-clothing/top-wear/t-shirts',
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
      name: 'men-clothing/bottom-wear/pants',
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