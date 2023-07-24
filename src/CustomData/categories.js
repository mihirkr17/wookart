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

export const productCategories = [
   {
      id: 1,
      name: "electronics",
      img: "",
      subCategories: [
         {
            id: 1,
            name: "mobile",
            postCategories: [
               {
                  name: 'smartphone',
                  attrs: {
                     model_number: "",
                     model_name: "",
                     expandable_storage: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '32GB', '64GB', "128GB"],
                  },
                  color,
                  variant: {
                     ram: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB'],
                     rom: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '32GB', '64GB', "128GB"]
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
            postCategories: [
               {
                  name: 'headphone',
               },
               {
                  name: "cases-and-covers",
                  color,
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
      name: "men-clothing",
      img: "",
      subCategories: [
         {
            id: 1,
            name: "top-wear",
            postCategories: [
               {
                  name: 't-shirt',
                  attrs: {
                     model: "",
                  },
                  color,
                  variant: {
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
            postCategories: [
               {
                  name: 'pants',
                  attrs: {
                     model_name: "",
                  },
                  color,
                  variant: {
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