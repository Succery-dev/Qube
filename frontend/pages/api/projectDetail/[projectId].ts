// import { firebaseApp } from "../../../utils"
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// const db = getFirestore(firebaseApp);


// export default async (req: any, res: any) => {
//   try {
//     if (req.method === "GET") {
//       const projectRef = doc(db, "projects", req.query.projectId);
//       const projectSnap = await getDoc(projectRef);

//       if (projectSnap.exists()) {
//         const projectData = projectSnap.data();
//         res.status(200).json(projectData);
//       } else {
//         res.status(404).json({ message: "Document not found" });
//       }
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: "Server Error" });
//   }
// }