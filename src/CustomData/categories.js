const color = [
   "No Color,#",
   "black,#000000",
   "white,#FFFFFF",
   "red,#FF0000",
   "green,#00FF00",
   "blue,#0000FF",
   "yellow,#FFFF00",
   "purple,#800080",
   "orange,#FFA500",
   "pink,#FFC0CB",
   "gray,#808080"
]
const clothingSizes = ['S', 'M', 'L', 'XXL', 'XS'];


export const newCategory = [
   {
      id: 1,
      category: "electronics",
      img: "",
      sub_category_items: [
         {
            id: 1,
            name: "mobile",
            post_category_items: [
               {
                  name: 'smartphone',
                  attrs: {
                     model_number: "",
                     model_name: "",
                     expandable_storage: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '32GB', '64GB', "128GB"],
                  },
                  variant: {
                     ram: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB'],
                     rom: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '32GB', '64GB', "128GB"],
                     color
                  },
                  specification: {
                     browse_type: ["Smartphones", "Cell Phone"],
                     sim_type: ['Dual Sim', "Single Sim"],
                     hybrid_sim_slot: ["Yes", "No"],
                     touch_screen: ["Yes", "No"],
                     otg_compatible: ["Yes", "No"],
                     display_size: ['4 inch', '4.5 inch', '5 inch', "16.26 cm (6.4 inch)", '6.6 inch'],
                     resolution: ["1600 x 720 Pixels", "1200 x 720 Pixels"],
                     resolution_type: ["HD+", "Full HD"],
                     gpu: "",
                     display_type: "",
                     display_color: "",
                     other_display_features: "",
                     operating_system: ["Android 11", "Android 12"],
                     processor_type: "",
                     processor_core: ["Octa Core", "Dual Core"],
                     primary_clock_speed: ["2 GHz", "1.9 GHz"],
                     secondary_clock_speed: ["2 GHz", "1.9 GHz", "1.8 GHz"],
                     supported_memory_card_type: "",
                     memory_card_slot_type: "",
                     primary_camera_available: ["Yes", "No"]
                  }
               }

            ],
         },
         {
            id: 2,
            name: "mobile-accessories",
            post_category_items: [
               {
                  name: 'headphone',
               },
               {
                  name: "cases-and-covers",
                  variant: {
                     color
                  },
                  attrs: {
                     model_number: "",
                  },
                  specification: {
                     sales_package: "",
                     design_for: "",
                     pack_of: "",
                     other_features: "",
                     suite_for: ['men', "women"],
                     material: ['Iron', 'Steel', 'Rubber', 'Leather', 'Metal', "Plastic", "Silicon", "Wood"],
                     theme: ['3D/Hologram', "Animal/Bird/Nature", "Automobiles", "Comics/Cartoon/Superheros", "Famous Personalities", "No Theme", "Marble", "Patterns"],
                     type: ""
                  }
               }

            ],
         }
      ],
   },

   {
      id: 2,
      category: "men-clothing",
      img: "",
      sub_category_items: [
         {
            id: 1,
            name: "top-wear",
            post_category_items: [
               {
                  name: 't-shirt',
                  attrs: {
                     model: "",
                  },
                  variant: {
                     color,
                     sizes: clothingSizes,
                  },
                  specification: {
                     fabric: ['lace', 'net', 'denim', 'nylon', 'pure-cotton', 'muslin', 'latex'],
                     type: ['round-neck'],
                     pattern: ['solid', 'thin', 'stripped', 'printed'],
                     ideal_for: ['men', 'women', 'couple'],
                     sleeve: ['sleeveless', 'layered-sleeve', 'short-sleeve', 'half-sleeve', 'full-sleeve', '3/4-sleeve', 'roll-up-sleeve'],
                     fabric_care: ['regular-machine-wash', 'reverse-and-dry', 'dry-and-shade', 'do-not-tumble-dry', 'do-not-dry-clean', 'dry-clean-only'],
                     fit: ['regular', 'slim', 'loose', 'boxy', 'compression'],
                     suite_for: ['maternity-wear', 'western-wear'],
                     sport_type: ['football', 'cricket', 'N/A']
                  }
               }

            ],
         },
         {
            id: 2,
            name: "bottom-wear",
            post_category_items: [
               {
                  name: 'pants',
                  attrs: {
                     model_name: "",
                  },
                  variant: {
                     color,
                     sizes: clothingSizes,
                  },
                  specification: {
                     fabric: ['lace', 'net', 'denim', 'nylon', 'pure-cotton', 'muslin', 'latex'],
                     type: ['round-neck'],
                     pattern: ['solid', 'thin', 'stripped', 'printed'],
                     ideal_for: ['men', 'women', 'couple'],
                     sleeve: ['sleeveless', 'layered-sleeve', 'short-sleeve', 'half-sleeve', 'full-sleeve', '3/4-sleeve', 'roll-up-sleeve'],
                     fabric_care: ['regular-machine-wash', 'reverse-and-dry', 'dry-and-shade', 'do-not-tumble-dry', 'do-not-dry-clean', 'dry-clean-only'],
                     fit: ['regular', 'slim', 'loose', 'boxy', 'compression'],
                     suite_for: ['maternity-wear', 'western-wear']
                  }
               }
            ],

         }
      ],
   },
]