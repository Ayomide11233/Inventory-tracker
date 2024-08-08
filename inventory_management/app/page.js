'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

// Utility function to search for items
const searchItems = (inventory, searchTerm) => {
   return inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
   );
};

export default function Home() {
   const [inventory, setInventory] = useState([]);
   const [open, setOpen] = useState(false);
   const [itemName, setItemName] = useState('');
   const [searchTerm, setSearchTerm] = useState('');

   const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
         inventoryList.push({
            id: doc.id,           // Use document ID if needed
            name: doc.data().name || doc.id, // Use 'name' from data or fallback to ID
            quantity: doc.data().quantity,
         });
      });
      setInventory(inventoryList);
   };

   const addItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
         const { quantity } = docSnap.data();
         await setDoc(docRef, { quantity: quantity + 1 });
      } else {
         await setDoc(docRef, { quantity: 1 });
      }

      await updateInventory();
   };

   const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
         const { quantity } = docSnap.data();
         if (quantity === 1) {
            await deleteDoc(docRef);
         } else {
            await setDoc(docRef, { quantity: quantity - 1 });
         }
      }

      await updateInventory();
   };

   useEffect(() => {
      updateInventory();
   }, []);

   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   // Use the searchItems function to filter inventory based on searchTerm
   const filteredInventory = searchItems(inventory, searchTerm);

   return (
      <Box width={"100vw"} height={"100vh"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} gap={2}>
         <Modal open={open} onClose={handleClose}>
            <Box
               position={"absolute"}
               top={"50%"}
               left={"50%"}
               width={400}
               bgcolor={"white"}
               border={"2px solid #000"}
               boxShadow={24}
               padding={4}
               display={"flex"}
               flexDirection={"column"}
               gap={3}
               sx={{
                  transform: "translate(-50%, -50%)",
               }}
            >
               <Typography variant="h6">Add Item</Typography>
               <Stack width={"100%"} direction={"row"} spacing={2}>
                  <TextField
                     variant="outlined"
                     fullWidth
                     value={itemName}
                     onChange={(e) => {
                        setItemName(e.target.value);
                     }}
                  />
                  <Button
                     variant="outlined"
                     onClick={() => {
                        addItem(itemName);
                        setItemName('');
                        handleClose();
                     }}
                  >
                     Add item
                  </Button>
               </Stack>
            </Box>
         </Modal>
         <Button variant="contained" onClick={handleOpen}>
            Add New Item
         </Button>
         <TextField
            variant="outlined"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: 2, width: "50%" }}
         />
         <Box width={"800px"} border={"1px solid #333"}>
            <Box
               height={"100px"}
               bgcolor={"#ADD8E6"}
               display={"flex"}
               alignItems={"center"}
               justifyContent={"center"}
            >
               <Typography variant="h2" color={"#333"}>
                  Inventory Items
               </Typography>
            </Box>
            <Stack height={"300px"} spacing={2} sx={{ overflow: "auto" }}>
               {filteredInventory.length > 0 ? (
                  filteredInventory.map(({ name, quantity }) => (
                     <Box
                        key={name}
                        width={"100%"}
                        minHeight={"150px"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        bgcolor={"#f0f0f0"}
                        padding={5}
                     >
                        <Typography 
                        variant="h3"
                        color={"#333"}
                        textAlign={"center"}
                        >{name}</Typography>
                        <Typography
                        variant="h4"
                        color={"#333"}>Quantity: {quantity}</Typography>
                        <Stack direction={"row"} spacing={2}>
                        <Button onClick={() => removeItem(name)} variant="contained">Remove Item</Button>
                        <Button onClick={() => addItem(name)} variant="contained">Add Item</Button>
                        </Stack>
                     </Box>
                  ))
               ) : (
                  <Typography variant="h5" textAlign={"center"} padding={5}>
                     No items found
                  </Typography>
               )}
            </Stack>
         </Box>
      </Box>
   );
}
