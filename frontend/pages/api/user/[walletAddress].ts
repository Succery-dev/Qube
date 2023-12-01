import { firebaseApp } from "../../../utils"
import { getFirestore, getDoc, doc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default async (req: any, res: any) => {
  try {
    if (req.method === "GET") {
      const { walletAddress } = req.query;

      // ドキュメント参照の取得
      const userDocRef = doc(db, "users", walletAddress);

      // ドキュメントのデータ取得
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = {
          id: userSnapshot.id,
          ...userSnapshot.data()
        };
        res.status(200).json(userData);
      } else {
        // ドキュメントが存在しない場合
        res.status(404).json({ message: "No user found with the given wallet address" });
      }
    }
  } catch (e) {
    res.status(400).end();
  }
}