//  STATE
let state = {
  admin: { id:'ADM-001', username:'admin', email:'admin@soucul.com', fname:'Super', lname:'Admin', role:'Super Admin', password:'admin123', since: new Date().toLocaleDateString() },
  products: [
    // ── VIGAN · HANDICRAFTS ──
    { id:'P001', name:'Burnay Pottery', brand:'SouCul Vigan', desc:'Traditional hand-thrown earthenware pot from Vigan, fired using the centuries-old Burnay technique.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:30, price:450, discount:0, image:'' },
    { id:'P002', name:'Handwoven Baskets', brand:'SouCul Vigan', desc:'Sturdy rattan baskets handwoven by local Ilocano artisans in Vigan.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:50, price:280, discount:0, image:'' },
    { id:'P003', name:'Damili Pottery', brand:'SouCul Vigan', desc:'Elegant Damili-style clay pottery unique to Vigan\'s heritage craft tradition.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:25, price:520, discount:5, image:'' },
    { id:'P004', name:'Vigan Wallets', brand:'SouCul Vigan', desc:'Hand-stitched leather wallets crafted by Vigan artisans with Ilocano motifs.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:60, price:350, discount:0, image:'' },
    { id:'P005', name:'Buri Bags', brand:'SouCul Vigan', desc:'Lightweight and eco-friendly bags woven from Buri palm leaves, a Vigan staple.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:45, price:320, discount:10, image:'' },
    { id:'P006', name:'Wood Coasters', brand:'SouCul Vigan', desc:'Set of 4 hand-carved wooden coasters with traditional Ilocano patterns.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:80, price:150, discount:0, image:'' },
    { id:'P007', name:'Labba', brand:'SouCul Vigan', desc:'Traditional Ilocano woven blanket, the Labba, made with colorful thread patterns.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:20, price:680, discount:0, image:'' },
    { id:'P008', name:'Bulatlat Pottery', brand:'SouCul Vigan', desc:'Round-bellied Bulatlat clay jar, a signature form of Vigan\'s Burnay pottery craft.', category:'Vigan', subcategory:'Handicrafts', status:'Active', stock:18, price:490, discount:0, image:'' },
    // ── BAGUIO · HANDICRAFTS ──
    { id:'P009', name:'Baguio Keychains', brand:'SouCul Baguio', desc:'Colorful handcrafted keychains featuring Baguio landmarks and tribal motifs.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:120, price:85, discount:0, image:'' },
    { id:'P010', name:'Handwoven Tela', brand:'SouCul Baguio', desc:'Beautiful handwoven fabric by Cordillera weavers using traditional backstrap looms.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:35, price:750, discount:0, image:'' },
    { id:'P011', name:'Baguio Handfan', brand:'SouCul Baguio', desc:'Handwoven rattan fan with tribal geometric patterns, perfect for warm days.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:55, price:120, discount:0, image:'' },
    { id:'P012', name:'Refrigerator Magnet', brand:'SouCul Baguio', desc:'Cute resin fridge magnet featuring iconic Baguio sceneries and attractions.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:200, price:75, discount:0, image:'' },
    { id:'P013', name:'Rattan Baskets', brand:'SouCul Baguio', desc:'Handwoven rattan storage baskets crafted by Cordillera artisans in Baguio.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:40, price:350, discount:5, image:'' },
    { id:'P014', name:'Sinalapid Slippers', brand:'SouCul Baguio', desc:'Handmade braided slippers using traditional Cordillera weaving techniques.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:30, price:290, discount:0, image:'' },
    { id:'P015', name:'Basahan Tela', brand:'SouCul Baguio', desc:'Traditional recycled cloth fabric woven into colorful rugs and mats.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:25, price:420, discount:0, image:'' },
    { id:'P016', name:'Baguio Bracelets', brand:'SouCul Baguio', desc:'Beaded bracelets inspired by Igorot tribal jewelry, handmade in Baguio.', category:'Baguio', subcategory:'Handicrafts', status:'Active', stock:90, price:110, discount:0, image:'' },
    // ── TAGAYTAY · HANDICRAFTS ──
    { id:'P017', name:'Dream Catchers', brand:'SouCul Tagaytay', desc:'Handmade dream catchers with natural feathers and beads, crafted in Tagaytay.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:45, price:220, discount:0, image:'' },
    { id:'P018', name:'I Love Tagaytay Keychain', brand:'SouCul Tagaytay', desc:'Charming souvenir keychain with Tagaytay landmark illustrations.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:150, price:80, discount:0, image:'' },
    { id:'P019', name:'I Love Tagaytay Coin Purse', brand:'SouCul Tagaytay', desc:'Handstitched coin purse with a Tagaytay-themed print.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:60, price:145, discount:0, image:'' },
    { id:'P020', name:'Tagaytay Ref Magnet', brand:'SouCul Tagaytay', desc:'Scenic Taal Volcano souvenir refrigerator magnet from Tagaytay.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:180, price:75, discount:0, image:'' },
    { id:'P021', name:'Tagaytay Bags', brand:'SouCul Tagaytay', desc:'Woven abaca tote bags featuring Tagaytay scenery prints.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:35, price:380, discount:10, image:'' },
    { id:'P022', name:'Handwoven Baskets', brand:'SouCul Tagaytay', desc:'Natural fiber baskets woven by local craftspeople in the Tagaytay region.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:40, price:260, discount:0, image:'' },
    { id:'P023', name:'Wooden Kitchenware', brand:'SouCul Tagaytay', desc:'Handcrafted wooden spoons, spatulas and ladles made from local hardwood.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:55, price:195, discount:0, image:'' },
    { id:'P024', name:'Coconut Shell Placemat', brand:'SouCul Tagaytay', desc:'Eco-friendly placemats made from woven coconut shell strips.', category:'Tagaytay', subcategory:'Handicrafts', status:'Active', stock:70, price:170, discount:0, image:'' },
    // ── BOHOL · HANDICRAFTS ──
    { id:'P025', name:'Handwoven Rattan Bag', brand:'SouCul Bohol', desc:'Stylish woven rattan bag handcrafted by Boholano artisans.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:30, price:480, discount:0, image:'' },
    { id:'P026', name:'Bamboo Coin Bank', brand:'SouCul Bohol', desc:'Handmade bamboo coin bank shaped like a traditional Bohol hut.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:65, price:130, discount:0, image:'' },
    { id:'P027', name:'Wooden Carved Ashtray', brand:'SouCul Bohol', desc:'Hand-carved wooden ashtray with Bohol tarsier motif.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:40, price:210, discount:0, image:'' },
    { id:'P028', name:'Round Woven Box', brand:'SouCul Bohol', desc:'Round buri-woven storage box with lid, perfect as a jewelry or keepsake box.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:50, price:295, discount:5, image:'' },
    { id:'P029', name:'Bohol Coin Purse', brand:'SouCul Bohol', desc:'Handwoven coin purse with Bohol-inspired patterns and tarsier embroidery.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:75, price:120, discount:0, image:'' },
    { id:'P030', name:'Handwoven Slippers', brand:'SouCul Bohol', desc:'Comfortable handwoven abaca slippers from local Bohol craftspeople.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:28, price:310, discount:0, image:'' },
    { id:'P031', name:'Wooden Ref Magnet', brand:'SouCul Bohol', desc:'Wooden fridge magnet with laser-engraved Bohol landmarks and tarsier design.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:160, price:90, discount:0, image:'' },
    { id:'P032', name:'Bohol Wooden Keychain', brand:'SouCul Bohol', desc:'Hand-carved wooden keychain with Bohol Chocolate Hills silhouette.', category:'Bohol', subcategory:'Handicrafts', status:'Active', stock:130, price:80, discount:0, image:'' },
    // ── BORACAY · HANDICRAFTS ──
    { id:'P033', name:'Boracay Wooden Ref Magnet', brand:'SouCul Boracay', desc:'Handpainted wooden fridge magnet featuring Boracay\'s White Beach.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:200, price:85, discount:0, image:'' },
    { id:'P034', name:'Boracay Keychain', brand:'SouCul Boracay', desc:'Fun seashell-and-resin keychain souvenir from Boracay island.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:175, price:80, discount:0, image:'' },
    { id:'P035', name:'Boracay Bracelet', brand:'SouCul Boracay', desc:'Handmade shell and bead bracelet crafted by local Boracay artisans.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:95, price:115, discount:0, image:'' },
    { id:'P036', name:'Handmade Pearl Necklace', brand:'SouCul Boracay', desc:'Elegant freshwater pearl necklace handcrafted by island jewelers in Boracay.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:20, price:980, discount:0, image:'' },
    { id:'P037', name:'Boracay Pin', brand:'SouCul Boracay', desc:'Enamel pin featuring Boracay\'s iconic sailboats and sunset scenery.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:110, price:95, discount:0, image:'' },
    { id:'P038', name:'Boracay Tote Bag', brand:'SouCul Boracay', desc:'Canvas tote bag with hand-printed Boracay beach artwork.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:55, price:320, discount:10, image:'' },
    { id:'P039', name:'Boracay Coin Purse', brand:'SouCul Boracay', desc:'Seashell-embellished handmade coin purse, a cute Boracay keepsake.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:80, price:130, discount:0, image:'' },
    { id:'P040', name:'Boracay Bottle Opener', brand:'SouCul Boracay', desc:'Novelty wooden bottle opener shaped like a surfboard with Boracay branding.', category:'Boracay', subcategory:'Handicrafts', status:'Active', stock:65, price:145, discount:0, image:'' },
    // ── VIGAN · DELICACIES ──
    { id:'P041', name:'Royal Bibingka', brand:'SouCul Vigan', desc:'Traditional Ilocano bibingka made with glutinous rice, sugar, and coconut milk.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:40, price:180, discount:0, image:'' },
    { id:'P042', name:'Chicacorn', brand:'SouCul Vigan', desc:'Savory and crunchy corn snack, a popular pasalubong from Vigan.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:100, price:95, discount:0, image:'' },
    { id:'P043', name:'Turones De Mani', brand:'SouCul Vigan', desc:'Crispy fried peanut turrones wrapped in a sweet caramel casing.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:80, price:120, discount:0, image:'' },
    { id:'P044', name:'Bolero', brand:'SouCul Vigan', desc:'Sweet Ilocano candy made from caramelized sugar and peanuts.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:90, price:85, discount:0, image:'' },
    { id:'P045', name:'Empanadita', brand:'SouCul Vigan', desc:'Miniature Vigan empanadas filled with longganisa, egg, and vegetables.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:30, price:150, discount:0, image:'' },
    { id:'P046', name:'Calamay', brand:'SouCul Vigan', desc:'Sticky sweet rice delicacy cooked with coconut milk and sugar.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:50, price:165, discount:0, image:'' },
    { id:'P047', name:'Vigan Longganisa', brand:'SouCul Vigan', desc:'Famous garlic-rich Vigan sausage, a beloved Ilocano breakfast staple.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:35, price:220, discount:0, image:'' },
    { id:'P048', name:'Bagnet Vigan', brand:'SouCul Vigan', desc:'Crispy double-fried pork belly, the Ilocano version of chicharon.', category:'Vigan', subcategory:'Delicacies', status:'Active', stock:25, price:280, discount:0, image:'' },
    // ── BAGUIO · DELICACIES ──
    { id:'P049', name:'Cream Puffs', brand:'SouCul Baguio', desc:'Fluffy choux pastry filled with fresh cream, Baguio\'s most iconic pasalubong.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:40, price:195, discount:0, image:'' },
    { id:'P050', name:'Ube Jam', brand:'SouCul Baguio', desc:'Creamy homemade purple yam jam from the highlands of Baguio.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:60, price:175, discount:0, image:'' },
    { id:'P051', name:'Lengua De Gato', brand:'SouCul Baguio', desc:'Delicate butter cookies shaped like cat tongues, a Baguio baking tradition.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:70, price:155, discount:0, image:'' },
    { id:'P052', name:'Peanut Brittle', brand:'SouCul Baguio', desc:'Classic crunchy peanut brittle made with fresh Benguet peanuts.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:85, price:110, discount:0, image:'' },
    { id:'P053', name:"Choc'O Flakes", brand:'SouCul Baguio', desc:'Crispy chocolate-coated corn flake clusters, a sweet Baguio treat.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:95, price:130, discount:0, image:'' },
    { id:'P054', name:'Baguio Strawberry', brand:'SouCul Baguio', desc:'Fresh highland strawberries from La Trinidad Valley, Benguet.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:20, price:120, discount:0, image:'' },
    { id:'P055', name:'Baguio Meringue', brand:'SouCul Baguio', desc:'Light and crispy meringue cookies with a melt-in-your-mouth texture.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:65, price:145, discount:0, image:'' },
    { id:'P056', name:'Ube Crinkles', brand:'SouCul Baguio', desc:'Soft and chewy purple yam crinkle cookies dusted with powdered sugar.', category:'Baguio', subcategory:'Delicacies', status:'Active', stock:55, price:160, discount:0, image:'' },
    // ── TAGAYTAY · DELICACIES ──
    { id:'P057', name:"Rowena's Blueberry Cheese Tarts", brand:'SouCul Tagaytay', desc:'Famous blueberry-topped cream cheese tarts from Rowena\'s in Tagaytay.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:30, price:240, discount:0, image:'' },
    { id:'P058', name:'Balay Dako Piaya', brand:'SouCul Tagaytay', desc:'Flat sugarcane-filled unleavened bread, inspired by Balay Dako\'s local flavors.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:45, price:160, discount:0, image:'' },
    { id:'P059', name:"Bag of Beans' Raisin Bread", brand:'SouCul Tagaytay', desc:'Hearty homemade raisin bread from the beloved Bag of Beans café in Tagaytay.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:25, price:210, discount:0, image:'' },
    { id:'P060', name:'Buko Pie', brand:'SouCul Tagaytay', desc:'Creamy young coconut pie, Tagaytay\'s most famous pasalubong.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:35, price:195, discount:0, image:'' },
    { id:'P061', name:'Banana Cake', brand:'SouCul Tagaytay', desc:'Moist and flavorful banana loaf cake baked fresh in Tagaytay.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:30, price:220, discount:0, image:'' },
    { id:'P062', name:"Rodilla's Yema Cake", brand:'SouCul Tagaytay', desc:'Indulgent yema frosted chiffon cake from Rodilla\'s Bakeshop in Tagaytay.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:20, price:350, discount:0, image:'' },
    { id:'P063', name:'Espasol', brand:'SouCul Tagaytay', desc:'Soft cylindrical rice flour delicacy rolled in toasted coconut, a Tagaytay classic.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:60, price:130, discount:0, image:'' },
    { id:'P064', name:'Sylvannas', brand:'SouCul Tagaytay', desc:'Cashew meringue wafers sandwiched with French buttercream, Tagaytay\'s sweet pride.', category:'Tagaytay', subcategory:'Delicacies', status:'Active', stock:50, price:185, discount:0, image:'' },
    // ── BOHOL · DELICACIES ──
    { id:'P065', name:'Peanut Kisses', brand:'SouCul Bohol', desc:'Tiny dome-shaped peanut cookies, Bohol\'s most iconic and beloved pasalubong.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:100, price:120, discount:0, image:'' },
    { id:'P066', name:'Broas', brand:'SouCul Bohol', desc:'Light and airy ladyfinger sponge biscuits, a traditional Bohol delicacy.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:75, price:110, discount:0, image:'' },
    { id:'P067', name:"Bohol's Calamay", brand:'SouCul Bohol', desc:'Sweet sticky rice delicacy cooked in coconut milk, served in a coconut shell.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:40, price:165, discount:0, image:'' },
    { id:'P068', name:'Ube Kinampay Polvoron', brand:'SouCul Bohol', desc:'Melt-in-your-mouth polvoron made with Bohol\'s prized Kinampay purple yam.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:65, price:140, discount:0, image:'' },
    { id:'P069', name:'Tinapay Crisp', brand:'SouCul Bohol', desc:'Twice-baked crunchy bread crisps, a satisfying snack from Bohol.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:80, price:95, discount:0, image:'' },
    { id:'P070', name:'Dalareich Chocolates', brand:'SouCul Bohol', desc:'Artisanal Philippine cacao chocolates crafted by Dalareich in Bohol.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:45, price:220, discount:5, image:'' },
    { id:'P071', name:'Calamay Bun', brand:'SouCul Bohol', desc:'Soft bread rolls filled with sweet calamay coconut-rice filling.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:35, price:130, discount:0, image:'' },
    { id:'P072', name:'Hillcolate', brand:'SouCul Bohol', desc:'Rich tablea-based chocolate drink mix made from locally sourced Bohol cacao.', category:'Bohol', subcategory:'Delicacies', status:'Active', stock:55, price:185, discount:0, image:'' },
    // ── BORACAY · DELICACIES ──
    { id:'P073', name:'Biscocho', brand:'SouCul Boracay', desc:'Crispy twice-baked bread slices brushed with butter and sugar, a Visayan classic.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:90, price:105, discount:0, image:'' },
    { id:'P074', name:'Calamansi Muffin', brand:'SouCul Boracay', desc:'Zesty calamansi-infused muffins baked fresh, a Boracay resort favorite.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:40, price:150, discount:0, image:'' },
    { id:'P075', name:'Butterscotch', brand:'SouCul Boracay', desc:'Sweet and buttery butterscotch candy squares, a popular island treat.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:80, price:115, discount:0, image:'' },
    { id:'P076', name:'Banana Chips', brand:'SouCul Boracay', desc:'Thin crispy banana chips fried to golden perfection, lightly salted or sweetened.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:110, price:90, discount:0, image:'' },
    { id:'P077', name:'Otap', brand:'SouCul Boracay', desc:'Flaky oval-shaped puff pastry dusted with sugar, a beloved Visayan biscuit.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:85, price:100, discount:0, image:'' },
    { id:'P078', name:'Barquillos', brand:'SouCul Boracay', desc:'Thin rolled wafer tubes with a crispy texture, a light and addictive snack.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:75, price:95, discount:0, image:'' },
    { id:'P079', name:'Kalamansi Marmalade', brand:'SouCul Boracay', desc:'Tangy homemade calamansi marmalade jarred fresh from island kitchens.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:50, price:165, discount:0, image:'' },
    { id:'P080', name:'Fish Cracker', brand:'SouCul Boracay', desc:'Light and crispy fish-flavored crackers made from fresh island seafood.', category:'Boracay', subcategory:'Delicacies', status:'Active', stock:95, price:85, discount:0, image:'' },
    // ── VIGAN · DECORATIONS ──
    { id:'P081', name:'Burnay Art Prints', brand:'SouCul Vigan', desc:'Framed art prints depicting Burnay pottery-making traditions of Vigan.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:20, price:380, discount:0, image:'' },
    { id:'P082', name:'Vigan Streetscape Art', brand:'SouCul Vigan', desc:'Watercolor print of Vigan\'s cobblestone Calle Crisologo heritage street.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:15, price:450, discount:0, image:'' },
    { id:'P083', name:'Inabel Placemats', brand:'SouCul Vigan', desc:'Set of 4 handwoven Inabel fabric placemats with traditional Ilocano stripe patterns.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:35, price:320, discount:0, image:'' },
    { id:'P084', name:'Miniature Kalesa Model', brand:'SouCul Vigan', desc:'Detailed wooden miniature of the iconic Vigan horse-drawn carriage.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:22, price:580, discount:5, image:'' },
    { id:'P085', name:'Decorative Vases', brand:'SouCul Vigan', desc:'Hand-thrown and glazed decorative vases in the Burnay pottery tradition.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:18, price:620, discount:0, image:'' },
    { id:'P086', name:'Ancestral House Figurine', brand:'SouCul Vigan', desc:'Resin miniature of a Vigan ancestral house facade, a beautiful desk decor.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:25, price:490, discount:0, image:'' },
    { id:'P087', name:'Clay Sculpture', brand:'SouCul Vigan', desc:'Original hand-sculpted clay artwork by Vigan artisans depicting local life.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:10, price:750, discount:0, image:'' },
    { id:'P088', name:'Milling Stone Decor', brand:'SouCul Vigan', desc:'Decorative miniature milling stone sculpture referencing Vigan\'s heritage industry.', category:'Vigan', subcategory:'Decorations', status:'Active', stock:12, price:520, discount:0, image:'' },
    // ── BAGUIO · DECORATIONS ──
    { id:'P089', name:'Ifugao Rice Guardian', brand:'SouCul Baguio', desc:'Carved wooden Bulol figure, the Ifugao rice guardian deity, a sacred art piece.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:15, price:890, discount:0, image:'' },
    { id:'P090', name:'Igorot Tribal Wood Carving', brand:'SouCul Baguio', desc:'Hand-carved hardwood figure depicting an Igorot warrior in traditional attire.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:12, price:1200, discount:0, image:'' },
    { id:'P091', name:'Woven Textile Wall Art', brand:'SouCul Baguio', desc:'Framed Cordillera handwoven textile panel used as a striking wall decoration.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:18, price:780, discount:0, image:'' },
    { id:'P092', name:'Giant Wooden Spoon and Fork Wall Decor', brand:'SouCul Baguio', desc:'Oversized hand-carved wooden kitchen decor set, a Filipino home classic.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:20, price:650, discount:0, image:'' },
    { id:'P093', name:'Ifugao Tribal Mask', brand:'SouCul Baguio', desc:'Carved wooden tribal mask from Ifugao artisans, rich with cultural symbolism.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:8, price:1450, discount:0, image:'' },
    { id:'P094', name:'Barrel Man', brand:'SouCul Baguio', desc:'The iconic novelty Baguio souvenir: a carved wooden man popping from a barrel.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:60, price:185, discount:0, image:'' },
    { id:'P095', name:'Tribal Bust', brand:'SouCul Baguio', desc:'Detailed wooden bust sculpture of an Igorot tribal elder with traditional headgear.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:10, price:980, discount:0, image:'' },
    { id:'P096', name:'Animal Wood Carving', brand:'SouCul Baguio', desc:'Hand-carved wooden animal figures — eagles, lizards, and forest creatures.', category:'Baguio', subcategory:'Decorations', status:'Active', stock:35, price:320, discount:5, image:'' },
    // ── TAGAYTAY · DECORATIONS ──
    { id:'P097', name:'Ilog Maria Beeswax Candle', brand:'SouCul Tagaytay', desc:'Pure beeswax pillar candle from Ilog Maria Honeybee Farm in Silang, Cavite.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:40, price:280, discount:0, image:'' },
    { id:'P098', name:'Taal Lake Wall Painting', brand:'SouCul Tagaytay', desc:'Acrylic painting of Taal Volcano and lake, by local Tagaytay artists.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:10, price:1800, discount:0, image:'' },
    { id:'P099', name:'Small Potted Plants', brand:'SouCul Tagaytay', desc:'Miniature highland succulents and ferns potted in ceramic pots from Tagaytay.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:50, price:145, discount:0, image:'' },
    { id:'P100', name:'Tagaytay Postcard', brand:'SouCul Tagaytay', desc:'Set of 6 illustrated postcards featuring Tagaytay landmarks and scenery.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:120, price:75, discount:0, image:'' },
    { id:'P101', name:'Tagaytay Mini Figurines', brand:'SouCul Tagaytay', desc:'Resin mini figurines of Taal Volcano, Picnic Grove, and Sky Ranch.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:45, price:190, discount:0, image:'' },
    { id:'P102', name:'Dreamcatcher Wall Display', brand:'SouCul Tagaytay', desc:'Large handmade dreamcatcher wall hanging with dried flowers and feathers.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:20, price:480, discount:0, image:'' },
    { id:'P103', name:'Cellphone Holder', brand:'SouCul Tagaytay', desc:'Hand-carved wooden phone stand with a Tagaytay motif design.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:55, price:165, discount:0, image:'' },
    { id:'P104', name:'Pen Holder', brand:'SouCul Tagaytay', desc:'Rustic wooden pen holder carved from Tagaytay mahogany wood.', category:'Tagaytay', subcategory:'Decorations', status:'Active', stock:60, price:140, discount:0, image:'' },
    // ── BOHOL · DECORATIONS ──
    { id:'P105', name:'Antequera Baskets', brand:'SouCul Bohol', desc:'Tightly woven rattan baskets from Antequera, Bohol\'s basket-weaving capital.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:35, price:350, discount:0, image:'' },
    { id:'P106', name:'Table Runners', brand:'SouCul Bohol', desc:'Handwoven abaca table runners with traditional Bohol patterns.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:28, price:280, discount:0, image:'' },
    { id:'P107', name:'Bohol Shell Decor', brand:'SouCul Bohol', desc:'Decorative shell arrangements crafted from local Bohol sea shells.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:45, price:195, discount:0, image:'' },
    { id:'P108', name:'Coconut Bowls with Mother of Pearl', brand:'SouCul Bohol', desc:'Polished coconut shell bowl inlaid with mother-of-pearl, a Bohol specialty.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:30, price:420, discount:5, image:'' },
    { id:'P109', name:'Tarsier Wood Carving', brand:'SouCul Bohol', desc:'Charming hand-carved tarsier figurine, a symbol of Bohol\'s natural heritage.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:40, price:380, discount:0, image:'' },
    { id:'P110', name:'Asin Tibuok', brand:'SouCul Bohol', desc:'Rare artisanal sea salt from Alburquerque, Bohol — a heritage craft product.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:15, price:650, discount:0, image:'' },
    { id:'P111', name:'Buri Lampshade', brand:'SouCul Bohol', desc:'Handwoven buri palm lampshade casting beautiful patterns of light and shadow.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:18, price:780, discount:0, image:'' },
    { id:'P112', name:'Capiz Shell Window', brand:'SouCul Bohol', desc:'Decorative capiz shell window panel that glows beautifully when backlit.', category:'Bohol', subcategory:'Decorations', status:'Active', stock:8, price:1200, discount:0, image:'' },
    // ── BORACAY · DECORATIONS ──
    { id:'P113', name:'Boracay Sand Bottles', brand:'SouCul Boracay', desc:'Miniature glass bottles filled with Boracay\'s famous white sand and shells.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:80, price:125, discount:0, image:'' },
    { id:'P114', name:'Abaca Placemats', brand:'SouCul Boracay', desc:'Handwoven abaca fiber placemats with natural coastal weave texture.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:50, price:220, discount:0, image:'' },
    { id:'P115', name:'Boracay Painting', brand:'SouCul Boracay', desc:'Vibrant acrylic painting of Boracay\'s White Beach at sunset by local artists.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:12, price:1500, discount:0, image:'' },
    { id:'P116', name:'Miniature Boat Models', brand:'SouCul Boracay', desc:'Hand-carved wooden model of a traditional Boracay paraw sailing boat.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:25, price:560, discount:0, image:'' },
    { id:'P117', name:'Boracay Lanterns', brand:'SouCul Boracay', desc:'Hand-woven rattan lanterns inspired by the warm glow of Boracay beachside nights.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:30, price:390, discount:0, image:'' },
    { id:'P118', name:'Shell Chimes', brand:'SouCul Boracay', desc:'Melodic wind chimes strung with assorted sea shells from Boracay beaches.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:55, price:185, discount:0, image:'' },
    { id:'P119', name:'Stone Figurines', brand:'SouCul Boracay', desc:'Smooth hand-polished stone figurines carved into sea creatures and island shapes.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:40, price:260, discount:0, image:'' },
    { id:'P120', name:'Wooden Plate Decor', brand:'SouCul Boracay', desc:'Decorative hand-painted wooden plate with Boracay beach scene artwork.', category:'Boracay', subcategory:'Decorations', status:'Active', stock:22, price:340, discount:0, image:'' },
    // ── VIGAN · HOMEWARE ──
    { id:'P121', name:'Burnay Pottery Set', brand:'SouCul Vigan', desc:'A set of functional Burnay clay pots and jars for the home, fired the traditional way.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:15, price:850, discount:0, image:'' },
    { id:'P122', name:'Wooden Furnitures', brand:'SouCul Vigan', desc:'Small handcrafted wooden accent furniture pieces made from Vigan hardwood.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:8, price:2500, discount:0, image:'' },
    { id:'P123', name:'Buri Baskets and Storage', brand:'SouCul Vigan', desc:'Practical Buri palm storage baskets of various sizes for home organization.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:40, price:380, discount:0, image:'' },
    { id:'P124', name:'Inabel Cloth', brand:'SouCul Vigan', desc:'Handwoven Inabel fabric by the meter, usable for clothing or home textiles.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:25, price:550, discount:5, image:'' },
    { id:'P125', name:'Shell Lamp', brand:'SouCul Vigan', desc:'Table lamp crafted from capiz shells mounted on a bamboo frame.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:12, price:980, discount:0, image:'' },
    { id:'P126', name:'Wood Carved Wall Decor', brand:'SouCul Vigan', desc:'Relief wood carving wall panel depicting Vigan\'s historic streetscapes.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:10, price:1200, discount:0, image:'' },
    { id:'P127', name:'Bamboo Rattan Furnitures', brand:'SouCul Vigan', desc:'Lightweight and durable rattan accent furniture crafted by Ilocano artisans.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:6, price:3200, discount:0, image:'' },
    { id:'P128', name:'Bulatlat Pottery Set', brand:'SouCul Vigan', desc:'Collection of Bulatlat-style handthrown pottery for everyday home use.', category:'Vigan', subcategory:'Homeware', status:'Active', stock:14, price:720, discount:0, image:'' },
    // ── BAGUIO · HOMEWARE ──
    { id:'P129', name:'Ifugao Wooden Statue', brand:'SouCul Baguio', desc:'Bold carved hardwood Ifugao statue for home or office display.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:10, price:1500, discount:0, image:'' },
    { id:'P130', name:'Wooden Tableware', brand:'SouCul Baguio', desc:'Set of handcrafted wooden plates, bowls and serving utensils from Baguio.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:22, price:680, discount:0, image:'' },
    { id:'P131', name:'Terracotta Planters', brand:'SouCul Baguio', desc:'Rustic terracotta pots for indoor plants, perfect for highland herbs.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:35, price:290, discount:0, image:'' },
    { id:'P132', name:'Igorot Handwoven Blankets', brand:'SouCul Baguio', desc:'Thick, warm handwoven blankets with Cordillera geometric patterns, ideal for highland nights.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:15, price:1100, discount:0, image:'' },
    { id:'P133', name:'Handwoven Foot Rugs', brand:'SouCul Baguio', desc:'Colorful woven floor rugs made from recycled textile strips by Baguio weavers.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:20, price:450, discount:0, image:'' },
    { id:'P134', name:'Bamboo Lantern', brand:'SouCul Baguio', desc:'Handcrafted hanging bamboo lantern for warm ambient indoor lighting.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:28, price:380, discount:0, image:'' },
    { id:'P135', name:'Mug', brand:'SouCul Baguio', desc:'Ceramic mug painted with Baguio mountain scenery, a cozy highland souvenir.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:60, price:195, discount:0, image:'' },
    { id:'P136', name:'Wall Photo', brand:'SouCul Baguio', desc:'Framed photograph print of Baguio\'s iconic Burnham Park and flower festival.', category:'Baguio', subcategory:'Homeware', status:'Active', stock:18, price:420, discount:0, image:'' },
    // ── TAGAYTAY · HOMEWARE ──
    { id:'P137', name:'Mahogany Bowl', brand:'SouCul Tagaytay', desc:'Hand-turned mahogany wood bowl, smooth and beautifully grained.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:18, price:580, discount:0, image:'' },
    { id:'P138', name:'Abaca Basket', brand:'SouCul Tagaytay', desc:'Multipurpose abaca fiber basket for storage, picnics, or display.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:32, price:320, discount:0, image:'' },
    { id:'P139', name:'Tagaytay Terracotta Planters', brand:'SouCul Tagaytay', desc:'Hand-thrown terracotta planters perfect for Tagaytay\'s cool highland flora.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:28, price:265, discount:0, image:'' },
    { id:'P140', name:'Tagaytay Candle', brand:'SouCul Tagaytay', desc:'Scented soy candle with Tagaytay pine and eucalyptus fragrance blend.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:50, price:245, discount:0, image:'' },
    { id:'P141', name:'Wood Clock', brand:'SouCul Tagaytay', desc:'Rustic wooden wall clock laser-engraved with Tagaytay\'s Taal Volcano silhouette.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:15, price:680, discount:0, image:'' },
    { id:'P142', name:'Embroidered Linens', brand:'SouCul Tagaytay', desc:'Hand-embroidered table linens with floral motifs inspired by Tagaytay gardens.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:22, price:490, discount:0, image:'' },
    { id:'P143', name:'Wood Chimes', brand:'SouCul Tagaytay', desc:'Gentle-sounding wooden wind chimes with Tagaytay mountain carvings.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:38, price:220, discount:0, image:'' },
    { id:'P144', name:'Concrete Planters', brand:'SouCul Tagaytay', desc:'Modern handmade concrete planters with a minimalist aesthetic.', category:'Tagaytay', subcategory:'Homeware', status:'Active', stock:25, price:350, discount:0, image:'' },
    // ── BOHOL · HOMEWARE ──
    { id:'P145', name:'Bohol Coconut Bowl', brand:'SouCul Bohol', desc:'Smooth polished coconut shell bowl, perfect for breakfast bowls or decor.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:55, price:195, discount:0, image:'' },
    { id:'P146', name:'Seashell Chime', brand:'SouCul Bohol', desc:'Breezy wind chime made from assorted Bohol sea shells and driftwood.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:45, price:185, discount:0, image:'' },
    { id:'P147', name:'Tubigon Weave', brand:'SouCul Bohol', desc:'Intricately woven mat or tray from Tubigon, one of Bohol\'s finest weaving towns.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:20, price:420, discount:0, image:'' },
    { id:'P148', name:'Wooden Kitchenware', brand:'SouCul Bohol', desc:'Handcrafted wooden kitchen tools — spatulas, spoons, and boards from Bohol.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:38, price:280, discount:0, image:'' },
    { id:'P149', name:'Antequera Baskets', brand:'SouCul Bohol', desc:'Large functional rattan storage baskets from Antequera\'s master weavers.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:22, price:450, discount:0, image:'' },
    { id:'P150', name:'Woven Nito Vine Accessories', brand:'SouCul Bohol', desc:'Elegant nito vine woven accessories including trays and coaster sets.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:18, price:380, discount:5, image:'' },
    { id:'P151', name:'Bohol Bamboo Furniture', brand:'SouCul Bohol', desc:'Lightweight bamboo accent furniture handcrafted in the Bohol countryside.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:5, price:3500, discount:0, image:'' },
    { id:'P152', name:'Woven Buri Window Blinds', brand:'SouCul Bohol', desc:'Natural buri palm roll-up window blinds that filter light beautifully.', category:'Bohol', subcategory:'Homeware', status:'Active', stock:10, price:1100, discount:0, image:'' },
    // ── BORACAY · HOMEWARE ──
    { id:'P153', name:'Shell Decor', brand:'SouCul Boracay', desc:'Curated collection of decorative sea shells from Boracay\'s coastal waters.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:60, price:180, discount:0, image:'' },
    { id:'P154', name:'Puka Shell Chandeliers', brand:'SouCul Boracay', desc:'Bohemian hanging shell chandelier made from Boracay\'s prized puka shells.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:8, price:2800, discount:0, image:'' },
    { id:'P155', name:'Driftwood Centerpiece Bowls', brand:'SouCul Boracay', desc:'Natural driftwood bowl centerpiece collected from Boracay\'s shoreline.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:15, price:650, discount:0, image:'' },
    { id:'P156', name:'Pandanus (Bariw) Floor Mats', brand:'SouCul Boracay', desc:'Handwoven floor mats from Pandanus leaves, soft and durable for home use.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:20, price:480, discount:0, image:'' },
    { id:'P157', name:'Aqua de Boracay Home Fragrance', brand:'SouCul Boracay', desc:'Tropical ocean-inspired home fragrance mist, bottled from Boracay.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:40, price:320, discount:0, image:'' },
    { id:'P158', name:'Coconut Shell Soy Candles', brand:'SouCul Boracay', desc:'Soy wax candles poured into polished coconut shells with tropical scents.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:50, price:285, discount:0, image:'' },
    { id:'P159', name:'Kamagong Utensils', brand:'SouCul Boracay', desc:'Premium hardwood utensil set crafted from Philippine Kamagong (ebony) wood.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:12, price:850, discount:0, image:'' },
    { id:'P160', name:'Tsokolatera & Batirol', brand:'SouCul Boracay', desc:'Traditional Filipino chocolate pot and wooden whisk set for making tablea drinks.', category:'Boracay', subcategory:'Homeware', status:'Active', stock:18, price:620, discount:0, image:'' },
    // ── CLOTHES ──
    { id:'P161', name:'Inabel Woven Polo', brand:'SouCul Vigan', desc:'Smart casual polo shirt woven with traditional Ilocano Inabel fabric patterns.', category:'Vigan', subcategory:'Clothes', status:'Coming Soon', stock:0, price:950, discount:0, image:'' },
    { id:'P162', name:'Igorot Tribal Print T-Shirt', brand:'SouCul Baguio', desc:'Graphic tee featuring Cordillera tribal motifs printed on combed cotton.', category:'Baguio', subcategory:'Clothes', status:'Coming Soon', stock:0, price:580, discount:0, image:'' },
    { id:'P163', name:'Tagaytay Linen Shirt', brand:'SouCul Tagaytay', desc:'Breezy linen shirt embroidered with highland flower and Taal motifs.', category:'Tagaytay', subcategory:'Clothes', status:'Coming Soon', stock:0, price:750, discount:0, image:'' },
    { id:'P164', name:'Bohol Abaca Tote Dress', brand:'SouCul Bohol', desc:'Casual woven abaca-blend dress with earthy Bohol island-inspired colors.', category:'Bohol', subcategory:'Clothes', status:'Coming Soon', stock:0, price:880, discount:0, image:'' },
    { id:'P165', name:'Boracay Beach Shirt', brand:'SouCul Boracay', desc:'Lightweight beach shirt with Boracay island prints and shell-button accents.', category:'Boracay', subcategory:'Clothes', status:'Coming Soon', stock:0, price:620, discount:0, image:'' },
  ],
  users: [
    { id:'U001', username:'jdelacruz', email:'juan@email.com', password:'••••••', role:'User' },
    { id:'U002', username:'mariareyes', email:'maria@email.com', password:'••••••', role:'Seller' },
    { id:'U003', username:'pedro123', email:'pedro@email.com', password:'••••••', role:'User' },
  ],
  orders: [
    { id:'ORD-001', customer:'Juan dela Cruz', email:'juan@email.com', phone:'09171234567', address:'123 Rizal St, Manila', total:730, status:'Completed', customerConfirmed:'received', date:'2025-03-10', items:[{name:'Peanut Kisses',qty:2,price:120},{name:'Bohol Coin Purse',qty:1,price:120},{name:'Broas',qty:2,price:110}] },
    { id:'ORD-002', customer:'Maria Reyes', email:'maria@email.com', phone:'09181234567', address:'456 Mabini Ave, Cebu', total:895, status:'Pending', customerConfirmed:null, date:'2025-03-15', items:[{name:'Cream Puffs',qty:2,price:195},{name:'Baguio Bracelets',qty:3,price:110},{name:'Refrigerator Magnet',qty:2,price:75}] },
    { id:'ORD-003', customer:'Pedro Santos', email:'pedro@email.com', phone:'09191234567', address:'789 Bonifacio Rd, Davao', total:1160, status:'Processing', customerConfirmed:null, date:'2025-03-16', items:[{name:'Vigan Longganisa',qty:2,price:220},{name:'Burnay Pottery',qty:1,price:450},{name:'Calamay',qty:1,price:165}] },
    { id:'ORD-004', customer:'Ana Lim', email:'ana@email.com', phone:'09201234567', address:'321 Luna St, QC', total:1480, status:'Shipped', customerConfirmed:'pending', date:'2025-03-17', items:[{name:'Handmade Pearl Necklace',qty:1,price:980},{name:'Boracay Bracelet',qty:2,price:115},{name:'Boracay Coin Purse',qty:2,price:130}] },
    { id:'ORD-005', customer:'Lito Manalo', email:'lito@email.com', phone:'09221234567', address:'55 Katipunan Ave, QC', total:620, status:'Completed', customerConfirmed:'received', date:'2025-03-18', items:[{name:'Dream Catchers',qty:1,price:220},{name:'Buko Pie',qty:2,price:195}] },
    { id:'ORD-006', customer:'Rose Villanueva', email:'rose@email.com', phone:'09231234567', address:'10 Colon St, Cebu City', total:540, status:'Cancelled', customerConfirmed:null, date:'2025-03-19', items:[{name:'Biscocho',qty:2,price:105},{name:'Otap',qty:2,price:100},{name:'Barquillos',qty:2,price:95}] },
  ],
  vouchers: [
    { id:'V001', code:'SOUCUL10', type:'Percentage (%)', value:10, minPurchase:300, maxDiscount:150, limit:100, used:23, from:'2025-01-01', until:'2025-06-30', status:'Active', desc:'10% off sitewide for SoulCul shoppers' },
    { id:'V002', code:'WELCOME50', type:'Fixed Amount (₱)', value:50, minPurchase:350, maxDiscount:50, limit:200, used:88, from:'2025-01-01', until:'2025-12-31', status:'Active', desc:'₱50 welcome discount for new customers' },
    { id:'V003', code:'VIGAN15', type:'Percentage (%)', value:15, minPurchase:400, maxDiscount:200, limit:50, used:5, from:'2025-03-01', until:'2025-05-31', status:'Active', desc:'15% off all Vigan products' },
    { id:'V004', code:'BOHOL20', type:'Percentage (%)', value:20, minPurchase:500, maxDiscount:300, limit:50, used:2, from:'2025-03-01', until:'2025-04-30', status:'Active', desc:'20% off Bohol collection — limited time' },
  ],
  admins: [],
  audit: [],
  archivedProducts: [],
  archivedUsers: [],
  archivedOrders: [],
  notifications: [],
  currentOrderId: null,
};

//  AUTH
function setLoginMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'global-msg ' + type;
}
function setLoginFieldErr(errId, text) {
  const el = document.getElementById(errId);
  if(el) el.textContent = text;
}
function doLogin() {
  const em = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  let valid = true;
  if(!em) { setLoginFieldErr('login-email-err','Email is required.'); valid=false; } else { setLoginFieldErr('login-email-err',''); }
  if(!pw) { setLoginFieldErr('login-password-err','Password is required.'); valid=false; } else { setLoginFieldErr('login-password-err',''); }
  if(!valid) return;
  if (em === state.admin.email && pw === state.admin.password) {
    setLoginMsg('login-msg','Login successful! Loading dashboard…','success');
    setTimeout(() => {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      logAudit('Login', 'System', 'Admin Login', state.admin.username, 'Logged in successfully');
      refreshAll();
      loadSecurity();
    }, 900);
  } else {
    setLoginMsg('login-msg','Incorrect email or password.','error');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-password').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('login-email').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  // password toggle
  const toggleBtn = document.getElementById('toggle-login-pw');
  const pwInput = document.getElementById('login-password');
  if(toggleBtn) toggleBtn.addEventListener('click', () => {
    if(pwInput.type==='password') { pwInput.type='text'; toggleBtn.classList.replace('fa-eye','fa-eye-slash'); }
    else { pwInput.type='password'; toggleBtn.classList.replace('fa-eye-slash','fa-eye'); }
  });
});

function doLogout() {
  logAudit('Logout','System','Admin Logout',state.admin.username,'Logged out');
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-email').value='';
  document.getElementById('login-password').value='';
  const msg = document.getElementById('login-msg');
  if(msg) { msg.textContent=''; msg.className='global-msg'; }
}

//  NAVIGATION
function switchPanel(name, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  if(el) el.classList.add('active');
  const titles = { dashboard:'Dashboard', products:'Product Management', users:'User Management', orders:'Order Management', vouchers:'Voucher Management', 'arch-products':'Archived Products', 'arch-users':'Archived Users', 'arch-orders':'Archived Orders', admins:'Admin Management', audit:'Audit Trail', security:'Security & Settings' };
  document.getElementById('topbar-title').textContent = titles[name] || name;
  renderByPanel(name);
}

function renderByPanel(name) {
  if(name==='dashboard') renderDashboard();
  else if(name==='products') renderProducts();
  else if(name==='users') renderUsers();
  else if(name==='orders') renderOrders();
  else if(name==='vouchers') renderVouchers();
  else if(name==='admins') renderAdmins();
  else if(name==='audit') renderAudit();
  else if(name==='arch-products') renderArchProducts();
  else if(name==='arch-users') renderArchUsers();
  else if(name==='arch-orders') renderArchOrders();
}

function refreshAll() {
  renderDashboard();
  updateSidebarAdmin();
}

//  DASHBOARD
function renderDashboard() {
  const activeP = state.products.filter(p => p.status==='Active');
  const totalStock = state.products.reduce((a,p)=>a+p.stock,0);
  const pending = state.orders.filter(o=>o.status==='Pending').length;
  const revenue = state.orders.filter(o=>o.status==='Completed').reduce((a,o)=>a+o.total,0);
  const lowStock = state.products.filter(p=>p.stock < 10).length;

  document.getElementById('stat-products').textContent = activeP.length;
  document.getElementById('stat-stock').textContent = totalStock;
  document.getElementById('stat-orders').textContent = state.orders.length;
  document.getElementById('stat-pending-sub').textContent = pending+' pending';
  document.getElementById('stat-revenue').textContent = '₱'+revenue.toFixed(2);
  document.getElementById('stat-users').textContent = state.users.length;
  document.getElementById('stat-lowstock').textContent = lowStock;

  // categories
  const cats = {};
  state.products.forEach(p => { cats[p.category] = (cats[p.category]||0)+1; });
  document.getElementById('cat-breakdown').innerHTML = Object.entries(cats).map(([k,v])=>
    `<div class="cat-row"><span class="cat-name">${k}</span><span class="cat-count">${v}</span></div>`
  ).join('') || '<div style="color:var(--text-muted);font-size:13px">No products</div>';

  // order statuses
  const statuses = ['Pending','Processing','Shipped','Completed','Cancelled'];
  document.getElementById('order-status-breakdown').innerHTML = statuses.map(s=>{
    const c = state.orders.filter(o=>o.status===s).length;
    return `<div class="ost"><div class="ost-val">${c}</div><div class="ost-lbl">${s}</div></div>`;
  }).join('');

  // top selling
  const sold = {};
  state.orders.forEach(o => o.items.forEach(i => { sold[i.name]=(sold[i.name]||0)+i.qty; }));
  const sorted = Object.entries(sold).sort((a,b)=>b[1]-a[1]).slice(0,5);
  document.getElementById('top-selling').innerHTML = sorted.length ? sorted.map(([n,c],i)=>
    `<tr><td>${i+1}</td><td>${n}</td><td>${c}</td></tr>`
  ).join('') : '<tr><td colspan="3" style="color:var(--text-muted)">No sales data</td></tr>';

  // inv alerts
  const alerts = state.products.filter(p=>p.stock<10);
  document.getElementById('inv-alerts').innerHTML = alerts.length ? alerts.map(p=>
    `<tr><td>${p.name}</td><td>${p.stock}</td><td><span class="badge ${p.stock===0?'badge-cancelled':'badge-pending'}">${p.stock===0?'Out of Stock':'Low'}</span></td></tr>`
  ).join('') : '<tr><td colspan="3" style="color:var(--text-muted)">All stock levels healthy</td></tr>';

  // activity
  document.getElementById('activity-log').innerHTML = state.audit.slice(-8).reverse().map(a=>
    `<div class="activity-item"><div class="act-dot"></div><div><div>${a.desc}</div><div class="act-time">${a.time} · ${a.admin}</div></div></div>`
  ).join('') || '<div style="color:var(--text-muted);font-size:13px">No recent activity</div>';
}

//  PRODUCTS
let productFilter = 'all';
function filterProducts(cat, el) {
  productFilter = cat;
  document.querySelectorAll('#product-filter-bar .filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}
const PROVINCES = ['Vigan','Baguio','Tagaytay','Bohol','Boracay'];
const SUBCATS   = ['Clothes','Handicrafts','Delicacies','Decorations','Homeware'];
function renderProducts(list) {
  let data;
  if (list) { data = list; }
  else if (productFilter === 'all') { data = state.products; }
  else if (PROVINCES.includes(productFilter)) { data = state.products.filter(p=>p.category===productFilter); }
  else if (SUBCATS.includes(productFilter)) { data = state.products.filter(p=>p.subcategory===productFilter); }
  else { data = state.products; }
  const tbody = document.getElementById('products-tbody');
  tbody.innerHTML = data.map(p => `
    <tr>
      <td>${p.image ? `<img class="img-preview" src="${p.image}" onerror="this.style.display='none'" />` : '<div class="img-preview" style="display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--text-muted)"><i class="fa-solid fa-bag-shopping"></i></div>'}</td>
      <td><div style="font-weight:500">${p.name}</div><div style="font-size:12px;color:var(--text-muted)">${p.brand}</div></td>
      <td><span class="badge badge-shipped" style="font-size:10px">${p.category}</span></td>
      <td><span class="badge badge-user" style="font-size:10px">${p.subcategory||'—'}</span></td>
      <td><span class="${p.stock<10?'badge badge-pending':''}">${p.stock}</span></td>
      <td>₱${p.price}${p.discount>0?` <span style="font-size:11px;color:var(--accent-coral)">-${p.discount}%</span>`:''}</td>
      <td><span class="badge ${p.status==='Active'?'badge-active':'badge-inactive'}">${p.status}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-outline" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="archiveProduct('${p.id}')">Archive</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px">No products found</td></tr>`;
  document.getElementById('products-footer').textContent = `Showing ${data.length} products`;
}

function handleImgUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => setProductImagePreview(e.target.result);
  reader.readAsDataURL(file);
}

function handleImgDrop(event) {
  event.preventDefault();
  document.getElementById('img-upload-area').classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) { showToast('Please drop a valid image file'); return; }
  if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => setProductImagePreview(e.target.result);
  reader.readAsDataURL(file);
}

function setProductImagePreview(src) {
  document.getElementById('p-image').value = src;
  document.getElementById('p-image-preview').src = src;
  document.getElementById('img-upload-placeholder').style.display = 'none';
  document.getElementById('img-upload-preview').style.display = 'flex';
}

function clearProductImage() {
  document.getElementById('p-image').value = '';
  document.getElementById('p-image-file').value = '';
  document.getElementById('p-image-preview').src = '';
  document.getElementById('img-upload-placeholder').style.display = 'flex';
  document.getElementById('img-upload-preview').style.display = 'none';
}

function saveProduct() {
  const id = document.getElementById('edit-product-id').value;
  const addStock = parseInt(document.getElementById('p-addstock').value)||0;
  const stockVal = parseInt(document.getElementById('p-stock').value)||0;
  const p = {
    id: id || 'P'+Date.now(),
    name: document.getElementById('p-name').value,
    brand: document.getElementById('p-brand').value,
    desc: document.getElementById('p-desc').value,
    category: document.getElementById('p-category').value,
    subcategory: document.getElementById('p-subcategory').value,
    status: document.getElementById('p-status').value,
    stock: stockVal + addStock,
    price: parseFloat(document.getElementById('p-price').value)||0,
    discount: parseFloat(document.getElementById('p-discount').value)||0,
    image: document.getElementById('p-image').value,
  };
  if(!p.name || !p.category || !p.subcategory || !p.price) { showToast('Fill in required fields'); return; }
  if(id) {
    const idx = state.products.findIndex(x=>x.id===id);
    if(idx>-1) state.products[idx] = p;
    logAudit('Update','Product',p.name,state.admin.username,'Product updated');
    showToast('Product updated!');
  } else {
    state.products.push(p);
    logAudit('Create','Product',p.name,state.admin.username,'Product created');
    showToast('Product added!');
  }
  closeModal('modal-product');
  renderProducts();
  renderDashboard();
}

function editProduct(id) {
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('product-modal-title').textContent = 'Edit Product';
  document.getElementById('edit-product-id').value = p.id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-brand').value = p.brand;
  document.getElementById('p-desc').value = p.desc;
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-subcategory').value = p.subcategory||'';
  document.getElementById('p-status').value = p.status;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('p-addstock').value = '';
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-discount').value = p.discount;
  document.getElementById('p-image').value = p.image;
  if (p.image) {
    setProductImagePreview(p.image);
  } else {
    clearProductImage();
  }
  openModal('modal-product');
}

function archiveProduct(id) {
  const idx = state.products.findIndex(x=>x.id===id);
  if(idx<0) return;
  const p = state.products.splice(idx,1)[0];
  state.archivedProducts.push(p);
  logAudit('Archive','Product',p.name,state.admin.username,'Product archived');
  addNotif(`Product "${p.name}" archived`);
  showToast('Product archived');
  renderProducts();
  renderDashboard();
}

//  USERS
function censorEmail(email) {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(0, 2);
  const censored = visible + '*'.repeat(Math.max(local.length - 2, 3));
  return censored + '@' + domain;
}

function censorName(name) {
  if (!name) return '—';
  return name.split(' ').map((w, i) => {
    if (i === 0) return w.slice(0, 1) + '*'.repeat(Math.max(w.length - 1, 3));
    return '*'.repeat(w.length || 3);
  }).join(' ');
}

function censorPhone(phone) {
  if (!phone) return '—';
  const s = phone.replace(/\D/g, '');
  return s.slice(0, 3) + '*'.repeat(Math.max(s.length - 5, 3)) + s.slice(-2);
}

function censorAddress(address) {
  if (!address) return '—';
  const parts = address.split(',');
  const masked = '*'.repeat(8);
  return parts.length > 1
    ? masked + ',' + parts.slice(1).join(',')
    : masked;
}

function renderUsers(list) {
  const data = list || state.users;
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = data.map(u => `
    <tr>
      <td><b>${u.username}</b></td>
      <td>${censorEmail(u.email)}</td>
      <td style="font-family:monospace">${u.password}</td>
      <td><span class="badge badge-user">User</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-outline" onclick="viewUserOrders('${u.id}')">Orders</button>
        <button class="btn btn-sm btn-danger" onclick="archiveUser('${u.id}')">Archive</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px">No users registered</td></tr>`;
  document.getElementById('users-footer').textContent = `Showing ${data.length} users`;
}

function changeUserRole(id) {
  const u = state.users.find(x=>x.id===id);
  if(!u) return;
  const roles = ['User','Seller','Manager'];
  const cur = roles.indexOf(u.role);
  u.role = roles[(cur+1)%roles.length];
  logAudit('Update','User',u.username,state.admin.username,`Role changed to ${u.role}`);
  showToast(`Role changed to ${u.role}`);
  renderUsers();
}

function viewUserOrders(uid) {
  const user = state.users.find(x=>x.id===uid);
  const orders = state.orders.filter(o=>o.email===user?.email);
  document.getElementById('uo-tbody').innerHTML = orders.map(o=>
    `<tr><td>${o.id}</td><td>₱${o.total}</td><td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td><td>${o.date}</td></tr>`
  ).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No orders</td></tr>';
  openModal('modal-user-orders');
}

function archiveUser(id) {
  const idx = state.users.findIndex(x=>x.id===id);
  if(idx<0) return;
  const u = state.users.splice(idx,1)[0];
  state.archivedUsers.push(u);
  logAudit('Archive','User',u.username,state.admin.username,'User archived');
  showToast('User archived');
  renderUsers();
  renderDashboard();
}

//  ORDERS
let orderFilter = 'all';
function filterOrders(status, el) {
  orderFilter = status;
  document.querySelectorAll('#panel-orders .filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderOrders();
}
const ORDER_STATUSES = ['Pending','Processing','Shipped','Completed','Cancelled'];

function simulateCustomerReceived(id) {
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  o.customerConfirmed = 'received';
  logAudit('Update','Order',o.id,'Customer (User)','Customer confirmed order received');
  addNotif(`Customer confirmed receipt of order ${o.id}`);
  showToast(`Order ${o.id}: Customer marked as Received`);
  renderOrders();
  renderDashboard();
}

function getConfirmPill(o) {
  if (!['Shipped','Completed','Delivered'].includes(o.status)) return '';
  if (o.customerConfirmed === 'received') {
    return `<span class="confirm-pill confirm-received" title="Customer confirmed receipt"><i class="fa-solid fa-circle-check"></i> Received</span>`;
  }
  if (o.status === 'Shipped') {
    return `<span class="confirm-pill confirm-pending" title="Waiting for customer confirmation"><i class="fa-regular fa-clock"></i> Pending</span>`;
  }
  return '';
}

function changeOrderStatusInline(id, newStatus) {
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  const old = o.status;
  o.status = newStatus;
  if (newStatus === 'Shipped' && !o.customerConfirmed) o.customerConfirmed = 'pending';
  if (newStatus === 'Cancelled' || newStatus === 'Pending' || newStatus === 'Processing') o.customerConfirmed = null;
  logAudit('Update','Order',o.id,state.admin.username,`Status changed from ${old} → ${newStatus}`);
  showToast(`Order ${id} → ${newStatus}`);
  renderOrders();
  renderDashboard();
}

function renderOrders(list) {
  const data = list || (orderFilter==='all' ? state.orders : state.orders.filter(o=>o.status===orderFilter));
  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = data.map(o => `
    <tr>
      <td><b>${o.id}</b></td>
      <td>${censorName(o.customer)}</td>
      <td>₱${o.total.toFixed(2)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <select class="status-dropdown status-${o.status.toLowerCase()}" onchange="changeOrderStatusInline('${o.id}', this.value)">
            ${ORDER_STATUSES.map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
          ${getConfirmPill(o)}
        </div>
      </td>
      <td>${o.date}</td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm btn-outline" onclick="viewOrder('${o.id}')">View</button>
        <button class="btn btn-sm btn-danger" onclick="archiveOrder('${o.id}')">Archive</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px">No orders found</td></tr>`;
  document.getElementById('orders-footer').textContent = `Showing ${data.length} orders`;
}

function viewOrder(id) {
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  state.currentOrderId = id;
  document.getElementById('od-name').textContent = censorName(o.customer);
  document.getElementById('od-email').textContent = censorEmail(o.email);
  document.getElementById('od-phone').textContent = censorPhone(o.phone);
  document.getElementById('od-id').textContent = o.id;
  document.getElementById('od-status').innerHTML = `<span class="badge badge-${o.status.toLowerCase()}">${o.status}</span> ${getConfirmPill(o)}`;
  document.getElementById('od-total').textContent = '₱'+o.total.toFixed(2);
  document.getElementById('od-date').textContent = o.date;
  document.getElementById('od-address').textContent = censorAddress(o.address);
  document.getElementById('od-items').innerHTML = o.items.map(i=>
    `<tr><td>${i.name}</td><td>${i.qty}</td><td>₱${i.price}</td><td>₱${(i.qty*i.price).toFixed(2)}</td></tr>`
  ).join('');
  openModal('modal-order');
}

function updateOrderStatus() {
  const o = state.orders.find(x=>x.id===state.currentOrderId);
  if(!o) return;
  const flow = ['Pending','Processing','Shipped','Completed'];
  const idx = flow.indexOf(o.status);
  if(idx < flow.length-1) { o.status = flow[idx+1]; logAudit('Update','Order',o.id,state.admin.username,`Status → ${o.status}`); showToast(`Status → ${o.status}`); }
  else { showToast('Order already completed'); }
  closeModal('modal-order');
  renderOrders();
  renderDashboard();
}

function archiveOrder(id) {
  const idx = state.orders.findIndex(x=>x.id===id);
  if(idx<0) return;
  const o = state.orders.splice(idx,1)[0];
  state.archivedOrders.push(o);
  logAudit('Archive','Order',o.id,state.admin.username,'Order archived');
  showToast('Order archived');
  renderOrders();
  renderDashboard();
}

//  VOUCHERS
function renderVouchers(list) {
  const data = list || state.vouchers;
  const tbody = document.getElementById('vouchers-tbody');
  tbody.innerHTML = data.map(v => `
    <tr>
      <td><span class="voucher-code">${v.code}</span></td>
      <td>${v.type}</td>
      <td>${v.type.includes('%') ? v.value+'%' : '₱'+v.value}</td>
      <td>₱${v.minPurchase}</td>
      <td>${v.used}/${v.limit||'∞'}</td>
      <td>${v.until}</td>
      <td><span class="badge ${v.status==='Active'?'badge-active':'badge-inactive'}">${v.status}</span></td>
      <td style="display:flex;gap:6px">
        <button class="btn btn-sm btn-outline" onclick="editVoucher('${v.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteVoucher('${v.id}')">Delete</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px">No vouchers</td></tr>`;
  document.getElementById('vouchers-footer').textContent = `Showing ${data.length} vouchers`;
}

function saveVoucher() {
  const id = document.getElementById('edit-voucher-id').value;
  const v = {
    id: id || 'V'+Date.now(),
    code: document.getElementById('v-code').value.toUpperCase(),
    type: document.getElementById('v-type').value,
    value: parseFloat(document.getElementById('v-value').value)||0,
    minPurchase: parseFloat(document.getElementById('v-minpurchase').value)||0,
    maxDiscount: parseFloat(document.getElementById('v-maxdiscount').value)||0,
    limit: parseInt(document.getElementById('v-limit').value)||0,
    used: 0,
    from: document.getElementById('v-from').value,
    until: document.getElementById('v-until').value,
    status: document.getElementById('v-status').value,
    desc: document.getElementById('v-desc').value,
  };
  if(!v.code || !v.type) { showToast('Fill required fields'); return; }
  if(id) { const idx=state.vouchers.findIndex(x=>x.id===id); if(idx>-1) { v.used=state.vouchers[idx].used; state.vouchers[idx]=v; } logAudit('Update','Voucher',v.code,state.admin.username,'Voucher updated'); showToast('Voucher updated!'); }
  else { state.vouchers.push(v); logAudit('Create','Voucher',v.code,state.admin.username,'Voucher created'); showToast('Voucher added!'); }
  closeModal('modal-voucher');
  renderVouchers();
}

function editVoucher(id) {
  const v = state.vouchers.find(x=>x.id===id);
  if(!v) return;
  document.getElementById('edit-voucher-id').value = v.id;
  document.getElementById('v-code').value = v.code;
  document.getElementById('v-type').value = v.type;
  document.getElementById('v-value').value = v.value;
  document.getElementById('v-minpurchase').value = v.minPurchase;
  document.getElementById('v-maxdiscount').value = v.maxDiscount;
  document.getElementById('v-limit').value = v.limit;
  document.getElementById('v-from').value = v.from;
  document.getElementById('v-until').value = v.until;
  document.getElementById('v-status').value = v.status;
  document.getElementById('v-desc').value = v.desc;
  openModal('modal-voucher');
}

function deleteVoucher(id) {
  const idx = state.vouchers.findIndex(x=>x.id===id);
  if(idx<0) return;
  const v = state.vouchers.splice(idx,1)[0];
  logAudit('Delete','Voucher',v.code,state.admin.username,'Voucher deleted');
  showToast('Voucher deleted');
  renderVouchers();
}

//  ADMINS
function renderAdmins() {
  const allAdmins = [state.admin, ...state.admins];
  const tbody = document.getElementById('admins-tbody');
  tbody.innerHTML = allAdmins.map(a => `
    <tr>
      <td><b>${a.username}</b></td>
      <td>${a.email}</td>
      <td>${a.fname||''} ${a.lname||''}</td>
      <td><span class="badge badge-admin">${a.role}</span></td>
      <td>${a.since || '—'}</td>
      <td>${a.id!==state.admin.id ? `<button class="btn btn-sm btn-danger" onclick="deleteAdmin('${a.id}')">Remove</button>` : '<span style="color:var(--text-muted);font-size:12px">You</span>'}</td>
    </tr>
  `).join('');
  document.getElementById('admins-footer').textContent = `Showing ${allAdmins.length} admins`;
}

function saveAdmin() {
  const id = document.getElementById('edit-admin-id').value;
  const a = {
    id: id || 'ADM'+Date.now(),
    username: document.getElementById('a-username').value,
    email: document.getElementById('a-email').value,
    fname: document.getElementById('a-fname').value,
    lname: document.getElementById('a-lname').value,
    phone: document.getElementById('a-phone').value,
    password: document.getElementById('a-password').value,
    role: document.getElementById('a-superadmin').checked ? 'Super Admin' : 'Admin',
    since: new Date().toLocaleDateString(),
  };
  if(!a.username||!a.email) { showToast('Fill required fields'); return; }
  if(id) { const idx=state.admins.findIndex(x=>x.id===id); if(idx>-1) state.admins[idx]=a; logAudit('Update','Admin',a.username,state.admin.username,'Admin updated'); showToast('Admin updated!'); }
  else { state.admins.push(a); logAudit('Create','Admin',a.username,state.admin.username,'Admin created'); showToast('Admin added!'); }
  closeModal('modal-admin');
  renderAdmins();
}

function deleteAdmin(id) {
  const idx = state.admins.findIndex(x=>x.id===id);
  if(idx<0) return;
  const a = state.admins.splice(idx,1)[0];
  logAudit('Delete','Admin',a.username,state.admin.username,'Admin removed');
  showToast('Admin removed');
  renderAdmins();
}

//  AUDIT
let auditFilter = 'all';
function logAudit(action, entity, name, admin, desc) {
  state.audit.push({ action, entity, name, admin, desc, time: new Date().toLocaleString() });
}
function filterAudit(action, el) {
  auditFilter = action;
  document.querySelectorAll('#panel-audit .filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderAudit();
}
function renderAudit() {
  const data = auditFilter==='all' ? state.audit : state.audit.filter(a=>a.action===auditFilter);
  const classes = { Create:'audit-create', Update:'audit-update', Delete:'audit-delete', Login:'audit-login', Logout:'audit-login', Archive:'audit-archive' };
  const tbody = document.getElementById('audit-tbody');
  tbody.innerHTML = [...data].reverse().map(a=>
    `<tr><td style="font-size:12px;color:var(--text-muted)">${a.time}</td><td><span class="audit-action-badge ${classes[a.action]||''}">${a.action}</span></td><td>${a.entity}</td><td>${a.admin}</td><td>${a.desc}</td></tr>`
  ).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px">No logs</td></tr>`;
  document.getElementById('audit-footer').textContent = `Showing ${data.length} logs`;
}

//  ARCHIVES
function renderArchProducts() {
  document.getElementById('arch-products-tbody').innerHTML = state.archivedProducts.map(p=>
    `<tr><td><div class="img-preview" style="display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--text-muted)"><i class="fa-solid fa-bag-shopping"></i></div></td><td>${p.name}</td><td>${p.category}</td><td>${p.stock}</td><td><button class="btn btn-sm btn-teal" onclick="restoreProduct('${p.id}')">Restore</button></td></tr>`
  ).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px">No archived products</td></tr>';
}
function restoreProduct(id) {
  const idx = state.archivedProducts.findIndex(x=>x.id===id);
  if(idx<0) return;
  const p = state.archivedProducts.splice(idx,1)[0];
  p.status = 'Active';
  state.products.push(p);
  logAudit('Unarchive','Product',p.name,state.admin.username,'Product restored');
  showToast('Product restored!');
  renderArchProducts();
  renderDashboard();
}

function renderArchUsers() {
  document.getElementById('arch-users-tbody').innerHTML = state.archivedUsers.map(u=>
    `<tr><td>${u.username}</td><td>${censorEmail(u.email)}</td><td>${u.role}</td><td><button class="btn btn-sm btn-teal" onclick="restoreUser('${u.id}')">Restore</button></td></tr>`
  ).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:24px">No archived users</td></tr>';
}
function restoreUser(id) {
  const idx = state.archivedUsers.findIndex(x=>x.id===id);
  if(idx<0) return;
  const u = state.archivedUsers.splice(idx,1)[0];
  state.users.push(u);
  logAudit('Unarchive','User',u.username,state.admin.username,'User restored');
  showToast('User restored!');
  renderArchUsers();
  renderDashboard();
}

function renderArchOrders() {
  document.getElementById('arch-orders-tbody').innerHTML = state.archivedOrders.map(o=>
    `<tr><td>${o.id}</td><td>${censorName(o.customer)}</td><td>₱${o.total}</td><td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td><td>${o.date}</td><td><button class="btn btn-sm btn-teal" onclick="restoreOrder('${o.id}')">Restore</button></td></tr>`
  ).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px">No archived orders</td></tr>';
}
function restoreOrder(id) {
  const idx = state.archivedOrders.findIndex(x=>x.id===id);
  if(idx<0) return;
  const o = state.archivedOrders.splice(idx,1)[0];
  state.orders.push(o);
  logAudit('Unarchive','Order',o.id,state.admin.username,'Order restored');
  showToast('Order restored!');
  renderArchOrders();
  renderDashboard();
}

//  SECURITY
function loadSecurity() {
  document.getElementById('prof-username').value = state.admin.username;
  document.getElementById('prof-email').value = state.admin.email;
  document.getElementById('prof-fname').value = state.admin.fname||'';
  document.getElementById('prof-lname').value = state.admin.lname||'';
  document.getElementById('acc-role').textContent = state.admin.role;
  document.getElementById('acc-id').textContent = '#'+state.admin.id;
  document.getElementById('admin-since').textContent = state.admin.since;
  updateSidebarAdmin();
}

function changePassword() {
  const cur = document.getElementById('cur-pw').value;
  const nw = document.getElementById('new-pw').value;
  const cn = document.getElementById('con-pw').value;
  if(cur !== state.admin.password) { showToast('Current password incorrect'); return; }
  if(nw.length < 6) { showToast('New password must be at least 6 chars'); return; }
  if(nw !== cn) { showToast('Passwords do not match'); return; }
  state.admin.password = nw;
  logAudit('Update','System','Password',state.admin.username,'Password changed');
  showToast('Password updated!');
  document.getElementById('cur-pw').value='';
  document.getElementById('new-pw').value='';
  document.getElementById('con-pw').value='';
}

function updateProfile() {
  state.admin.username = document.getElementById('prof-username').value;
  state.admin.email = document.getElementById('prof-email').value;
  state.admin.fname = document.getElementById('prof-fname').value;
  state.admin.lname = document.getElementById('prof-lname').value;
  logAudit('Update','System','Profile',state.admin.username,'Profile updated');
  showToast('Profile updated!');
  updateSidebarAdmin();
}

function updateSidebarAdmin() {
  document.getElementById('sb-admin-name').textContent = state.admin.username;
  document.getElementById('sb-admin-role').textContent = state.admin.role;
}

//  SEARCH
function globalSearch(q) {
  q = q.toLowerCase();
  if(!q) { renderByPanel(getActivePanel()); return; }
  const panel = getActivePanel();
  if(panel==='products') renderProducts(state.products.filter(p=>p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||(p.subcategory||'').toLowerCase().includes(q)));
  else if(panel==='users') renderUsers(state.users.filter(u=>u.username.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)));
  else if(panel==='orders') renderOrders(state.orders.filter(o=>o.id.toLowerCase().includes(q)||o.customer.toLowerCase().includes(q)));
  else if(panel==='vouchers') renderVouchers(state.vouchers.filter(v=>v.code.toLowerCase().includes(q)));
}
function getActivePanel() {
  const a = document.querySelector('.panel.active');
  return a ? a.id.replace('panel-','') : 'dashboard';
}

//  NOTIFICATIONS
function addNotif(msg) {
  state.notifications.unshift({ msg, time: new Date().toLocaleTimeString() });
  renderNotifs();
}
function renderNotifs() {
  const cnt = state.notifications.length;
  document.getElementById('notif-count').textContent = cnt;
  document.getElementById('notif-body').innerHTML = cnt ? state.notifications.map(n=>
    `<div class="notif-item"><div class="ni-label">${n.msg}</div><div class="ni-time">${n.time}</div></div>`
  ).join('') : '<div class="notif-empty">No notifications</div>';
}
function toggleNotif() {
  document.getElementById('notif-panel').classList.toggle('open');
}
function clearNotifs() {
  state.notifications = [];
  renderNotifs();
  document.getElementById('notif-panel').classList.remove('open');
}
document.addEventListener('click', e => {
  if(!e.target.closest('.notif-btn') && !e.target.closest('#notif-panel')) {
    document.getElementById('notif-panel').classList.remove('open');
  }
});

//  MODAL HELPERS
function openModal(id) {
  if(id==='modal-product') {
    if(!document.getElementById('edit-product-id').value) {
      document.getElementById('product-modal-title').textContent = 'Add New Product';
      ['p-name','p-brand','p-desc','p-stock','p-addstock','p-price','p-discount'].forEach(x=>{ const el=document.getElementById(x); if(el) el.value=''; });
      document.getElementById('p-category').value='';
      document.getElementById('p-subcategory').value='';
      document.getElementById('p-status').value='Active';
      clearProductImage();
      document.getElementById('edit-product-id').value='';
    }
  }
  if(id==='modal-voucher' && !document.getElementById('edit-voucher-id').value) {
    ['v-code','v-value','v-minpurchase','v-maxdiscount','v-limit','v-from','v-until','v-desc'].forEach(x=>{ const el=document.getElementById(x); if(el) el.value=''; });
    document.getElementById('v-type').value='';
    document.getElementById('v-status').value='Active';
    document.getElementById('edit-voucher-id').value='';
  }
  if(id==='modal-admin') {
    document.getElementById('edit-admin-id').value='';
    ['a-username','a-email','a-fname','a-lname','a-phone','a-password'].forEach(x=>{ document.getElementById(x).value=''; });
    document.getElementById('a-superadmin').checked = false;
  }
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if(id==='modal-product') {
    document.getElementById('edit-product-id').value = '';
    document.getElementById('product-modal-title').textContent = 'Add New Product';
  }
  if(id==='modal-voucher') {
    document.getElementById('edit-voucher-id').value = '';
  }
}

function openAddProduct() {
  document.getElementById('edit-product-id').value = '';
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  ['p-name','p-brand','p-desc','p-stock','p-addstock','p-price','p-discount','p-image'].forEach(x=>{ const el=document.getElementById(x); if(el) el.value=''; });
  document.getElementById('p-category').value='';
  document.getElementById('p-subcategory').value='';
  document.getElementById('p-status').value='Active';
  document.getElementById('modal-product').classList.add('open');
}
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target===o) o.classList.remove('open'); }));

//  TOAST
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.style.display='none'; }, 2800);
}

//  INIT
logAudit('Create','System','Seed Data','system','Initial data seeded');
