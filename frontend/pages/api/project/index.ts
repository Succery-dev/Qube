// import { firebaseApp } from "../../../utils"
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// const db = getFirestore(firebaseApp);


// export default async (req: any, res: any) => {
//   const projectsCollection = collection(db, "projects");

//   try {
//     if (req.method === "POST") {
//       const { id } = await addDoc(projectsCollection, req.body);

//       res.status(200).json({ id: id });
//     }
//   } catch (e) {
//     res.status(400).end();
//   }
// }