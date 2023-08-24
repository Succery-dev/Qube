// import { firebaseApp } from "../../../utils"
// import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

// const db = getFirestore(firebaseApp);


// export default async (req: any, res: any) => {
//   const projectsCollection = collection(db, "projects");

//   try {
//     if (req.method === "GET") {
//       const projectsQuery = query(projectsCollection, where("Client", "==", req.query.walletAddress));
//       const projectsSnapshot = await getDocs(projectsQuery);
//       const projects = projectsSnapshot.docs.map((project) => ({
//         id: project.id,
//         ...project.data(),
//       }));

//       res.status(200).json(projects);
//     }
//   } catch (e) {
//     res.status(400).end();
//   }
// }