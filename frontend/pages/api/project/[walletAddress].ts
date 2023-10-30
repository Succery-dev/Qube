import { firebaseApp } from "../../../utils"
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const db = getFirestore(firebaseApp);


export default async (req: any, res: any) => {
  const projectsCollection = collection(db, "projects");

  try {
    if (req.method === "GET") {
      const { walletAddress } = req.query;
      
      // Search for projects where "Client's Wallet Address" is equal to walletAddress
      const clientQuery = query(projectsCollection, where("Client's Wallet Address", "==", walletAddress));
      const clientSnapshot = await getDocs(clientQuery);
      const clientProjects = clientSnapshot.docs.map((project) => ({
        id: project.id,
        ...project.data(),
      }));

      // Search for projects where "Lancer's Wallet Address" is equal to walletAddress
      const lancerQuery = query(projectsCollection, where("Lancer's Wallet Address", "==", walletAddress));
      const lancerSnapshot = await getDocs(lancerQuery);
      const lancerProjects = lancerSnapshot.docs.map((project) => ({
        id: project.id,
        ...project.data(),
      }));

      // Combine the results and remove duplicates
      const allProjects = [...clientProjects, ...lancerProjects];
      const uniqueProjects = Array.from(new Set(allProjects.map(p => p.id))).map(id => {
        return allProjects.find(p => p.id === id);
      });

      res.status(200).json(uniqueProjects);
    }
  } catch (e) {
    res.status(400).end();
  }
}